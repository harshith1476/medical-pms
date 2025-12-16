# Firebase Authentication Setup Guide

## Overview
This project now includes Firebase Authentication for social login (Google, Apple, Meta/Facebook).

## Installation

1. **Install Firebase dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Firebase Configuration

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Authentication Providers

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Google**: Click "Enable" and configure OAuth consent screen
   - **Apple**: Click "Enable" and configure (requires Apple Developer account)
   - **Facebook**: Click "Enable" and add your App ID and App Secret

### Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app and copy the Firebase configuration object

### Step 4: Set Environment Variables

Create or update `frontend/.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 5: Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your domain (e.g., `localhost` for development, your production domain)

## Features Implemented

### ✅ Social Login Buttons
- **Apple**: Official black logo from Wikimedia
- **Google**: Official colored logo from Firebase
- **Meta/Facebook**: Official logo from Wikimedia

### ✅ Authentication Handlers
- `handleGoogle()` - Google Sign-In with Firebase
- `handleApple()` - Apple Sign-In with Firebase
- `handleMeta()` - Facebook/Meta Sign-In with Firebase

### ✅ UI Features
- Official divider with "Or continue with" text
- 32px logos with hover scale animation
- Smooth transitions
- Disabled state during loading
- Responsive design

## Backend Integration

The social login handlers attempt to send user data to your backend at `/api/user/social-login`. 

**Note:** You may need to create this endpoint in your backend to handle social login users. The endpoint should:
- Accept: `{ email, name, photoURL, provider, uid }`
- Return: `{ success: true, token: "jwt-token" }`

If the backend endpoint doesn't exist, Firebase authentication will still work, but users won't be registered in your backend database.

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click any social login button
4. Complete the OAuth flow
5. User should be authenticated and redirected

## Troubleshooting

### Error: "Firebase: Error (auth/popup-closed-by-user)"
- User closed the popup window. This is normal behavior.

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Firebase Authorized domains list.

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Enable the authentication provider in Firebase Console.

### Logos not loading
- Check your internet connection
- Verify the SVG URLs are accessible
- Check browser console for CORS errors

## Security Notes

- Never commit `.env` file to version control
- Keep Firebase API keys secure
- Use environment variables for all sensitive data
- Configure Firebase Security Rules appropriately

