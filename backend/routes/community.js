const express = require('express');
const CommunityPost = require('../models/CommunityPost');

const router = express.Router();

router.get('/community/posts', async (_req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Community posts fetch failed', error: error.message });
  }
});

router.post('/community/posts', async (req, res) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const post = await CommunityPost.create({
      userId: req.body.userId || undefined,
      author: req.body.author || 'Jan Sathi user',
      message,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Community post failed', error: error.message });
  }
});

module.exports = router;
