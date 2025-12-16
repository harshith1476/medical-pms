# Email Setup for Render Deployment

## ⚠️ Common Issue: Emails Not Sending After Deploy

If emails are not sending after deploying to Render, follow these steps:

## Step 1: Set Environment Variables in Render Dashboard

1. Go to your Render Dashboard → Your Service → **Environment**
2. Add these **exact** environment variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

**Important:**
- ✅ Use `EMAIL_USER` (not `ADMIN_EMAIL`)
- ✅ Use `EMAIL_APP_PASSWORD` (not `EMAIL_PASSWORD`)
- ✅ Remove ALL spaces from App Password
- ✅ App Password must be exactly 16 characters

## Step 2: Verify Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Make sure 2-Step Verification is enabled
3. Generate a new App Password if needed
4. Copy the 16-character password (no spaces)

## Step 3: Check Render Logs

1. Go to Render Dashboard → Your Service → **Logs**
2. Look for these messages:
   - ✅ `📧 Email Configuration:` - Shows email is configured
   - ❌ `❌ EMAIL_USER is not set` - Environment variable missing
   - ❌ `❌ EMAIL_APP_PASSWORD is not set` - Password missing
   - ❌ `Error [ERR_MODULE_NOT_FOUND]` - Dependencies issue

## Step 4: Test Email Configuration

After setting environment variables:

1. **Redeploy** your service (or wait for auto-deploy)
2. Check logs for email configuration messages
3. Try sending a test email (OTP, appointment, etc.)
4. Check logs for email send status

## Common Errors & Fixes

### Error: "EMAIL_USER is not set"
**Fix:** Add `EMAIL_USER=your-email@gmail.com` in Render Environment Variables

### Error: "EMAIL_APP_PASSWORD is not set"
**Fix:** Add `EMAIL_APP_PASSWORD=your_app_password` in Render Environment Variables

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Fix:** 
- Make sure you're using Gmail **App Password**, not regular password
- Remove spaces from App Password
- Regenerate App Password if needed

### Error: "Cannot find package 'nodemailer'"
**Fix:** 
- Check that `package.json` includes `nodemailer`
- Redeploy to ensure dependencies are installed

## Quick Checklist

- [ ] `EMAIL_USER` set in Render Environment Variables
- [ ] `EMAIL_APP_PASSWORD` set in Render Environment Variables
- [ ] App Password is 16 characters (no spaces)
- [ ] 2-Step Verification enabled on Gmail account
- [ ] Service redeployed after adding variables
- [ ] Checked Render logs for errors

## Alternative: Use SendGrid or Mailgun

If Gmail continues to have issues, consider using:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (very cheap, production-ready)

## Need Help?

Check Render logs for specific error messages and refer to:
- `GMAIL_APP_PASSWORD_SETUP.md` - Detailed Gmail setup
- `QUICK_EMAIL_FIX.md` - Quick troubleshooting

