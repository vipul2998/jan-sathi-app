const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'razorpay_test_secret',
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = '', notes = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount chahiye' });
    }

    // Demo mode - skip Razorpay call if test keys
    if (
      process.env.RAZORPAY_KEY_ID === 'rzp_test_demo_key' ||
      !process.env.RAZORPAY_KEY_ID
    ) {
      // Return mock order for testing
      const mockOrder = {
        id: `order_${Date.now()}`,
        entity: 'order',
        amount: amount * 100, // Razorpay uses paise
        amount_paid: 0,
        amount_due: amount * 100,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        offer_id: null,
        status: 'created',
        attempts: 0,
        notes: notes,
        created_at: Math.floor(Date.now() / 1000),
      };

      return res.json({
        success: true,
        order: mockOrder,
        isDemoMode: true,
        message: 'Demo order created (test mode)',
      });
    }

    // Real Razorpay API call
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes,
    });

    res.json({ success: true, order, isDemoMode: false });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Order create nahi ho saka', error: error.message });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Payment details incomplete' });
    }

    // Demo mode - skip verification
    if (
      process.env.RAZORPAY_KEY_ID === 'rzp_test_demo_key' ||
      !process.env.RAZORPAY_KEY_ID
    ) {
      return res.json({
        success: true,
        message: 'Demo payment verified (test mode)',
        isDemoMode: true,
        payment: {
          id: razorpay_payment_id,
          order_id: razorpay_order_id,
          status: 'captured',
        },
      });
    }

    // Real verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Get payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
      isDemoMode: false,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verify nahi ho saka', error: error.message });
  }
});

// Refund payment
router.post('/refund-payment', async (req, res) => {
  try {
    const { payment_id, amount = null, reason = '', notes = {} } = req.body;

    if (!payment_id) {
      return res.status(400).json({ success: false, message: 'Payment ID chahiye' });
    }

    // Demo mode
    if (
      process.env.RAZORPAY_KEY_ID === 'rzp_test_demo_key' ||
      !process.env.RAZORPAY_KEY_ID
    ) {
      return res.json({
        success: true,
        message: 'Demo refund processed (test mode)',
        isDemoMode: true,
        refund: {
          id: `refund_${Date.now()}`,
          payment_id,
          amount,
          status: 'processed',
        },
      });
    }

    // Real refund
    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount ? amount * 100 : undefined,
      reason,
      notes,
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund,
      isDemoMode: false,
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, message: 'Refund nahi ho saka', error: error.message });
  }
});

module.exports = router;
