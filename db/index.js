const mongoose = require('mongoose');
const { DB_URL } = require('../config/db_settings');

mongoose.Promise = global.Promise;

const DATABASE_NAME = 'cyber_uni';
const connectionURL = DB_URL + DATABASE_NAME;

mongoose.connect(connectionURL,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });