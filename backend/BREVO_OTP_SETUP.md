# 🔐 Brevo OTP & Email System - Setup Guide

## ✅ Implementation Complete!

A production-grade OTP and email system using Brevo API has been successfully implemented.

---

## 📋 Step 1: Environment Variables

Add these to your `backend/.env` file:

```env
# Brevo API Configuration
BERVO_API_KEY=your_brevo_api_key_here
BERVO_SENDER_EMAIL=medichain@yourdomain.com
BERVO_APP_NAME=Medichain

# Server Port (if not already set)
PORT=4000
```

**⚠️ Important:**
- Never commit `.env` file to Git (already in `.gitignore`)
- Replace `medichain@yourdomain.com` with your verified Brevo sender email
- Keep your API key secure

---

## 📦 Step 2: Dependencies

All required dependencies are already installed:
- ✅ `express` - Web framework
- ✅ `dotenv` - Environment variables
- ✅ `cors` - Cross-origin requests
- ✅ `axios` - HTTP client for Brevo API
- ✅ `validator` - Email validation

---

## 🚀 Step 3: Start Server

```bash
cd backend
npm start
```

Or for development with auto-reload:
```bash
npm run server
```

---

## 📡 API Endpoints

### 1. Send OTP
**POST** `/api/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email. Please check your inbox."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

---

### 2. Verify OTP
**POST** `/api/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 3. Verify Brevo Connection (Testing)
**GET** `/api/verify-brevo`

**Response:**
```json
{
  "success": true,
  "message": "Brevo API connection verified",
  "accountEmail": "your-email@brevo.com"
}
```

---

## 🔒 Security Features

✅ **OTP Expiry:** 5 minutes  
✅ **Max Attempts:** 5 attempts per OTP  
✅ **Cooldown Period:** 15 minutes after max attempts  
✅ **Email Validation:** Strict email format checking  
✅ **Rate Limiting:** Prevents spam OTP requests  
✅ **Secure Storage:** OTPs stored in-memory (can upgrade to Redis/DB)  
✅ **No Secrets in Logs:** API keys never logged  

---

## 📧 Email Template Features

✅ Professional HTML email design  
✅ Medichain branding  
✅ Clear OTP display (large, highlighted)  
✅ Security warnings  
✅ Mobile-responsive  
✅ Expiry information  

---

## 🧪 Testing

### Test Send OTP:
```bash
curl -X POST http://localhost:4000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Verify OTP:
```bash
curl -X POST http://localhost:4000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

### Test Brevo Connection:
```bash
curl http://localhost:4000/api/verify-brevo
```

---

## ⚠️ Error Handling

The system handles:
- ✅ Invalid email format
- ✅ OTP expired
- ✅ Wrong OTP
- ✅ Brevo API timeout
- ✅ Network failure
- ✅ Rate limit exceeded
- ✅ Invalid API key
- ✅ Missing environment variables

All errors return clean JSON responses with helpful messages.

---

## 📁 File Structure

```
backend/
├── services/
│   └── brevoMailer.js          # Brevo API integration
├── utils/
│   └── otpStorage.js           # OTP generation & storage
├── controllers/
│   └── otpController.js        # API controllers
├── routes/
│   └── otpRoute.js             # API routes
└── server.js                   # Main server (updated)
```

---

## 🎯 Usage Example

```javascript
// Frontend: Send OTP
const response = await fetch('http://localhost:4000/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
})

const data = await response.json()
if (data.success) {
  console.log('OTP sent!')
}

// Frontend: Verify OTP
const verifyResponse = await fetch('http://localhost:4000/api/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    otp: '123456' 
  })
})

const verifyData = await verifyResponse.json()
if (verifyData.success) {
  console.log('OTP verified!')
}
```

---

## ✅ Production Checklist

- [x] API keys in environment variables
- [x] `.env` in `.gitignore`
- [x] OTP expiry implemented
- [x] Rate limiting (cooldown)
- [x] Error handling
- [x] Email validation
- [x] Clean JSON responses
- [x] No secrets in logs
- [x] Professional email templates

---

## 🚨 Troubleshooting

### "BERVO_API_KEY not configured"
→ Add `BERVO_API_KEY` to your `.env` file

### "Invalid API key"
→ Verify your Brevo API key is correct

### "OTP already sent"
→ Wait for current OTP to expire (5 minutes) or use existing OTP

### "Too many failed attempts"
→ Wait 15 minutes before requesting new OTP

### Email not received
→ Check spam folder
→ Verify sender email is verified in Brevo
→ Check Brevo dashboard for delivery status

---

## 📞 Support

For Brevo API issues:
- Brevo Dashboard: https://app.brevo.com
- API Documentation: https://developers.brevo.com

---

**Status:** ✅ Ready for Production Use

