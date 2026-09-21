const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

router.get('/jobs', async (_req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Jobs fetch failed', error: error.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      type: req.body.type || 'private',
      company: req.body.company || '',
      salary: req.body.salary || '',
      location: req.body.location || '',
      description: req.body.description || '',
      isActive: req.body.isActive !== false,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Job create failed', error: error.message });
  }
});

module.exports = router;
