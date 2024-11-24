const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  ticket: {
    type: String,
    required: true,
  },
  expenses: {
    type: [Number],
    required: true,
  },
  members: {
    type: [String],
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Project', projectSchema);