const express = require('express');
const mongoose = require('mongoose');
const { findByCredentials } = require('../utils')
const multer = require('multer');

const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Student = require('../models/student')
const Subject = require('../models/subject')

const auth = require('../middleware/auth.js')
const router = new express.Router();

const photo = multer();

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.send(req.user);
});

router.patch('/me/photo', auth, photo.single('photo'), async (req, res) => {
    req.user.photo_source = req.file.buffer;
    await req.user.save();
    res.send(req.user);
});

router.get('/me/group', auth, async (req, res) => {
    try {
        await req.user.populate('getMyGroup').execPopulate();
        console.log(req.user.group);
        res.send(req.user.group);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/me/favourite_subject', auth, async (req, res) => {
    try {
        await req.user.populate('favouriteSubject').execPopulate();
        res.send(req.user.favouriteSubject);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/me/diploma_teacher', auth, async (req, res) => {
    try {
        await req.user.populate('getDiplomaTeacher').execPopulate();
        res.send(req.user.getDiplomaTeacher);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/me/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate();
        const tasks = req.user.tasks || [];
        res.send(tasks);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/me/teachers', auth, async (req, res) => {
    try {
        Student
            .findOne({ _id: req.user._id })
            .populate({ path: "learning_subjects.subject", populate: { path: 'teacher'} })
            .exec((err, student) => {
                const arr = [];
                const { learning_subjects: subjects } = student;

                subjects.forEach(subj => arr.push(subj.subject.teacher));
                res.send(arr);
            });
    } catch (e) {
        res.status(404).send(e);
    }
});


router.get('/me/semester', auth, async (req, res) => {
    try {
        await req.user.populate('getSemester').execPopulate();
        res.send(req.user.getSemester);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/me/subjects', auth, async (req, res) => {
    try {
        Student
            .findOne({ _id: req.user._id })
            .populate({ path: "learning_subjects.subject" })
            .exec((err, student) => {
                const arr = [];
                const { learning_subjects: subjects } = student;

                subjects.forEach(subj => arr.push(subj.subject));
                res.send(arr);
            });
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;