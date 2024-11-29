// controllers/projectController.js
const Project = require('../models/Project');

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
  const { name, detail, members, status } = req.body;
 
  const existingProject = await Project.findOne({ name: name, userId: req.user.userId });
  if (existingProject) {
    return res.status(400).json({ message: 'Ya existe un proyecto con ese nombre' });
  }
  
  const project = new Project({
    userId: req.user.userId,
    name,
    detail,
    members,
    totalExpense: 0,
    status,
  });

  try {
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
  const { image, date, products } = req.body;

  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const newTicket = {
      image,
      date,
      products,
    };

    project.tickets.push(newTicket);
    await project.save();

    res.status(201).json({ message: 'Ticket añadido exitosamente', project });
  } catch (err) {
    res.status(500).json({ message: 'Error al añadir el ticket al proyecto' });
  }
};

// Añadir gasto a un proyecto existente
exports.addExpenseToProject = async (req, res) => {
  const { id } = req.params;
  const { description, amount, members, divisionType, percentages } = req.body;

  try {
    const project = await Project.findOne({ _id: id, userId: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const newExpense = {
      description,
      amount,
      members,
      divisionType,
      percentages,
    };

    project.expenses.push(newExpense);
    project.totalExpense += amount;
    await project.save();

    res.status(201).json({ message: 'Gasto añadido exitosamente', project });
  } catch (err) {
    res.status(500).json({ message: 'Error al añadir el gasto al proyecto' });
  }
};
