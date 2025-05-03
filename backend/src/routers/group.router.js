import express from 'express';
const router = express.Router();
import { Group } from '../models/Group.js';
// Get groups the user is part of
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': req.params.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's groups" });
  }
});

// Get groups the user is NOT part of
router.get('/available/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': { $ne: req.params.userId } });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available groups" });
  }
});

// Create a group
router.post('/create', async (req, res) => {
  try {
    const { name, subject, timeSlot, createdBy } = req.body;
    const group = new Group({
      name,
      subject,
      timeSlot,
      createdBy,
      members: [{ userId: createdBy, isAdmin: true }]
    });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error creating group" });
  }
});

// Join a group

// Get groups the user is part of
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': req.params.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's groups" });
  }
});

// Get groups the user is NOT part of
router.get('/available/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': { $ne: req.params.userId } });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available groups" });
  }
});

// Create a group
router.post('/create', async (req, res) => {
  try {
    const { name, subject, timeSlot, createdBy } = req.body;
    const group = new Group({
      name,
      subject,
      timeSlot,
      createdBy,
      members: [{ userId: createdBy, isAdmin: true }]
    });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Join a group
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    const alreadyIn = group.members.some(m => m.userId.toString() === userId);
    if (!alreadyIn) {
      group.members.push({ userId, isAdmin: false });
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error joining group' });
  }
});

// Leave a group
router.post('/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    group.members = group.members.filter(m => m.userId.toString() !== userId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error leaving group' });
  }
});

// Promote to admin
router.post('/:id/promote', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    const member = group.members.find(m => m.userId.toString() === userId);
    if (member) {
      member.isAdmin = true;
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user' });
  }
});

// Remove member
router.post('/:id/remove', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    group.members = group.members.filter(m => m.userId.toString() !== userId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error removing member' });
  }
});

// Get a group's full info
// Get a group's full info
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.userId');
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group info' });
  }
});
// GET single group by ID with populated members
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.userId') // THIS is the key line
      .exec();

    res.json(group);
  } catch (err) {
    console.error("Error fetching group:", err);
    res.status(500).json({ message: "Error fetching group" });
  }
});


export default router;
