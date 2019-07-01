const express = require('express');
const multer = require('multer');

const photo = multer()

const Student = require('../models/student')
const Semester = require('../models/semester');

const auth = require('../middleware/auth.js')

const router = new express.Router();

router.patch('/students/:id/photo', photo.single('photo'), async (req, res) => {
  try {
    const { id: _id } = req.params;

    console.log(req.file);

    const student = await Student.findById(_id);
    // student.photo_source = req.file.buffer;

    await student.save();
    // res.status(200).send(student.photo);
  } catch (e) {
    res.status(400).send(e);
  }

})

router.get('/students/:id/photo', async (req, res) => {
  try {
    const id = req.params['id'];
    const student = await Student.findById(id);

    if (!student || !student.photo_source) {
      return res.status(404).send();
    }

    res.set('Content-Type', 'image/jpg');
    res.status(200).send(student.photo_source);
  } catch (e) {
    res.status(500).send()
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.send(students);

  } catch (e) {
    res.status(500).send()
  }
});

router.get('/students/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const user = await Student.findById(id);

    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e)
  }
});

router.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    
    let semester = null;
    if (!student.semester) {
      semester = await Semester.findOne({ number: 1 });
      student.semester = semester._id;
    } else {
      semester = await Semester.findById({ _id: student.semester });
    }
    
    Array
      .from(semester.disciplines)
      .map(({ subject, type }) => savedStudent.learning_subjects.push({
        subject: subject._id,
        type
      }))

    res.status(201).send(savedStudent);
  } catch (e) {
    res.status(500).send("Can't create a student");
  }
});

router.patch('/students/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const user = await Students.findByIdAndUpdate(id, req.body);

    if (!user) {
      console.log('Error', user);
      res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/students/:id', async (req, res) => {

});

router.get('/students/:id/semesters', async (req, res) => {
  try {
    const id = req.params['id'];
    const user = await Students.findById(id);

    if (!user) {
      console.log('Error', user);
      res.status(404).send();
    }

    await user.populate('getSemester').execPopulate();
    res.send(user.getSemester);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/students/:id/photo', async (req, res) => {
  try {
    const student = await Students.findById(req.params.id);

    if (!student || !student.photo) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(student.photo);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.patch('/students/:id/subject/:subject_id/mark/:mark', async (req, res) => {

  try {
    const { id: _id, subject_id, mark } = req.params;

    const student = await Students.findById(_id);
    console.log(student);

    student.learning_subjects
      .filter(subj => subj.subject === subject_id)
      .map(subj => {
        console.log(`mark : ${mark}`)
        console.log(`subj : ${subj}`);
      })


    res.status(200).send(student);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;