const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: false,
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
  tickets: [
    {
      image: String,
      date: String,
      products: [{ product: String, amount: Number }],
    },
  ],
  expenses: [
    {
      description: String,
      amount: Number,
      members: [String],
      divisionType: String,
      percentages: [Number],
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);
