# Environment Variables Setup

This document explains the required environment variables for the MediChain+ backend.

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Database Configuration
```env
MONGODB_URI=your_mongodb_connection_string_here
```

### Server Configuration
```env
PORT=4000
```

### JWT Secret Keys
```env
JWT_SECRET=your_jwt_secret_key_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_key_here
DOCTOR_JWT_SECRET=your_doctor_jwt_secret_key_here
```

### Cloudinary Configuration (for image uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Email Configuration (NEW - for Admin Panel Patient Communication)
```env
ADMIN_EMAIL=medichain123@gmail.com
ADMIN_EMAIL_PASSWORD=your_gmail_app_password_here

# OR use these (if already configured for other features):
EMAIL_USER=medichain123@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here
```

**Important Notes for Email Setup:**
1. For Gmail, you **MUST** use an App Password, not your regular password
2. Enable 2-Step Verification on your Google Account first
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the generated 16-character App Password (remove spaces)
5. You can use either `ADMIN_EMAIL_PASSWORD` OR `EMAIL_APP_PASSWORD` - both will work
6. The email will be sent FROM `medichain123@gmail.com` TO patient emails

### Razorpay Configuration (for payments)
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend URLs (for CORS)
```env
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173
```

## Example .env File

```env
# Database
MONGODB_URI=mongodb://localhost:27017/medichain

# Server
PORT=4000

# JWT Secrets
JWT_SECRET=your_secret_key_here
ADMIN_JWT_SECRET=your_admin_secret_here
DOCTOR_JWT_SECRET=your_doctor_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (NEW - Required for Admin Communication Features)
ADMIN_EMAIL=medichain123@gmail.com
ADMIN_EMAIL_PASSWORD=abcd efgh ijkl mnop

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173
```

## Gmail App Password Setup Steps

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Go to **Security** → **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "MediChain+ Admin" as the name
6. Click **Generate**
7. Copy the 16-character password (remove spaces)
8. Paste it as `ADMIN_EMAIL_PASSWORD` in your `.env` file

## Testing Email Configuration

After setting up the environment variables, test the email functionality:
1. Start the backend server
2. Login to Admin Panel
3. Go to "All Appointments"
4. Click the Mail icon (✉️) on any appointment
5. Send a test email

If email fails, check:
- App Password is correct (16 characters, no spaces)
- 2-Step Verification is enabled
- `ADMIN_EMAIL` matches the Gmail account used to generate App Password

