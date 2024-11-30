//================== firebaseService.js===========================//
// Here we handle the logic associated with interacting with the
// database. Utility functions to be used elsewhere in the app
//===============================================================//

import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
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

// Uses the firebase authentication for loging the user in
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

// Handler for adding a new project to the database
// async function
const createProject = async (projectName, sharedWith, userId) => {
  try {
    // add the project to the projects collection.
    // we allow multiple users to be added by email address, so split them by a ,
    // we will do a more controlled method of this in a future iteration
    const docRef = await addDoc(collection(db, 'projects'), {
      name: projectName,
      createdBy: userId,
      sharedWith: sharedWith.split(',').map(email => email.trim()),
      createdAt: new Date(),
    });
    return docRef.id; 
  } catch (error) {
    // basic error handling we will expand this to be more sophisticated later
    console.error("Error creating project: ", error);
    throw error;
  }
};

// Function to fetch all projects
const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

// Export all functions for use in components
export { signUp, logIn, createProject, fetchProjects };