const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const photo = multer();

//  Middleware
const auth = require('../middleware/auth.js')

//  Model
const Teacher = require('../models/teacher')
const router = new express.Router();

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.send(teachers)
  } catch (e) {
    res.status(500).send()
  }
});

router.get('/teachers/:id/photo', async (req, res) => {
  try {
    const id = req.params['id'];
    const teacher = await Teacher.findById(id);

    if (!teacher || !teacher.photo_source) {
      return res.status(404).send();
    }

    res.set('Content-Type', 'image/jpg');
    res.status(200).send(teacher.photo_source);
  } catch (e) {
    res.status(500).send()
  }
});

router.get('/teachers/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).send();
    }

    res.status(200).send(teacher);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/teachers/:id/photo', photo.single('photo'), async (req, res) => {
  try {
    const { id: _id } = req.params;

    const teacher = await Teacher.findById(_id);
    teacher.photo_source = req.file.buffer;

    await teacher.save();
    res.send(teacher.photo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/teachers", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId();
    const teacher = new Teacher({
      ...req.body,
      '_id': id,
    });
    
    //  Save teacher to db
    const result = await teacher.save();

    const obj = Object.assign({}, result);
    delete obj.photo;

    res.status(201).send(obj);
  } catch (e) {
    res.status(400).send(e)
  }
});

router.patch('/teachers/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const teacher = await Teachers.findByIdAndUpdate(id, req.body);

    if (!teacher) {
      console.log('Error', teacher);
      res.status(404).send();
    }
    res.send(teacher);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete({ '_id': id });
    res.status(200).send()
  } catch (e) {
    res.status(400).send(e)
  }
});

router.get('/teachers/:id/subjects', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const teacher = await Teacher.findById(_id);

    await teacher.populate('subjects').execPopulate();
    res.status(200).send(teacher.subjects)
  } catch (e) {
    res.status(500).send()
  }
});

module.exports = router;