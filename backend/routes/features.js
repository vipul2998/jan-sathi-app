const express = require('express');

const router = express.Router();

const featureData = {
  sos: {
    title: 'SOS Emergency',
    subtitle: 'Ambulance, police, contact',
    bg: '#FBE7E7',
    accent: '#B23B3B',
    items: [
      { label: 'Ambulance', value: '108' },
      { label: 'Police', value: '100' },
      { label: 'Fire Brigade', value: '101' },
      { label: 'Nearest doctor', value: 'Dr. Mehta - 2.1 km' },
    ],
  },
  health: {
    title: 'Health',
    subtitle: 'Symptoms, doctor',
    bg: '#DFF3E8',
    accent: '#2F7A55',
    items: ['Bukhar / Fever', 'Khansi / Cough', 'Pet dard / Stomach ache', 'Doctor se baat karo'],
  },
  sewa: {
    title: 'Local Sewa',
    subtitle: 'Electrician, tutor',
    bg: '#FBEDD9',
    accent: '#B67A2E',
    items: ['Electrician', 'Plumber', 'Tutor', 'Mistri / Carpenter'],
  },
  price: {
    title: 'Price Compare',
    subtitle: 'Nearby dukaan',
    bg: '#E7E4F7',
    accent: '#5B4FA8',
    items: [
      { item: 'Chawal (1kg)', shop: 'Sharma Kirana', price: '₹42' },
      { item: 'Atta (5kg)', shop: 'Gupta Store', price: '₹210' },
    ],
  },
  yojana: {
    title: 'Sarkari Yojana',
    subtitle: 'Schemes, eligibility',
    bg: '#F3DCD8',
    accent: '#9C4A3E',
    items: [
      { name: 'PM Kisan Samman Nidhi', note: 'Farmers ke liye ₹6000/saal' },
      { name: 'Ayushman Bharat', note: 'Free ₹5 lakh tak ilaaj' },
      { name: 'PM Awas Yojana', note: 'Ghar banane ke liye sahayata' },
    ],
  },
  grocery: {
    title: 'Kirana Mangao',
    subtitle: 'Ghar baithe grocery, 30 min mein',
    bg: '#E3F3DC',
    accent: '#3B7A3E',
    products: [
      { id: 1, name: 'Chawal (1kg)', price: 42 },
      { id: 2, name: 'Atta (5kg)', price: 210 },
      { id: 3, name: 'Dudh (1L)', price: 32 },
      { id: 4, name: 'Cheeni (1kg)', price: 44 },
      { id: 5, name: 'Chai patti (250g)', price: 65 },
      { id: 6, name: 'Tel (1L)', price: 130 },
    ],
  },
  community: {
    title: 'Community Chat',
    subtitle: 'Apne gaon se jude rahiye',
    bg: '#E1EFF6',
    accent: '#24708C',
    items: ['Gaon ki zaroori soochna', 'Madad maangein ya dein', 'Local issues par charcha'],
  },
  jobs: {
    title: 'Local Jobs',
    subtitle: 'Aas-paas ki naukriyan',
    bg: '#F4E7D6',
    accent: '#9B5B22',
    items: ['Delivery helper - ₹12,000/mahina', 'Computer operator - ₹15,000/mahina', 'Kheti sahayak - Aaj apply karein'],
  },
  payments: {
    title: 'Digital Payment',
    subtitle: 'UPI aur wallet services',
    bg: '#E8E3F6',
    accent: '#6651A6',
    items: ['UPI se paise bhejein', 'Mobile recharge karein', 'Wallet balance dekhein'],
  },
  bills: {
    title: 'Utility Bills',
    subtitle: 'Bijli, pani aur gas bill',
    bg: '#FCE9D9',
    accent: '#B96126',
    items: ['Bijli bill bharein', 'Pani bill bharein', 'Gas booking aur payment'],
  },
  farming: {
    title: 'Kisan Sathi',
    subtitle: 'Mausam, mandi aur fasal salah',
    bg: '#E2F0DF',
    accent: '#3D7C45',
    items: ['Aaj ka mausam: 29°C, halki baarish', 'Gehu mandi bhav: ₹2,425/quintal', 'Fasal ki salah aur pest management'],
  },
};

router.get('/features', (_req, res) => {
  res.json(featureData);
});

router.get('/summary', (_req, res) => {
  res.json({
    app: 'Jan Sathi',
    features: Object.keys(featureData),
    status: 'active',
  });
});

router.get('/grocery', (_req, res) => {
  res.json(featureData.grocery.products);
});

router.get('/schemes', (_req, res) => {
  res.json([
    { name: 'PM Kisan Samman Nidhi', note: 'Farmers ke liye ₹6000/saal' },
    { name: 'Ayushman Bharat', note: 'Free ₹5 lakh tak ilaaj' },
    { name: 'PM Awas Yojana', note: 'Ghar banane ke liye sahayata' },
  ]);
});

module.exports = router;
