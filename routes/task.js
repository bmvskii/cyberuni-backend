const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = new express.Router();

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ _id: req.params.id, owner: req.user._id});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    'owner': req.user._id,
  });

  try {
    await task.save();
    res.status(400).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

//  TODO : Change method
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
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

//  TODO : Change method
router.delete('/tasks/:id', auth, async (req, res) => {
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