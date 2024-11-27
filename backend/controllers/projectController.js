// controllers/projectController.js
const Project = require('../models/Project');

// Obtener todos los proyectos
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los proyectos' });
  }
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
  const { name, detail, ticket, expenses, members, totalExpense, status } = req.body;

  const project = new Project({
    name,
    detail,
    ticket,
    expenses,
    members,
    totalExpense,
    status,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear el proyecto' });
  }
};

// Obtener un proyecto por ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
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
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};
