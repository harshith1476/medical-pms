# Firebase Configuration Update Guide

## ✅ Your Firebase Configuration

Your Firebase project is: **pms-01-6369b**

## 📝 Update .env File

Update your `frontend/.env` file with these values:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

## 🔧 Firebase Console Setup

### 1. Enable Google Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pms-01-6369b**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable**
6. Enter your **Support email** (your email address)
7. Click **Save**

### 2. Configure OAuth Consent Screen (if needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **pms-01-6369b**
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure:
   - User Type: **External** (for public use)
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
5. Add scopes: `email`, `profile`
6. Add test users (if in testing mode)
7. Save and continue

### 3. Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are listed:
   - `localhost` (for development)
   - Your production domain (when deployed)

### 4. Configure OAuth Redirect URIs

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. The redirect URI should be automatically configured as:
   - `http://localhost:5173/__/auth/handler` (for development)
   - `https://your-domain.com/__/auth/handler` (for production)

## 🚀 Testing

After updating the `.env` file:

1. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test Google Sign-In:**
   - Go to login page
   - Click the Google button
   - You should see the Google sign-in popup

## ⚠️ Troubleshooting

### Error: "auth/configuration-not-found"
- **Solution**: Make sure your `.env` file has all the correct values
- Restart your dev server after updating `.env`

### Error: "auth/popup-blocked"
- **Solution**: Allow popups in your browser for localhost

### Error: "auth/unauthorized-domain"
- **Solution**: Add your domain to Firebase Authorized domains

### Error: "auth/operation-not-allowed"
- **Solution**: Enable Google provider in Firebase Console → Authentication → Sign-in method

## 📋 Checklist

- [ ] Updated `.env` file with correct Firebase config
- [ ] Enabled Google Authentication in Firebase Console
- [ ] Configured OAuth consent screen (if needed)
- [ ] Added authorized domains
- [ ] Restarted development server
- [ ] Tested Google sign-in

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your Firebase API keys secure
- Use environment variables in production
- Regularly rotate API keys if compromised

