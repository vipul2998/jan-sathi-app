const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city || '',
      state: req.body.state || '',
      role: req.body.role || 'user',
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
});

module.exports = router;
