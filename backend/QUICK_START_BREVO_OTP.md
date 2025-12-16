# 🚀 Quick Start: Brevo OTP System

## ✅ Setup Complete! (3 Steps)

### Step 1: Add to `.env` file

Add these lines to `backend/.env`:

```env
BERVO_API_KEY=your_brevo_api_key_here
BERVO_SENDER_EMAIL=medichain@yourdomain.com
BERVO_APP_NAME=Medichain
```

**⚠️ Replace `medichain@yourdomain.com` with your verified Brevo sender email**

---

### Step 2: Start Server

```bash
cd backend
npm start
```

---

### Step 3: Test It!

**Send OTP:**
```bash
POST http://localhost:4000/api/send-otp
Body: { "email": "test@example.com" }
```

**Verify OTP:**
```bash
POST http://localhost:4000/api/verify-otp
Body: { "email": "test@example.com", "otp": "123456" }
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/send-otp` | POST | Send OTP to email |
| `/api/verify-otp` | POST | Verify OTP code |
| `/api/verify-brevo` | GET | Test Brevo connection |

---

## ✅ Features

- ✅ 6-digit secure OTP
- ✅ 5-minute expiry
- ✅ Rate limiting (5 attempts, 15min cooldown)
- ✅ Professional email templates
- ✅ Medichain branding
- ✅ Production-ready error handling
- ✅ No secrets in logs

---

## 📧 Email Preview

Users receive a beautiful HTML email with:
- Medichain branding
- Large, highlighted OTP
- Security warnings
- Expiry information
- Mobile-responsive design

---

**Status:** ✅ Ready to Use!

See `BREVO_OTP_SETUP.md` for detailed documentation.

