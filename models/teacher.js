const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const { USER_DEFAULT_ICON } = require('../global/resources');
const { generateAuthToken, findByCredentials } = require('../utils')
const { JWT_KEY } = require('../config/auth_settings')
const { HOST_URL } = require('../config/db_settings');

const ACCOUNT_SETTINGS = require('../config/account_settings');
const ROLES = require('../config/db_roles');

const teacherScheme = new mongoose.Schema({
  role: {
    type: Number,
    default: ROLES.TEACHER,
  },
  photo_source: {
    type: Buffer,
    default: USER_DEFAULT_ICON,
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
  patronimic: {
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
    max: Date.now(),
  },
  biography: {
    rank: {
      type: String,
      default: "",
      trim: true,
    },
    career: {
      type: String,
      default: "",
      trim: true,
    },
    scientific_activity: {
      type: String,
      default: "",
      trim: true,
    },
    public_activity: {
      type: String,
      default: "",
      trim: true,
    },
    scientific_achievments: {
      type: String,
      default: "",
      trim: true,
    }
  },
  cathedra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cathedra',
    default: null,
  },
  password: {
    type: String,
    minlength: ACCOUNT_SETTINGS.MIN_PASSWORD_LENGHT,
    required: [true, 'Whoop where is a password?']
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
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    default: null,
  },
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

}, {
    timestamps: true,
  });

teacherScheme.pre('save', async function (next) {
  const teacher = this;

  teacher.photo = `${HOST_URL}/teachers/${teacher._id}/photo`;

  next();
});

teacherScheme.methods.toJSON = function () {
  const teacher = this
  const teacherObject = teacher.toObject()

  delete teacherObject.photo_source
  return teacherObject
}

teacherScheme.virtual('subjects', {
  'ref': 'Subject',
  'localField': '_id',
  'foreignField': 'teacher',
});

teacherScheme.virtual('getCathedra', {
  'ref': 'Cathedra',
  'localField': 'cathedra',
  'foreignField': '_id',
});

teacherScheme.methods.generateAuthToken = generateAuthToken
teacherScheme.statics.findByCredentials = findByCredentials

const Teacher = new mongoose.model('Teacher', teacherScheme);

module.exports = Teacher;