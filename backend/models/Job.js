const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['government', 'private'], default: 'private' },
    company: { type: String, default: '' },
    salary: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
