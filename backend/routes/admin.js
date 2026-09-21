const express = require('express');

const router = express.Router();

router.post('/admin/login', (req, res) => {
  const pin = String(req.body?.pin || '');
  if (!process.env.ADMIN_PIN) {
    return res.status(503).json({ message: 'ADMIN_PIN is not configured' });
  }
  if (pin !== process.env.ADMIN_PIN) {
    return res.status(401).json({ message: 'Admin PIN galat hai' });
  }
  res.json({ success: true });
});

module.exports = router;
