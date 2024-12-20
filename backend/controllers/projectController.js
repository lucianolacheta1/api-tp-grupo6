const Project = require('../models/Project');
const User = require('../models/User');

// Obtener todos los proyectos del usuario autenticado
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los proyectos' });
  }
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
  const { name, detail, status, members } = req.body;

  try {
    const existingProject = await Project.findOne({ name: name, userId: req.user.userId });
    if (existingProject) {
      return res.status(400).json({ message: 'Ya existe un proyecto con ese nombre' });
    }

    // Obtener el usuario autenticado para usar su nombre
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let finalMembers = members;
    if (!finalMembers || !Array.isArray(finalMembers) || finalMembers.length === 0) {
      finalMembers = [{
        name: user.username,
        userId: user._id,
        isTemporary: false,
      }];
    } else {
      // Inserta el usuario al inicio sin sobrescribir el primer elemento existente
      finalMembers.unshift({
        name: user.username,
        userId: user._id,
        isTemporary: false
      });
    }

    // Checar que el primer miembro tenga nombre
    if (!finalMembers[0].name) {
      return res.status(400).json({ message: 'Debes proporcionar al menos un miembro con nombre.' });
    }

    const project = new Project({
      userId: req.user.userId,
      name,
      detail,
      members: finalMembers,
      totalExpense: 0,
      status: status || 'En progreso',
    });

    const newProject = await project.save();
    console.log('Proyecto guardado exitosamente en la base de datos:', newProject);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error al crear el proyecto:', err);
    res.status(400).json({ message: 'Error al crear el proyecto' });
  }
};

// Obtener un proyecto por ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

// Actualizar un proyecto
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar el proyecto' });
  }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

// Añadir ticket a un proyecto existente
exports.addTicketToProject = async (req, res) => {
  const { id } = req.params;
  const { date, products, paidBy, divisionType, divisionMembers } = req.body;

  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const newTicket = {
      date,
      products,
      paidBy,
      divisionType,
      divisionMembers,
    };

    project.tickets.push(newTicket);
    await project.save();

    res.status(201).json({ message: 'Ticket añadido exitosamente', project });
  } catch (err) {
    console.error('Error al añadir el ticket al proyecto:', err);
    res.status(500).json({ message: 'Error al añadir el ticket al proyecto' });
  }
};

// Modificar un ticket existente en un proyecto
exports.updateTicketInProject = async (req, res) => {
  const { projectId, ticketId } = req.params;
  const { date, products, paidBy, divisionType, divisionMembers } = req.body;

  try {
    const project = await Project.findOne({ _id: projectId, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const ticket = project.tickets.id(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    // Actualizar los campos del ticket
    if (date) ticket.date = date;
    if (products) ticket.products = products;
    if (paidBy) ticket.paidBy = paidBy;
    if (divisionType) ticket.divisionType = divisionType;
    if (divisionMembers) ticket.divisionMembers = divisionMembers;

    await project.save();

    res.status(200).json({ message: 'Ticket actualizado exitosamente', project });
  } catch (err) {
    console.error('Error al actualizar el ticket:', err);
    res.status(500).json({ message: 'Error al actualizar el ticket' });
  }
};

// Eliminar un ticket de un proyecto existente
exports.deleteTicketFromProject = async (req, res) => {
  const { projectId, ticketId } = req.params;

  try {
    const project = await Project.findOne({ _id: projectId, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const ticketToRemove = project.tickets.id(ticketId);
    if (!ticketToRemove) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    project.tickets.pull(ticketId);
    await project.save();

    res.status(200).json({ message: 'Ticket eliminado exitosamente', project });
  } catch (err) {
    console.error('Error al eliminar el ticket:', err);
    res.status(500).json({ message: 'Error al eliminar el ticket' });
  }
};

// Añadir miembro al proyecto existente
exports.addMemberToProject = async (req, res) => {
  const { id } = req.params; // ID del proyecto
  const { name, userId, isTemporary } = req.body; // Información del nuevo miembro

  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Añadir miembro al proyecto
    project.members.push({ name, userId, isTemporary });
    await project.save();

    res.status(201).json({ message: 'Miembro añadido exitosamente', project });
  } catch (err) {
    console.error('Error al añadir miembro al proyecto:', err);
    res.status(500).json({ message: 'Error al añadir miembro al proyecto' });
  }
};

    // Eliminar miembro del proyecto
exports.deleteMemberFromProject = async (req, res) => {
  const { id, memberId } = req.params;

  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Filtrar al miembro a eliminar
    const updatedMembers = project.members.filter((member) => member._id.toString() !== memberId);
    project.members = updatedMembers;

    await project.save();
    res.status(200).json({ message: 'Miembro eliminado exitosamente', project });
  } catch (err) {
    console.error('Error al eliminar miembro del proyecto:', err);
    res.status(500).json({ message: 'Error al eliminar miembro del proyecto' });
  }
};

exports.getProjectBalances = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const members = project.members; 
    const paidMap = {};
    const oweMap = {};

    // Inicializar valores en 0 para cada miembro por su name
    members.forEach(m => {
      paidMap[m.name] = 0;
      oweMap[m.name] = 0;
    });

    // Calcular lo que pagó y lo que debe cada miembro
    project.tickets.forEach(ticket => {
      const totalTicket = ticket.products.reduce((sum, p) => sum + p.amount, 0);
      const payer = ticket.paidBy; // ahora es el nombre del miembro

      // Suma a lo pagado por el pagador
      if (paidMap[payer] !== undefined) {
        paidMap[payer] += totalTicket;
      }

      if (ticket.divisionType === 'equitativo') {
        const count = ticket.divisionMembers.length;
        const share = totalTicket / count;
        ticket.divisionMembers.forEach(dm => {
          const memberName = dm.memberId; // es el name del miembro
          if (oweMap[memberName] !== undefined) {
            oweMap[memberName] += share;
          }
        });
      } else {
        // porcentual
        ticket.divisionMembers.forEach(dm => {
          const memberName = dm.memberId; // es el name del miembro
          const portion = (totalTicket * dm.percentage) / 100;
          if (oweMap[memberName] !== undefined) {
            oweMap[memberName] += portion;
          }
        });
      }
    });

    // balance = lo que pagó - lo que debía pagar
    const balancesArr = [];
    for (const m of members) {
      const balance = (paidMap[m.name] || 0) - (oweMap[m.name] || 0);
      balancesArr.push({ name: m.name, balance });
    }

    // Ahora generamos las transacciones mínimas
    // Tomamos a los que tienen balance negativo (deudores) y positivo (acreedores)
    const debtors = balancesArr.filter(b => b.balance < 0).map(b => ({...b}));
    const creditors = balancesArr.filter(b => b.balance > 0).map(b => ({...b}));

    const result = [];

    // Mientras haya deudores y acreedores
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

      if (amount > 0) {
        result.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount
        });
      }

      // Actualizar balances
      debtor.balance += amount; // debtor.balance es negativo, sumamos amount para acercarlo a 0
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.0001) {
        i++;
      }
      if (creditor.balance < 0.0001) {
        j++;
      }
    }

    // result es array de {from, to, amount}
    res.json(result);

  } catch (err) {
    console.error('Error al obtener balances del proyecto:', err);
    res.status(500).json({ message: 'Error al obtener balances del proyecto' });
  }
};
