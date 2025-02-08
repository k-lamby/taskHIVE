//================== authService.js ===========================//
// Here we handle the logic associated with authenticating throughout
// the application from Firebase
//===============================================================//

import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Creates a new user account, uses Firebase Authentication
// Stores first and last name in the Firebase Authentication profile
// https://firebase.google.com/docs/auth/web/password-auth
const signUp = async (email, password, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with first and last name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}` // Store full name
    });

    return user;
  } catch (error) {
    // Basic error handling, will expand this out a bit more later
    console.error("Error signing up:", error);
    throw error;
  }
};

// Uses the Firebase Authentication for logging the user in
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // If there is an error logging in, logs the error
    // Will expand this to display a message back to the user
    // for a future iteration
    console.error("Error signing in:", error);
    throw error;
  }
};

// Export only the functions that need to be used outside of this
export { signUp, logIn };