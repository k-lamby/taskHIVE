// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; // For Firestore
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import the necessary functions
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtvVbmFWVMrZXouvgFLVZsLWwHRzxjMmo",
  authDomain: "taskhive-4edce.firebaseapp.com",
  projectId: "taskhive-4edce",
  storageBucket: "taskhive-4edce.firebasestorage.app",
  messagingSenderId: "49192012242",
  appId: "1:49192012242:web:5366eb06970a8213f7e00b",
  measurementId: "G-ECX6NK3VQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

async function setupAnalytics() {
  if (await isSupported()) {
    const analytics = getAnalytics(app);
  }
}

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Use AsyncStorage for persistence
});

// Call the analytics setup function
setupAnalytics();

// Sign Up Function
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Use the imported function
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign In Function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export { db, auth, signUp, signIn };