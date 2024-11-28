const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');

// @route   POST api/projects
// @desc    Create a new project
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/projects/:id
// @desc    Get a project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project by ID
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({msg: 'Project not found'});
    res.json({msg: 'Project deleted'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
