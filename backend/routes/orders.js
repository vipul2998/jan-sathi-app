const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

router.get('/orders', async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('userId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Orders fetch failed', error: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.body.userId,
      items: req.body.items || [],
      total: req.body.total || 0,
      status: req.body.status || 'pending',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Order create failed', error: error.message });
  }
});

module.exports = router;
