const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/services', async (_req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Services fetch failed', error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await Service.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description || '',
      price: req.body.price || 0,
      location: req.body.location || '',
      providerName: req.body.providerName || '',
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Service create failed', error: error.message });
  }
});

module.exports = router;
