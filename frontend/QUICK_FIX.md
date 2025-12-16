# 🔧 Quick Fix for Firebase Configuration Error

## ❌ Error You're Seeing
"Firebase configuration error. Please check your Firebase setup."

## ✅ Quick Fix Steps

### Step 1: Create `.env` File

Create a file named `.env` in the `frontend/` folder with this content:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### Step 2: Restart Dev Server

**IMPORTANT**: After creating/updating `.env` file, you MUST restart your dev server:

1. Stop the current server (Press `Ctrl+C` in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 3: Enable Google Sign-In in Firebase

1. Go to: https://console.firebase.google.com/
2. Select project: **pms-01-6369b**
3. Go to: **Authentication** → **Sign-in method**
4. Click: **Google**
5. Toggle: **Enable** ON
6. Enter: Your email as **Project support email**
7. Click: **Save**

### Step 4: Test Again

1. Refresh your browser page
2. Click the Google button
3. Should work now! ✅

## 🔍 Verify Setup

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for:
   - ✅ `Firebase initialized successfully` = Good!
   - ❌ Any red errors = Check the error message

### Check .env File Location
Make sure `.env` is in the **frontend/** folder, not the root folder:
```
prescripto-full-stack/
  └── frontend/
      └── .env  ← Should be here
```

## 🐛 Still Not Working?

### Check 1: Is .env file in the right place?
- Should be: `frontend/.env`
- NOT: `.env` (root folder)

### Check 2: Did you restart the server?
- Environment variables only load when server starts
- Must restart after creating/updating `.env`

### Check 3: Check browser console
- Open F12 → Console tab
- Look for Firebase errors
- Share the error message

### Check 4: Verify Firebase Console
- Go to Firebase Console
- Check if Google Sign-In is enabled
- Check Authorized domains includes `localhost`

## 📝 Common Issues

### Issue: "auth/operation-not-allowed"
**Fix**: Enable Google Sign-In in Firebase Console

### Issue: "auth/invalid-api-key"
**Fix**: Check your `.env` file has correct API key

### Issue: "auth/unauthorized-domain"
**Fix**: Add `localhost` to Firebase Authorized domains

## ✅ Success Checklist

- [ ] `.env` file created in `frontend/` folder
- [ ] `.env` file has all Firebase config values
- [ ] Dev server restarted after creating `.env`
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Browser console shows "Firebase initialized successfully"
- [ ] Google button works without errors

---

**After following these steps, the error should be fixed!** 🎉

