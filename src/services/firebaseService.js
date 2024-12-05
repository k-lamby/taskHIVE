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

// Function to get all the projects for the particular user
// Function to fetch projects created by the user or shared with them
const fetchProjects = async (userId) => {
  try {
    // for now get all the projects, probably a more scalable way to do this
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return projects.filter(project => {
      // the user id needs to be checked against the current user
      const isCreatedByUser = project.createdBy === userId;
      // Split sharedWith string into an array and check if userId is included
      // we then need to see if there is any match on the shared emails
      // need to handle the shared emails field being empty
      console.log(project.sharedWith)
      const sharedWithUsers = (typeof project.sharedWith === 'string' && project.sharedWith !== '')
        ? project.sharedWith.split(',').map(email => email.trim())
        : []; // return an empty array if nothing, otherwise split the emails

      console.log(sharedWithUsers)

      const isSharedWithUser = sharedWithUsers.includes(userId);

      return isCreatedByUser || isSharedWithUser;
    });
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

// export only the functions that need to be used outside of this
export { signUp, logIn, createProject, fetchProjects };