const Anthropic = require('@anthropic-ai/sdk');

const askClaude = async (question) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are Jan Sathi Assistant. Answer safely and clearly in Hindi or simple Hinglish. For medical, legal, financial, emergency, or government topics, provide general guidance and recommend official/local verification. Never ask for OTP, UPI PIN, bank password, or secret keys.',
    messages: [{ role: 'user', content: question }],
  });

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
};

module.exports = { askClaude };
