const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/auth_settings')

//  Models  
const Student = require('../models/student')
const Teacher = require('../models/teacher')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_KEY);

    
    //  Try to find student by this id
    let user = await Student.findOne({ '_id': decoded.id, 'tokens.token': token });
    
    // if (!user) {
    //   //  Try to find teacher by this id
    //   user = await Teacher.findOne({ '_id': decoded.id, 'tokens.token': token });      
    //   if (!user) {
    //     throw new Error('Несуществующий пользователь.');
    //   }
    // }
    
    req.user = user;
    req.role = user.role;
    
    req.token = token;

    next();

  } catch (e) {
    res.status(401).send({ error: "Пожалуйста авторизуйтесь." });
  }
}

module.exports = auth;