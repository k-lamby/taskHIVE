//================== authService.js===========================//
// Here we handle the logic associated with authenticating throughout
// the application from firebase
//===============================================================//

import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Creates a new user account, uses firebase authentication
// https://firebase.google.com/docs/auth/web/password-auth
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // basic error handling, will expand this out a bit more later
    console.error("Error signing up:", error);
    throw error;
  }
};

// Uses the firebase authentication for logging the user in
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // if there is an error logging in logs the error
    // will expand this to display a message back to the user
    // for a future iteration
    console.error("Error signing in:", error);
    throw error;
  }
};

// export only the functions that need to be used outside of this
export { signUp, logIn };