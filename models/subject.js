const mongoose = require('mongoose');

//  Subject info 
const subjectScheme = new mongoose.Schema({
  local_id: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null,
  },
  read_more_url: {
    type: String,
    trim: true,
  }
});

const Subject = new mongoose.model('Subject', subjectScheme);

module.exports = Subject;