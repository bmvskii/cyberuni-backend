const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generateAuthToken, findByCredentials } = require('../utils');
const { HOST_URL } = require('../config/db_settings');

const Task = require('../models/task')
const ROLES = require('../config/db_roles');

const studentSchema = new mongoose.Schema({
  role: {
    type: Number,
    required: true,
    default: ROLES.STUDENT,
  },
  photo_source: {
    type: Buffer,
    default: null,
  },
  photo: {
    type: String,
    default: '',
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  birth_day: {
    type: Number,
    min: 1,
    max: 31,
  },
  birth_month: {
    type: Number,
    min: 1,
    max: 12,
  },
  birth_year: {
    type: Number,
    min: 1900,
    max: 2019,
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Пароль не введен']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('It is not an email')
      }
    }
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  fav_subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    default: null,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    default: null,
  },
  diploma_topic: {
    type: String,
    default: "",
  },
  diploma_teacher: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  learning_subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      unique: true,
    },
    marks: {
      type: [Number],
      default: 0,
      min: 0,
      max: 100
    },
    type: {
      type: String,
      default: 'credit',
      unique: true,
    },
    visited_lectures: {
      type: Number,
      min: 0,
      default: 0
    },
    visited_laboratories: {
      type: Number,
      min: 0,
      default: 0
    },
    missed_lectures: {
      min: 0,
      default: 0,
      type: Number,
    },
    missed_laboratories: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  telegram: {
    type: String,
    default: null,
  },
  instagram: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  facebook: {
    type: String,
    default: null,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
}, {
    timestamps: true,
  });


studentSchema.methods.toJSON = function () {
  const student = this
  const studentObject = student.toObject()

  delete studentObject.photo_source
  delete studentObject.tokens

  return studentObject
}

studentSchema.methods.generateAuthToken = generateAuthToken
studentSchema.statics.findByCredentials = async (email, password, model) => {
  const user = await Student.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

studentSchema.virtual('tasks', {
  'ref': 'Task',
  'localField': '_id',
  'foreignField': 'owner',
});

studentSchema.virtual('getMyGroup', {
  'ref': 'Group',
  'localField': 'group',
  'foreignField': '_id',
})

studentSchema.virtual('getDiplomaTeacher', {
  'ref': 'Teacher',
  'localField': 'diploma_teacher',
  'foreignField': '_id',
})

studentSchema.virtual('getMyCourse', {
  'ref': 'Course',
  'localField': 'course',
  'foreignField': '_id',
})

studentSchema.virtual('favouriteSubject', {
  'ref': 'Subject',
  'localField': 'fav_subject',
  'foreignField': '_id',
})

studentSchema.virtual('getSemester', {
  'ref': 'Semester',
  'localField': 'semester',
  'foreignField': '_id',
})

studentSchema.virtual('getSubject', {
  'ref': 'Subject',
  'localField': 'subject',
  'foreignField': '_id',
})

studentSchema.pre('save', async function (next) {
  const student = this;

  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8);
  }

  if (student.photo_source) {
    student.photo = `${HOST_URL}/students/${student._id}/photo`;
  }

  next();
});

studentSchema.pre('remove', async function (next) {
  const student = this
  await Task.deleteMany({ owner: student._id });
  next()
});

const Student = new mongoose.model('Student', studentSchema);

module.exports = Student;