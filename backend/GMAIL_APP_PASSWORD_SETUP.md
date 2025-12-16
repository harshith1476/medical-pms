# 🔐 Gmail App Password Setup Guide

## ❌ Error: "Username and Password not accepted"

This error occurs because Gmail **requires App Passwords** for third-party applications, not your regular Gmail password.

## ✅ Solution: Generate a Gmail App Password

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account (`medichain123@gmail.com`)
3. Under "Signing in to Google", find **"2-Step Verification"**
4. Click **"Get started"** and follow the prompts to enable it
5. You'll need to verify your phone number

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", find **"App passwords"**
3. Click on **"App passwords"**
4. You may need to sign in again
5. Select **"Mail"** as the app
6. Select **"Other (Custom name)"** as the device
7. Type: **"MediChain Backend"**
8. Click **"Generate"**
9. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - ⚠️ **Important**: Copy it immediately - you won't see it again!

### Step 3: Update .env File

Open `backend/.env` and update/add these lines:

```env
EMAIL_USER=medichain123@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important Notes:**
- Remove any spaces from the App Password (it should be 16 characters, no spaces)
- Use `EMAIL_APP_PASSWORD` (not `EMAIL_PASSWORD` or regular password)
- The email user should match the Gmail account you used to generate the App Password

### Step 4: Restart Your Server

After updating the `.env` file:

```bash
# Stop your server (Ctrl+C)
# Then restart it
npm start
# or
node server.js
```

## 🔍 Verify Your Setup

Your `.env` file should have:

```env
EMAIL_USER=medichain123@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here
```

## ❓ Troubleshooting

### "App passwords" option not showing?
- Make sure 2-Step Verification is **fully enabled** and verified
- Wait a few minutes after enabling 2-Step Verification
- Try refreshing the page

### Still getting authentication error?
1. Double-check the App Password in `.env` (no spaces, exactly 16 characters)
2. Make sure `EMAIL_USER` matches the Gmail account used to generate the App Password
3. Verify the `.env` file is in the `backend/` directory
4. Restart your server after changing `.env`
5. Check for typos in the email or password

### Alternative: Use a Different Email Service

If Gmail continues to cause issues, you can use:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (free tier: 62,000 emails/month)

## 📧 Test Email Configuration

After setup, test by:
1. Using the "Forgot Password" feature
2. Check your email inbox for the OTP
3. If successful, you'll see: `✅ OTP email sent successfully` in server logs

---

**Need Help?** Check the server logs for detailed error messages. The error will tell you exactly what's wrong with the email configuration.

