const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Semester = require('../models/semester');

const router = new express.Router();

router.get('/semesters', auth, async (req, res) => {
  try {
    const semesters = await Semesters.find({});
    res.status(200).send(semesters);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/semesters", async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).send(semester);
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/semesters/:id', auth, async (req, res) => {
  try {
    const { id: _id } = req.params;
    const semester = await Semesters.findById(_id);
    res.status(200).send(semester);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;