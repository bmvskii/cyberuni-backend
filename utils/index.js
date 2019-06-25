const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_KEY } = require('../config/auth_settings')

const generateAuthToken = async function () {
  const user = this;
  const secretKey = JWT_KEY;
  const token = jwt.sign({ 'id': user._id.toString() }, secretKey);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

const findByCredentials = async (email, password, model) => {
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

module.exports = {
  findByCredentials,
  generateAuthToken,
}