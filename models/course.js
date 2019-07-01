const mongoose = require('mongoose');
const validator = require('validator');

const courseScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Empty course name'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  teacher: {
    type: mongoose.Scheme.Type.ObjectId,
    ref: 'Teacher',
  },
  subjects: {
    type: [String]
  },
  groups: {
    type: [String],
  }
});

const Course = new mongoose.model('Course', courseScheme);

module.exports = Course;