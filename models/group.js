const mongoose = require('mongoose');

const groupScheme = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  course_number: {
    type: Number,
  },
  cathedra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catherda",
  },
  headman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  curator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curator',
  },
});

groupScheme.virtual('students', {
  'ref': 'Student',
  'foreignField': 'group',
  'localField': '_id',
});

groupScheme.virtual('getCurator', {
  'ref': 'Teacher',
  'foreignField': '_id',
  'localField': 'curator',
});

groupScheme.virtual('getHeadman', {
  'ref': 'Student',
  'foreignField': '_id',
  'localField': 'headman',
});

const Group = new mongoose.model('Group', groupScheme);

module.exports = Group;