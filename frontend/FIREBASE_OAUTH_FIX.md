# Fix: "The requested action is invalid" Error

## 🔴 Problem
You're seeing the error: **"The requested action is invalid"** when trying to sign in with Google.

## ✅ Solution Steps

### Step 1: Configure OAuth Consent Screen in Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project: **pms-01-6369b**

2. **Navigate to OAuth Consent Screen:**
   - Go to **APIs & Services** → **OAuth consent screen**

3. **Configure the Consent Screen:**
   - **User Type**: Select **External** (for public use)
   - Click **Create**

4. **Fill in App Information:**
   - **App name**: `MediChain+` (or your app name)
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your logo
   - **App domain**: (Optional)
   - **Developer contact information**: Your email address
   - Click **Save and Continue**

5. **Configure Scopes:**
   - Click **Add or Remove Scopes**
   - Make sure these scopes are added:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **Update** → **Save and Continue**

6. **Add Test Users (if in Testing mode):**
   - If your app is in "Testing" mode, add your email as a test user
   - Click **Add Users**
   - Enter your email address
   - Click **Add** → **Save and Continue**

7. **Review and Submit:**
   - Review your configuration
   - Click **Back to Dashboard**

### Step 2: Enable Google Sign-In in Firebase Console

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: **pms-01-6369b**

2. **Enable Google Authentication:**
   - Go to **Authentication** → **Sign-in method**
   - Click on **Google**
   - Toggle **Enable** to ON
   - Enter **Project support email**: Your email
   - Click **Save**

### Step 3: Verify Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Make sure these are listed:
   - `localhost` ✅
   - `pms-01-6369b.firebaseapp.com` ✅
   - Your production domain (when deployed)

### Step 4: Publish Your App (If Testing Mode)

If your OAuth consent screen is in "Testing" mode:

1. Go to **OAuth consent screen** in Google Cloud Console
2. Click **PUBLISH APP** button at the top
3. Confirm the publishing

**Note**: Publishing makes your app available to all users. For production, this is required.

### Step 5: Wait for Changes to Propagate

- Changes can take a few minutes to propagate
- Wait 2-5 minutes after making changes
- Clear your browser cache
- Try signing in again

## 🔄 Alternative: Use Redirect Instead of Popup

If popup still doesn't work, we can switch to redirect method. Let me know if you want to try this approach.

## ✅ Verification Checklist

- [ ] OAuth consent screen configured in Google Cloud Console
- [ ] App is published (not in testing mode, or test users added)
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Authorized domains include `localhost`
- [ ] Waited 2-5 minutes after configuration
- [ ] Cleared browser cache
- [ ] Restarted dev server

## 🆘 Still Not Working?

If you're still getting the error:

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console tab for detailed error messages
   - Share the full error message

2. **Try Incognito Mode:**
   - Open an incognito/private window
   - Try signing in again
   - This rules out browser cache/cookie issues

3. **Verify API Key:**
   - Make sure your `.env` file has the correct API key
   - Restart your dev server after updating `.env`

4. **Check Firebase Project:**
   - Verify you're using the correct Firebase project
   - Make sure the project ID matches: `pms-01-6369b`

## 📞 Need More Help?

Share:
- Screenshot of the error
- Browser console errors
- Your OAuth consent screen status (Testing/Published)

