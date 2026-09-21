const express = require('express');

const router = express.Router();

const DEFAULT_PLANS = {
  starter: 499,
  pro: 999,
  elite: 1999,
};

function getKaroSubConfig() {
  return {
    enabled: Boolean(process.env.KAROSUB_API_KEY && process.env.KAROSUB_BASE_URL),
    provider: 'KaroSub',
    mode: process.env.KAROSUB_MODE || 'sandbox',
    currency: process.env.KAROSUB_CURRENCY || 'INR',
    baseUrl: process.env.KAROSUB_BASE_URL || '',
    plans: DEFAULT_PLANS,
  };
}

router.get('/karosub/config', (_req, res) => {
  res.json(getKaroSubConfig());
});

router.post('/karosub/checkout', async (req, res) => {
  const body = req.body || {};
  const plan = String(body.plan || 'starter');
  const enteredAmount = Number(body.amount ?? DEFAULT_PLANS[plan] ?? 0);
  const amount = Number.isFinite(enteredAmount) && enteredAmount > 0 ? enteredAmount : (DEFAULT_PLANS[plan] ?? 0);

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Valid amount is required for KaroSub checkout.' });
  }

  const baseUrl = process.env.KAROSUB_BASE_URL;
  const apiKey = process.env.KAROSUB_API_KEY;

  if (!baseUrl || !apiKey) {
    return res.status(503).json({
      success: false,
      message: 'KaroSub is not configured. Set KAROSUB_BASE_URL and KAROSUB_API_KEY in your backend environment.',
      config: getKaroSubConfig(),
    });
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        plan,
        amount,
        currency: process.env.KAROSUB_CURRENCY || 'INR',
        customerName: body.customerName || 'Jan Sathi User',
        phone: body.phone || '',
        email: body.email || '',
        source: 'jan-sathi',
      }),
    });

    const text = await response.text();
    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch (_error) {
      payload = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: payload.message || payload.error || 'KaroSub checkout failed.',
        details: payload,
      });
    }

    const paymentUrl = payload.checkout?.paymentUrl || payload.paymentUrl || payload.url || payload.checkoutUrl;

    return res.json({
      success: true,
      provider: 'KaroSub',
      checkout: payload.checkout || payload,
      paymentUrl,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: 'KaroSub request failed. Please verify the provider URL and API key.',
      error: error.message,
    });
  }
});

module.exports = router;
