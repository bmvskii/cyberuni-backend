const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const Subject = require('../models/subject');

const router = new express.Router();

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.status(200).send(subjects);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/subjects", async (req, res) => { 
  try {
    const teacherId = req.body.teacher;
    const id = mongoose.Types.ObjectId(teacherId);
    
    const subject = new Subject({
      ...req.body,
      teacher: id,
    });
    await subject.save();
    res.status(201).send(subject);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/subjects/:id/teacher/:teacher_id', async (req, res) => {
  try {
    const { id : _id, teacher_id } = req.params;
    const subject = await Subject.findByIdAndUpdate({_id }, { 'teacher': teacher_id });
    res.status(200).send(subject);
  } catch (e) {
    res.status(400).send()
  }
});

router.get('/subjects/:id', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ _id: req.params.id, owner: req.user._id });
    res.status(200).send(subjects);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/subjects/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const subject = await Subject.findById(id);

    updates.forEach(update => subject[update] = req.body[update]);

    await subject.save();

    if (!subject) {
      return res.status(404).send();
    }

    res.send(subject);
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = router;