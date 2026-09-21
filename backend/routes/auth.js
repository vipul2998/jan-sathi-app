const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

const otpStore = new Map();
const users = new Map();

const normalizePhone = (phone = '') => String(phone).replace(/\D/g, '').slice(-10);
const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const publicUser = (user) => {
  const result = user.toObject ? user.toObject() : { ...user };
  delete result.passwordHash;
  return result;
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const passwordMatches = (password, storedPassword) => {
  if (!storedPassword || !storedPassword.includes(':')) return false;
  const [salt, storedHash] = storedPassword.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
};

router.post('/auth/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (name.length < 2) {
    return res.status(400).json({ success: false, message: 'Apna naam daalo' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email daalo' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password kam se kam 6 characters ka hona chahiye' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Is email se account pehle se bana hua hai' });
  }

  const user = await User.create({ name, email, passwordHash: hashPassword(password), isVerified: true });
  const safeUser = publicUser(user);
  users.set(email, safeUser);
  return res.status(201).json({ success: true, message: 'Account ban gaya', user: safeUser });
});

router.post('/auth/login-email', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    return res.status(400).json({ success: false, message: 'Email aur password daalo' });
  }

  const user = await User.findOne({ email });
  if (!user || !passwordMatches(password, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Email ya password galat hai' });
  }

  const safeUser = publicUser(user);
  users.set(email, safeUser);
  return res.json({ success: true, message: 'Login successful', user: safeUser });
});

router.post('/auth/send-otp', (req, res) => {
  const phone = normalizePhone(req.body?.phone);

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Sahi 10 anko ka phone number daalo' });
  }

  const otp = String(Math.floor(1000 + Math.random() * 9000));
  otpStore.set(phone, otp);

  return res.json({
    success: true,
    message: 'OTP sent successfully',
    phone,
  });
});

router.post('/auth/verify-otp', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const otp = String(req.body?.otp || '');

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }

  if (!/^\d{4}$/.test(otp)) {
    return res.status(400).json({ success: false, message: '4 anko ka OTP daalo' });
  }

  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ success: false, message: 'OTP galat hai, dobara try karo' });
  }

  const user = await User.findOneAndUpdate(
    { phone },
    { $setOnInsert: { phone, name: `User ${phone.slice(-4)}`, isVerified: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  users.set(phone, publicUser(user));

  return res.json({
    success: true,
    message: 'OTP verified successfully',
    user: publicUser(user),
    needsProfileSetup: !user.passwordHash,
  });
});

router.post('/auth/complete-first-login', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const otp = String(req.body?.otp || '');
  const name = String(req.body?.name || '').trim();
  const password = String(req.body?.password || '');

  if (!/^\d{10}$/.test(phone) || !/^\d{4}$/.test(otp)) {
    return res.status(400).json({ success: false, message: 'Phone aur OTP dobara check karo' });
  }
  if (name.length < 2) {
    return res.status(400).json({ success: false, message: 'Apna naam daalo' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password kam se kam 6 characters ka hona chahiye' });
  }

  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ success: false, message: 'OTP galat hai, dobara try karo' });
  }

  const user = await User.findOneAndUpdate(
    { phone },
    { $set: { name, passwordHash: hashPassword(password), isVerified: true } },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User nahi mila, pehle OTP verify karo' });
  }

  otpStore.delete(phone);
  users.set(phone, publicUser(user));
  return res.json({ success: true, message: 'Profile setup complete', user: publicUser(user) });
});

router.post('/auth/login-password', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const password = String(req.body?.password || '');

  if (!/^\d{10}$/.test(phone) || !password) {
    return res.status(400).json({ success: false, message: 'Phone aur password daalo' });
  }

  const user = await User.findOne({ phone });
  if (!user || !passwordMatches(password, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Phone ya password galat hai' });
  }

  users.set(phone, publicUser(user));
  return res.json({ success: true, message: 'Login successful', user: publicUser(user) });
});

router.post('/auth/reset-password', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const otp = String(req.body?.otp || '');
  const password = String(req.body?.password || '');

  if (!/^\d{10}$/.test(phone) || !/^\d{4}$/.test(otp)) {
    return res.status(400).json({ success: false, message: 'Phone aur OTP dobara check karo' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password kam se kam 6 characters ka hona chahiye' });
  }

  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ success: false, message: 'OTP galat hai, dobara try karo' });
  }

  const user = await User.findOneAndUpdate(
    { phone },
    { $set: { passwordHash: hashPassword(password), isVerified: true } },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'Is number se koi account nahi mila' });
  }

  otpStore.delete(phone);
  users.set(phone, publicUser(user));
  return res.json({ success: true, message: 'Password reset ho gaya', user: publicUser(user) });
});

module.exports = router;
