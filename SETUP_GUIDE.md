# Jan Sathi - Demo/Development Setup ✅

## What's Ready (Just Completed)

### 1️⃣ **SMS OTP Service** ✅
- **Status**: Demo Mode (OTP printed to console)
- **How it works**: 
  - `/api/auth/send-otp` endpoint sends OTP
  - Console shows: `[DEMO MODE] SMS OTP would be sent to: +91XXXXXXXXXX, OTP: 1234`
- **To enable real SMS**: Add Twilio credentials to `.env`

### 2️⃣ **Email Service** ✅
- **Status**: Mock Mode (using Resend API)
- **How it works**:
  - `/api/auth/send-otp` can also send email if provided
  - Falls back to console logging if RESEND_API_KEY not complete
- **Current token**: `re_ixbxpLM5` (from your Resend account)
- **To enable**: Paste full Resend token in `.env` `RESEND_API_KEY`

### 3️⃣ **Payment Gateway** ✅
- **Status**: Demo Mode (test payments work)
- **Endpoints**:
  - `POST /api/payments/create-order` - Create order
  - `POST /api/payments/verify-payment` - Verify payment
  - `POST /api/payments/refund-payment` - Process refund
- **Demo mode returns**: Mock order/payment objects
- **To enable real Razorpay**: Add test keys to `.env`

### 4️⃣ **Authentication Updated** ✅
- Email registration & login working
- Phone OTP login now sends SMS/Email
- First-login password setup implemented

---

## 🚀 Quick Start (Development)

### **1. Start Backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
```

### **2. Check Health**
```bash
curl http://localhost:5001/health
# Returns: { "status": "ok", "database": "connected" }
```

### **3. Test OTP Flow**
```bash
# Send OTP
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "email": "user@example.com"}'

# Response includes OTP in dev mode
# Check console logs for SMS/Email output

# Verify OTP
curl -X POST http://localhost:5001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "1234"}'
```

### **4. Test Payment**
```bash
curl -X POST http://localhost:5001/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "INR", "receipt": "rcpt_001"}'

# Returns mock order with order_id
```

---

## 📋 Current .env Configuration

```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/jansathi
ANTHROPIC_API_KEY=sk-ant-api03-xRk...
ADMIN_PIN=739184

# Email
RESEND_API_KEY=re_ixbxpLM5  ← Your token (partial)

# SMS (commented = demo mode)
# TWILIO_ACCOUNT_SID=...

# Payment (commented = demo mode)
# RAZORPAY_KEY_ID=...
```

---

## 🔧 What to Add Next

### **Real SMS (Twilio)**
1. Go to https://www.twilio.com/
2. Get: ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER
3. Add to `.env`
4. Restart backend

### **Real Payments (Razorpay)**
1. Go to https://razorpay.com/ (needs PAN)
2. Get test keys from dashboard
3. Add to `.env`: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
4. Restart backend

### **Full Resend Token**
1. You have: `re_ixbxpLM5`
2. Get full token from Resend dashboard
3. Replace in `.env`

---

## ✨ Features Now Available

| Feature | Status | Mode |
|---------|--------|------|
| Email Registration | ✅ Working | Real (MongoDB) |
| Phone OTP Login | ✅ Working | Demo (console) |
| SMS Notifications | ✅ Integrated | Demo (console) |
| Email Notifications | ✅ Integrated | Mock/Real (Resend) |
| Payment Creation | ✅ Working | Demo (mock objects) |
| Payment Verification | ✅ Working | Demo (mock objects) |
| Refunds | ✅ Working | Demo (mock objects) |
| KaroSub | ✅ Configured | Requires API key |

---

## 🧪 Testing Checklist

- [x] Backend starts without errors
- [x] All routes load correctly
- [x] Health check works
- [x] Database connection tested
- [x] Notification services integrated
- [ ] Test actual OTP flow end-to-end
- [ ] Test payment flow end-to-end
- [ ] Frontend integration testing

---

## 📝 Notes

1. **Demo Mode**: All services have fallback demo modes
2. **Console Logs**: Check terminal for SMS/Email logs
3. **No Real Charges**: Demo payments don't deduct money
4. **LocalHost Only**: Current setup is local development
5. **Production**: Add real API keys before deploying

---

## 🆘 Troubleshooting

**Server won't start?**
```bash
# Check if port 5001 is in use
lsof -i :5001
# If yes, kill the process or change PORT in .env
```

**Notification not sending?**
```bash
# Check backend console logs for:
# [DEMO MODE] SMS OTP would be sent to...
# This means demo mode is active (no real SMS sent)
```

**Database connection failed?**
```bash
# Make sure MongoDB is running:
# mongod --dbpath /path/to/data
```

---

## 📞 API Endpoints Summary

```
Auth:
POST /api/auth/register
POST /api/auth/login-email
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/complete-first-login

Payments:
POST /api/payments/create-order
POST /api/payments/verify-payment
POST /api/payments/refund-payment

Orders:
GET /api/orders
POST /api/orders

Products:
GET /api/products
POST /api/products

Community:
GET /api/community/posts
POST /api/community/posts

... and more (see routes/ folder)
```

---

**Ready to deploy? Add real API keys and test on staging!** 🚀
