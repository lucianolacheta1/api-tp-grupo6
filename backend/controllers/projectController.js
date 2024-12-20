const Project = require('../models/Project');
const User = require('../models/User');
const Friend = require('../models/Friend');
const sendMail = require('../config/mailer');


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
      // Forzar el primer miembro a ser el usuario actual
      finalMembers[0] = {
        name: user.username,
        userId: user._id,
        isTemporary: false
      };
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

// Añadir un miembro al proyecto
exports.addMemberToProject = async (req, res) => {
  const { projectId } = req.params;
  const { friendId, name } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    let newMember;
    if (friendId) {
      const friend = await Friend.findById(friendId);
      if (!friend) {
        return res.status(404).json({ message: 'Amigo no encontrado' });
      }
      newMember = {
        userId: friendId,
        name: friend.name,
        isTemporary: false,
      };
    } else {
      if (!name) {
        return res.status(400).json({ message: 'El nombre es obligatorio si no seleccionas un amigo' });
      }
      newMember = {
        name,
        userId: null,
        isTemporary: true,
      };
    }

    project.members.push(newMember);
    await project.save();

    if (!newMember.isTemporary) {
      const subject = 'Has sido añadido a un nuevo proyecto';
      const text = `Hola ${newMember.name},\n\nHas sido añadido al proyecto "${project.name}".\n\nSaludos,\nEquipo de Proyectos`;
      await sendMail(friend.email, subject, text);
    }

    res.status(201).json({ message: 'Miembro añadido con éxito', project });
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
