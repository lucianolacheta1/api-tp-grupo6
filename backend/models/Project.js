const mongoose = require('mongoose');

// Esquema de producto dentro de un ticket
const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// Esquema de ticket
const ticketSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  products: [productSchema],
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  divisionType: {
    type: String,
    enum: ['equitativo', 'porcentual'],
    required: true,
  },
  divisionMembers: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
          return this.divisionType === 'porcentual';
        },
      },
      percentage: {
        type: Number,
        required: function () {
          return this.divisionType === 'porcentual';
        },
      },
    },
  ],
});

// Validación de porcentaje total para el esquema de ticket
ticketSchema.pre('save', function (next) {
  if (this.divisionType === 'porcentual') {
    const totalPercentage = this.divisionMembers.reduce((total, member) => total + member.percentage, 0);
    if (totalPercentage !== 100) {
      return next(new Error('La suma de los porcentajes debe ser igual a 100.'));
    }
  }
  next();
});

// Esquema de miembro dentro de un proyecto
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  isTemporary: {
    type: Boolean,
    default: false,
  },
});

// Esquema de proyecto
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
  detail: String,
  members: [memberSchema],
  totalExpense: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['En progreso', 'Finalizado'],
    default: 'En progreso',
  },
  tickets: [ticketSchema],
  expenses: [
    {
      description: String,
      amount: Number,
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      divisionType: String,
      percentages: [Number],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
