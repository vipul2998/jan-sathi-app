const express = require('express');
const { askClaude } = require('../claude');

const router = express.Router();

router.post('/ask-claude', async (req, res) => {
  const question = String(req.body?.question || '').trim();
  if (!question) return res.status(400).json({ message: 'Question is required' });

  try {
    const answer = await askClaude(question.slice(0, 4000));
    res.json({ question, answer });
  } catch (error) {
    const status = error.message === 'ANTHROPIC_API_KEY is not configured' ? 503 : 502;
    res.status(status).json({ message: error.message });
  }
});

router.get('/health-advice', async (_req, res) => {
  try {
    const advice = await askClaude('Mujhe general health tips do Hindi me. Emergency symptoms par doctor se milne ki salah do.');
    res.json({ advice });
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
});

module.exports = router;
