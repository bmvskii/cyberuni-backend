const express = require('express');
const auth = require('../middleware/auth');

const Cathedra = require('../models/cathedra');
const router = new express.Router();

router.get('/cathedras', async (req, res) => {
  try {
    const cathedra = await Cathedra.find({});
    res.status(200).send(cathedra);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/cathedras", async (req, res) => { 
  try {
    // const headmanId = req.body.headman;
    // const id = mongoose.Types.ObjectId(headmanId);
    
    const cathedra = new Cathedra(req.body);
    await cathedra.save();

    res.status(201).send(cathedra);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/cathedras/:id/headman/:teacher_id', async (req, res) => {
  try {
    const { id : _id, headman_id } = req.params;
    const subject = await Cathedra.findByIdAndUpdate({_id }, { 'headman': headman_id });
    res.status(200).send(subject);
  } catch (e) {
    res.status(400).send()
  }
});

router.get('/cathedras/:id', auth, async (req, res) => {
  try {
    const cathedra = await Cathedra.find({ _id: req.params.id, owner: req.user._id });
    res.status(200).send(cathedra);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/cathedras/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const id = req.params['id'];
    const cathedra = await Cathedra.findById(id);

    updates.forEach(update => subject[update] = req.body[update]);

    await cathedra.save();
    if (!cathedra) {
      return res.status(404).send();
    }

    res.send(cathedra);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;