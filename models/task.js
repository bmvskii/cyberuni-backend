const mongoose = require('mongoose');
const validator = require('validator');

const taskScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  expirationDate: {
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student',
  },
}, {
  timestamps: true,
});

const Task = new mongoose.model('Task', taskScheme);

module.exports = Task;