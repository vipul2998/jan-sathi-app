const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/products', async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Products fetch failed', error: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit || 'kg',
      stock: req.body.stock || 0,
      description: req.body.description || '',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Product create failed', error: error.message });
  }
});

module.exports = router;
