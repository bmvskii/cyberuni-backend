const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = new express.Router();

router.get('/courses', auth, async (req, res) => {
  //TODO
});


module.exports = router;