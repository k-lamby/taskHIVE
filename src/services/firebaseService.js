//================== firebaseService.js===========================//
// Here we handle the logic associated with interacting with the
// database. Utility functions to be used elsewhere in the app
//===============================================================//

import { db, auth } from '../config/firebaseConfig';
import { collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore'; 
import { getFunctions, httpsCallable } from "firebase/functions";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Firebase Cloud Functions
const functions = getFunctions();

// Request permissions for push notifications
// This will handle requesting notification permissions from the user.
const requestUserPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    console.log('Notification permissions granted.');
    return true;
  } else {
    console.log('Notification permissions denied.');
    return false;
  }
};

// Configure notification handlers for foreground and background notifications
// This ensures that notifications are displayed properly when the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Get the Expo push token for notifications
// This handles getting the Expo push token, which is necessary for sending push notifications using Expo.
const getExpoPushToken = async () => {
   try {
     const token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log('Expo Push Token:', token);
  //   return token;
   } catch (error) {
     console.error('Error getting Expo Push Token:', error);
     throw error;
   }
};

// Save the Expo Push Token to Firestore, adding it to the user's doc
// This will save the push token to Firestore under the user's document for later use in sending notifications.
const saveTokenToFirestore = async (token, userId) => {
  // Check to make sure that the userId is truthy (aka it exists)
  if (userId && token) {
    try {
      // Write the token to the doc. If the doc already exists, make sure we are just updating the token.
      await setDoc(doc(db, 'users', userId), { expoPushToken: token }, { merge: true });
      console.log('Expo Push Token saved to Firestore successfully');
    } catch (error) {
      console.error("Error saving Expo Push Token to Firestore:", error);
    }
  }
};

// Creates a new user account, uses Firebase authentication
// https://firebase.google.com/docs/auth/web/password-auth
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Request notification permissions and save the token
    if (await requestUserPermission()) {
      const expoPushToken = await getExpoPushToken();
      await saveTokenToFirestore(expoPushToken, userId);
    }

    return userCredential.user;
  } catch (error) {
    // Basic error handling, will expand this out a bit more later
    console.error("Error signing up:", error);
    throw error;
  }
};

// Uses the Firebase authentication for logging the user in
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Request notification permissions and save the token
    if (await requestUserPermission()) {
      const expoPushToken = await getExpoPushToken();
    //  await saveTokenToFirestore(expoPushToken, userId);
    }

    return userCredential.user;
  } catch (error) {
    // If there is an error logging in, logs the error
    // Will expand this to display a message back to the user
    // for a future iteration
    console.error("Error signing in:", error);
    throw error;
  }
};

// Function to send a notification to the provided tokens using Firebase Cloud Functions
// This handles sending push notifications to multiple users via Firebase Cloud Functions.
const sendNotification = async (tokens, projectName) => {
  try {
    const sendNotificationFn = httpsCallable(functions, 'sendProjectNotification');
    const response = await sendNotificationFn({ tokens, projectName });

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Function to fetch Expo Push Tokens of shared users from Firestore
// This queries Firestore for the Expo Push Tokens belonging to the provided email addresses.
const fetchUserTokens = async (emails) => {
  const tokens = [];
  try {
    const usersQuery = query(collection(db, 'users'), where('email', 'in', emails));
    const querySnapshot = await getDocs(usersQuery);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.expoPushToken) tokens.push(data.expoPushToken);
    });

    if (tokens.length === 0) {
      console.warn("No tokens found for the provided emails.");
    }
    return tokens;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return tokens; // Return an empty array on error
  }
};

// Handler for adding a new project to the database
// async function
const createProject = async (projectName, sharedWith, userId) => {
  try {
    const sharedUsers = sharedWith.split(',').map(email => email.trim());
    // Add the project to the projects collection.
    // We allow multiple users to be added by email address, so split them by a comma.
    // We will do a more controlled method of this in a future iteration.
    const docRef = await addDoc(collection(db, 'projects'), {
      name: projectName,
      createdBy: userId,
      sharedWith: sharedUsers,
      createdAt: new Date(),
    });

    // Fetch tokens of users to send notifications
    const tokens = await fetchUserTokens(sharedUsers);
    if (tokens.length > 0) {
      sendNotification(tokens, projectName);
    }

    return docRef.id; 
  } catch (error) {
    // Basic error handling. We will expand this to be more sophisticated later.
    console.error("Error creating project: ", error);
    throw error;
  }
};

// Function to get all the projects for the particular user
// Function to fetch projects created by the user or shared with them
const fetchProjects = async (userId, userEmail) => {
  try {
    // For now get all the projects. Probably a more scalable way to do this.
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return projects.filter(project => {
      // The user id needs to be checked against the current user
      const isCreatedByUser = project.createdBy === userId;
      // Split sharedWith string into an array and check if userId is included
      // We then need to see if there is any match on the shared emails
      // Need to handle the shared emails field being empty
      const sharedWithUsers = (typeof project.sharedWith === 'string' && project.sharedWith !== '')
        ? project.sharedWith.split(',').map(email => email.trim())
        : []; // Return an empty array if nothing, otherwise split the emails

      const isSharedWithUser = sharedWithUsers.includes(userEmail);

      return isCreatedByUser || isSharedWithUser;
    });
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

// Export only the functions that need to be used outside of this
export { signUp, logIn, createProject, fetchProjects };