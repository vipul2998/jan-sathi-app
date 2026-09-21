const express = require('express');
const Expense = require('../models/Expense');

const router = express.Router();

router.get('/expenses', async (_req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Expenses fetch failed', error: error.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const expense = await Expense.create({
      userId: req.body.userId || null,
      label: req.body.label,
      amount: req.body.amount,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Expense create failed', error: error.message });
  }
});

router.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: 'Expense delete failed', error: error.message });
  }
});

module.exports = router;
