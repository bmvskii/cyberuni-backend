const express = require('express');
const { findByCredentials } = require('../utils')

const Student = require('../models/student')

const auth = require('../middleware/auth.js')
const router = new express.Router();


router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(_token => _token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//  TODO : Change method
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();

  } catch (e) {
    res.status(500).send()
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const PASSWORD_DOESNT_MATCH = 401;
    const USER_NOT_FOUND = 400;

    const user = await Student.findByCredentials(email, password, 'student');
    if (!user || user === USER_NOT_FOUND || user === PASSWORD_DOESNT_MATCH) {
      throw new Error('Unable to login');
    }

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = router;