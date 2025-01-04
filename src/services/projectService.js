//==============================//
// projectService.js            //
//==============================//
// This module handles the logic for creating and accessing projects
// in Firestore. It includes functions for adding a new project,
// as well as fetching projects created by or shared with a user.
//==============================//

import { db } from "../config/firebaseConfig"; // Ensure your Firebase config is set up correctly
import {
  collection,
  where,
  query,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore functions
import { getAuth } from "firebase/auth"; // Import Firebase Auth

//==============================//
// Firebase Authentication Setup
//==============================//
const auth = getAuth(); // Get the authentication instance for user authorization

/**
 * Create a new project in Firestore.
 * @param {string} projectName - The name of the project.
 * @param {string} sharedWith - Comma-separated string of emails to share the project with.
 * @param {string|Date|null} dueDate - The project due date (optional).
 * @returns {Promise<string>} - Returns the ID of the newly created project.
 */
const createProject = async (projectData) => {
  try {
    const { name, sharedWith, dueDate, createdBy, description, attachments } =
      projectData;

    // Validate `name`
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new Error("Invalid project name. It must be a non-empty string.");
    }

    // Validate `dueDate`
    let validDueDate = null;
    if (dueDate) {
      validDueDate = new Date(dueDate);
      if (isNaN(validDueDate.getTime())) {
        throw new Error("Invalid due date format. Please provide a valid date.");
      }
    }

    // Add project to Firestore
    const docRef = await addDoc(collection(db, "projects"), {
      name: name.trim(),
      createdBy,
      sharedWith: Array.isArray(sharedWith) ? sharedWith : [],
      description: description || "",
      attachments: attachments || [],
      createdAt: serverTimestamp(),
      dueDate: validDueDate || serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating project: ", error);
    throw error;
  }
};

/**
 * Fetch all projects associated with a user.
 * This includes projects created by the user and projects shared with the user.
 * @param {string} userId - The unique ID of the user.
 * @param {string} userEmail - The email address of the user.
 * @returns {Promise<Array>} - Returns an array of unique projects.
 */
const fetchProjects = async (userId, userEmail) => {
  try {
    // Query for projects created by the user
    const createdByQuery = query(
      collection(db, "projects"),
      where("createdBy", "==", userId)
    );

    // Query for projects shared with the user
    const sharedWithQuery = query(
      collection(db, "projects"),
      where("sharedWith", "array-contains", userEmail.trim())
    );

    // Execute both queries in parallel
    const [createdBySnapshot, sharedWithSnapshot] = await Promise.all([
      getDocs(createdByQuery),
      getDocs(sharedWithQuery),
    ]);

    // Map Snapshots to Project Objects
    const createdByProjects = createdBySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    const sharedWithProjects = sharedWithSnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    // Combine Results and Remove Duplicates
    const allProjects = [
      ...createdByProjects,
      ...sharedWithProjects,
    ].reduce((acc, project) => {
      acc[project.id] = project; // Use project ID as the key to ensure uniqueness
      return acc;
    }, {});

    // Return an array of unique projects
    return Object.values(allProjects);
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

//==============================//
// Export Functions
//==============================//
export { createProject, fetchProjects };