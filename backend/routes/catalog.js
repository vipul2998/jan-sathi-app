const express = require('express');

const router = express.Router();

const products = [
  { id: 1, name: 'Chawal (1kg)', price: 42, category: 'Grocery' },
  { id: 2, name: 'Atta (5kg)', price: 210, category: 'Grocery' },
  { id: 3, name: 'Dudh (1L)', price: 32, category: 'Grocery' },
  { id: 4, name: 'Cheeni (1kg)', price: 44, category: 'Grocery' },
  { id: 5, name: 'Chai patti (250g)', price: 65, category: 'Grocery' },
  { id: 6, name: 'Tel (1L)', price: 130, category: 'Grocery' },
];

const jobs = [
  { id: 1, title: 'Delivery helper', salary: '₹12,000/mahina', location: 'Near town market' },
  { id: 2, title: 'Computer operator', salary: '₹15,000/mahina', location: 'Block office' },
  { id: 3, title: 'Kheti sahayak', salary: 'Aaj apply karein', location: 'Village area' },
];

const schemes = [
  { id: 1, name: 'PM Kisan Samman Nidhi', note: 'Farmers ke liye ₹6000/saal' },
  { id: 2, name: 'Ayushman Bharat', note: 'Free ₹5 lakh tak ilaaj' },
  { id: 3, name: 'PM Awas Yojana', note: 'Ghar banane ke liye sahayata' },
];

const expenses = [
  { id: 1, label: 'Sabzi', amount: 120 },
  { id: 2, label: 'Bus kiraya', amount: 40 },
  { id: 3, label: 'Chai', amount: 180 },
];

router.get('/products', (_req, res) => {
  res.json(products);
});

router.get('/jobs', (_req, res) => {
  res.json(jobs);
});

router.get('/schemes', (_req, res) => {
  res.json(schemes);
});

router.get('/expenses', (_req, res) => {
  res.json(expenses);
});

module.exports = router;
