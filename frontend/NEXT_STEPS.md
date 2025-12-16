# 🚀 Next Steps - Complete Firebase Social Login Setup

## ✅ What You've Completed

1. ✅ Created OAuth client in Google Cloud Console
2. ✅ Got Client ID: `YOUR_CLIENT_ID_HERE`
3. ✅ Got Client Secret: `YOUR_CLIENT_SECRET_HERE`
4. ✅ Replaced logos with clean SVG icons

## 📋 Next Steps (In Order)

### Step 1: Copy Your OAuth Credentials ⚠️ IMPORTANT

**Copy these values NOW** (you won't see the secret again after closing the dialog):

- **Client ID**: `YOUR_CLIENT_ID_HERE`
- **Client Secret**: `YOUR_CLIENT_SECRET_HERE`

### Step 2: Configure Google OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Complete the OAuth consent screen setup:
   - **User Type**: External (for public use)
   - **App name**: `MediChain+`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. **Add Scopes**:
   - Click **Add or Remove Scopes**
   - Make sure these are checked:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
5. **Add Test Users** (if in Testing mode):
   - Click **Add Users**
   - Add your email address
   - Click **Save**

### Step 3: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pms-01-6369b**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Toggle **Enable** to ON
6. Enter **Project support email**: Your email
7. Click **Save**

### Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (⚙️ gear icon)
2. Scroll to **Your apps** section
3. Click the web icon (`</>`) to add a web app
4. Register your app:
   - **App nickname**: `MediChain+ Web`
   - Click **Register app**
5. **Copy the Firebase config values** (you'll see something like):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-6MJ3S87MJP"
}
```

### Step 5: Update Your `.env` File

Create or update `frontend/.env` file with your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Your Backend URL (if you have one)
VITE_BACKEND_URL=http://localhost:4000
```

### Step 6: Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Make sure these are listed:
   - ✅ `localhost`
   - ✅ `pms-01-6369b.firebaseapp.com`
   - ✅ Your production domain (when deployed)

### Step 7: Test Social Login

1. **Start your dev server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to login page**: `http://localhost:5173/login`

3. **Click Google button**:
   - Should open Google sign-in popup
   - Sign in with your Google account
   - Should redirect back and show success message

4. **Test other providers** (Apple, Meta) if configured

## 🔧 Troubleshooting

### Error: "auth/popup-closed-by-user"
- ✅ Normal - user closed the popup

### Error: "auth/unauthorized-domain"
- ❌ Fix: Add your domain to Firebase **Authorized domains** list

### Error: "auth/operation-not-allowed"
- ❌ Fix: Enable Google provider in Firebase Console

### Error: "auth/configuration-not-found"
- ❌ Fix: Check your `.env` file has correct values

### Icons not showing?
- ✅ They're inline SVG - should always work
- Check browser console for errors

## 📝 Optional: Backend Integration

If you want to save social login users to your database, create this endpoint:

**Endpoint**: `POST /api/user/social-login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "photoURL": "https://...",
  "provider": "google",
  "uid": "firebase-uid"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt-token"
}
```

## ✅ Checklist

- [ ] OAuth client created ✅
- [ ] Client ID and Secret copied ✅
- [ ] OAuth consent screen configured ✅
- [ ] Google Sign-In enabled in Firebase ✅
- [ ] Firebase config added to `.env` ✅
- [ ] Authorized domains configured ✅
- [ ] Test users added (if needed) ✅
- [ ] Social login tested ✅

## 🎯 Quick Start Commands

```bash
# 1. Navigate to frontend
cd frontend

# 2. Make sure dependencies are installed
npm install

# 3. Create/update .env file with Firebase config
# (Copy values from Step 5 above)

# 4. Start dev server
npm run dev

# 5. Test at http://localhost:5173/login
```

## 📚 Additional Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Console](https://console.firebase.google.com/)

---

**You're almost there!** Follow these steps in order, and your social login will be working! 🎉

