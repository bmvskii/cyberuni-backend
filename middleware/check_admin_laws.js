const ROLES = require('../config/db_roles');

const checkLaws = async (req, res, next) => {
  try {
    const { role } = req;
    
    if (role !== ROLES.ADMIN) {
      res.status(403).send({ error: "Нехватает прав для выполнения операции" });
    }
    
    next();

  } catch (e) {
    res.status(401).send({ error: "Пожалуйста авторизуйтесь." });
  }
}

module.exports = auth;