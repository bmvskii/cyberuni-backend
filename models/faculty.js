const mongoose = require('mongoose');

const facultyScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  headman: {
    ref: 'Teacher',
    type: mongoose.Schema.Types.ObjectId,
  },
});

facultyScheme.virtual('teachers', {
  'ref': 'Teacher',
  'localField': '_id',
  'foreignField': 'faculty'
})

facultyScheme.virtual('headman', {
  'ref': 'Teacher',
  'foreignField': '_id',
  'localField': 'headman'
})

const Faculty = new mongoose.model('Faculty', facultyScheme);

module.exports = Task;