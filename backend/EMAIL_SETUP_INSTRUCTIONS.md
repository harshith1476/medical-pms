# Email Setup Instructions for Forgot Password Feature

## Required Environment Variables

Add the following environment variables to your `backend/.env` file:

```env
# Email Configuration for Password Reset
EMAIL_USER=medichain123@gmail.com
EMAIL_APP_PASSWORD=pdjtddfsetuaffko
```

## How to Set Up Gmail App Password

If you need to generate a new app password in the future:

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification (if not already enabled)
4. Go to "App passwords"
5. Generate a new app password for "Mail"
6. Copy the 16-character password (no spaces)
7. Add it to your .env file

## Testing the Feature

### 1. Request OTP (Forgot Password)
```bash
POST /api/user/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email. Please check your inbox."
}
```

### 2. Reset Password with OTP
```bash
POST /api/user/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

## Features

✅ **Secure OTP Generation**: Random 6-digit OTP
✅ **OTP Expiry**: OTP valid for 10 minutes only
✅ **Password Hashing**: OTP is hashed before storing in database
✅ **Email Templates**: Beautiful HTML email templates with branding
✅ **Confirmation Email**: Sent after successful password reset
✅ **Input Validation**: Email and password validation
✅ **Error Handling**: Comprehensive error messages

## Security Notes

- OTP is hashed using bcrypt before storing in the database
- OTP automatically expires after 10 minutes
- Expired OTPs are automatically cleaned from the database
- Password must be at least 8 characters long
- Email validation using validator library
- No OTP can be reused after successful password reset

## Email Preview

The OTP email includes:
- Professional header with branding
- Large, clear OTP display
- Expiry warning (10 minutes)
- Security tips
- Professional footer

The confirmation email includes:
- Success confirmation
- Security tips
- Contact information for support
- Warning if user didn't make the change

## Troubleshooting

### Email not sending?
- Check if EMAIL_USER and EMAIL_APP_PASSWORD are set correctly in .env
- Verify the app password is correct (16 characters, no spaces)
- Check if 2-Step Verification is enabled on the Gmail account
- Check server logs for detailed error messages

### OTP expired?
- OTP is valid for 10 minutes only
- Request a new OTP using the forgot-password endpoint

### Invalid OTP error?
- Make sure you're entering the correct 6-digit OTP
- Check if OTP has expired
- Request a new OTP if needed

