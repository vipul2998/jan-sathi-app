const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    location: { type: String, default: '' },
    providerName: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
