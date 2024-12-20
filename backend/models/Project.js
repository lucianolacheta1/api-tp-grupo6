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
    type: String,
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
        type: String,
        required: true,
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
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
});

module.exports = mongoose.model('Project', projectSchema);
