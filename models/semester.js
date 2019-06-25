const mongoose = require('mongoose');

const semesterScheme = new mongoose.Schema({
  number: { 
    type: Number,
    unique: true,
    required: true,
  },
  
  disciplines: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subjects',
      default: null,
    },
    type: {
      type: String,
      default: 'credit',
      trim: true,
    },
    lectures: {
      type: Number,
      default: 0,
    },
    laboratories: {
      type: Number,
      default: 0,
    },
    passing_date: {
      type: Date,
      default: null,
    },
  }],
  
  start_date: {
    type: Date,
    required: true,
  },
  finish_date: {
    type: Date,
    required: true,
  },
  session_start: {
    type: Date,
    default: null,
  },
  session_end: {
    type: Date,
    default: null,
  }
});

semesterScheme.virtual('subjects', {
  'localField': 'disciplines',
  'foreignField': '_id',
  'ref': 'Subject'
})

const Semester = new mongoose.model('Semester', semesterScheme);

module.exports = Semester;