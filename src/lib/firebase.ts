// Firebase Configuration for FocusOS Dashboard
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH1LiQln_BUqdNflYq6NtMwEeI0aK5iPY",
  authDomain: "focusos-dashboard-192ad.firebaseapp.com",
  projectId: "focusos-dashboard-192ad",
  storageBucket: "focusos-dashboard-192ad.firebasestorage.app",
  messagingSenderId: "522359106544",
  appId: "1:522359106544:web:4df9c1308040ef59154b35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore (for future cloud sync)
export const db = getFirestore(app);

export default app;

