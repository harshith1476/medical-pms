import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, OAuthProvider, FacebookAuthProvider } from 'firebase/auth'

// Firebase configuration
// These values are used from environment variables or fallback to defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
}

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId']
  const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field].includes('your-'))
  
  if (missingFields.length > 0) {
    console.warn('⚠️ Firebase configuration incomplete. Missing:', missingFields)
    console.warn('Please set environment variables in .env file')
  }
  
  return missingFields.length === 0
}

// Initialize Firebase
let app
let auth
let googleProvider
let appleProvider
let facebookProvider

try {
  // Validate configuration first
  const isValid = validateFirebaseConfig()
  
  if (!isValid) {
    console.warn('⚠️ Firebase configuration may be incomplete. Using fallback values.')
  }
  
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  
  // Configure Google Auth Provider
  googleProvider = new GoogleAuthProvider()
  // Profile and email scopes are included by default
  // Set additional parameters if needed
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  })
  
  // Configure Apple Auth Provider
  appleProvider = new OAuthProvider('apple.com')
  
  // Configure Facebook Auth Provider
  facebookProvider = new FacebookAuthProvider()
  facebookProvider.addScope('email')
  facebookProvider.addScope('public_profile')
  
  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    config: {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing'
    }
  })
  
  // Don't throw - allow app to continue but log error
  // Components will handle undefined auth gracefully
  console.warn('⚠️ Firebase not initialized. Social login will not work until configured.')
}

export { auth, googleProvider, appleProvider, facebookProvider }
export default app

