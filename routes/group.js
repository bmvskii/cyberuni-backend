const express = require('express');
const auth = require('../middleware/auth');
const Group = require('../models/group');
const mongoose = require('mongoose');

const router = new express.Router();

router.get('/groups', async (req, res) => {
  try {
    const group = await Group.find({});
    res.status(200).send(group);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);

    await group
      .populate('students')
      .populate('getCurator')
      .populate('getHeadman')
      .execPopulate();

    const populatedFields = {
      students: group.students,
      curator: group.getCurator,
      headman: group.getHeadman,
    };

    const copy = {
      ...group,
      ...populatedFields
    };

    res.status(200).send(copy);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id/students', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);
    await group.populate('students').execPopulate();
    res.status(200).send(group.students);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id/headman', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);
    await group.populate('getHeadman').execPopulate();
    res.status(200).send(group.headman);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id/curator', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);
    await group.populate('getCurator').execPopulate();
    res.status(200).send(group.curator);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id/best_student', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);
    await group.populate('students').execPopulate();

    const { students } = group;

    console.log(students);

    const bestStudent = {};
    res.status(200).send(bestStudent);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/groups/:id/average_mark', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const group = await Group.findById(_id);
    const students = group.populate('students').execPopulate();

    const average_mark = 100;

    res.status(200).send(average_mark);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/groups", async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(400).send(group);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch("/groups/:id/headman", async (req, res) => {
  try {
    const { id: _id } = req.params;
    const headmanId = mongoose.Types.ObjectId(req.body.headman);
    const group = await Group.findById(_id);
    group.headman = headmanId;
    await group.save();

    res.status(400).send(group);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch("/groups/:id/curator", async (req, res) => {
  try {
    const { id: _id } = req.params;
    const curatorId = mongoose.Types.ObjectId(req.body.curator);
    const group = await Group.findById(_id);

    group.curator = curatorId;
    await group.save();
    res.status(400).send(group);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/groups/:id', async (req, res) => {
  // const updates = Object.keys(req.body);
  // const allowedUpdates = ['description', 'completed'];
  // const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  // if (!isValidOperation) {
  //   return res.status(400).send('Invalid operation');
  // }

  try {
    const id = req.params['id'];
    const task = await Task.findById(id);

    updates.forEach(update => task[update] = req.body[update]);

    task.save();

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/groups/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;