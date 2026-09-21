const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin', 'provider'], default: 'user' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
