//================== firebaseConfig.js===========================//
// Handle the api details and configuration for firebase 
// utility functions are in the service folder
//===============================================================//

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// configuration details provided by firebase
const firebaseConfig = {
  apiKey: ,,,,
  authDomain: ,,,,,
  projectId: ,,,,
  storageBucket: ,,,,
  messagingSenderId: ,,,,
  appId: ,,,,
  measurementId: ,,,,,
  };

// initialise the app instance with the configuration details
const app = initializeApp(firebaseConfig);
// initialise the firestore database instance for the app
const db = getFirestore(app);
// initialise the authentication for the app
// allow persistence even after the app is closed
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
