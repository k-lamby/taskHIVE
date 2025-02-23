//==============================//
// projectService.js            //
//==============================//
// This module handles the logic for creating and accessing projects
// in Firestore. It includes functions for adding a new project,
// as well as fetching projects created by or shared with a user.
//==============================//

import { useCallback } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  where,
  query,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Firebase Auth for email-to-ID lookup
import { useUser } from "../contexts/UserContext";

/**
 * Retrieves the list of user IDs that a given project is shared with.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<string[]>} - Returns an array of user IDs.
 */
const fetchProjectUserIds = async (projectId) => {
  try {
    console.log("🔍 Fetching user IDs for project:", projectId);

    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    // ✅ Fetch the project document from Firestore
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (projectDoc.exists()) {
      const projectData = projectDoc.data();
      console.log("✅ Found project data:", projectData);

      return projectData.sharedWith || []; // ✅ Return the list of user IDs
    } else {
      console.warn("⚠️ Project not found for ID:", projectId);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching project user IDs:", error);
    throw error;
  }
};

/**
 * Checks if an email is associated with an existing Firebase Auth user.
 * If found, returns the user ID; otherwise, returns null.
 * @param {string} email - The email to check in Firebase Authentication.
 * @returns {Promise<string|null>} - Returns the user ID or null if not found.
 */
const getUserIdByEmail = async (email) => {
  try {
    const auth = getAuth();
    const usersRef = collection(db, "users"); // Assuming a "users" collection exists
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id; // Return user ID
    }
    return null; // No user found
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

const useProjectService = () => {
  const { userId, userEmail } = useUser();

  /**
   * Create a new project in Firestore.
   * If a shared email exists as a Firebase user, replace with user ID.
   * @param {Object} projectData - Project details.
   * @param {string} projectData.name - The name of the project.
   * @param {string[]} [projectData.sharedWith] - Array of emails to share the project with.
   * @param {string|Date|null} [projectData.dueDate] - The project due date (optional).
   * @param {string} [projectData.description] - Project description.
   * @param {string[]} [projectData.attachments] - Array of attachment URLs.
   * @returns {Promise<string>} - Returns the ID of the newly created project.
   */
  const createProject = async (projectData) => {
    try {
      if (!userId) {
        throw new Error("User ID is undefined. Cannot create project.");
      }

      const { name, sharedWith, dueDate, description, attachments } = projectData;

      if (!name || typeof name !== "string" || !name.trim()) {
        throw new Error("Invalid project name. It must be a non-empty string.");
      }

      let validDueDate = null;
      if (dueDate) {
        validDueDate = new Date(dueDate);
        if (isNaN(validDueDate.getTime())) {
          throw new Error("Invalid due date format.");
        }
      }

      // ✅ Check if shared emails exist as registered users
      let processedSharedWith = [];
      if (Array.isArray(sharedWith)) {
        const emailChecks = sharedWith.map(async (email) => {
          const foundUserId = await getUserIdByEmail(email.trim());
          return foundUserId || email.trim().toLowerCase(); // Store user ID if found, otherwise store email
        });

        processedSharedWith = await Promise.all(emailChecks);
      }

      // ✅ Store project with processed sharedWith list
      const docRef = await addDoc(collection(db, "projects"), {
        name: name.trim(),
        createdBy: userId,
        sharedWith: processedSharedWith,
        description: description || "",
        attachments: attachments || [],
        createdAt: serverTimestamp(),
        dueDate: validDueDate || serverTimestamp(),
      });

      console.log("✅ Project created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error creating project: ", error);
      throw error;
    }
  };

  /**
   * Fetch all projects associated with the logged-in user.
   * This includes projects created by the user and projects shared with the user.
   * Handles both user IDs and emails in `sharedWith`.
   * @returns {Promise<Array>} - Returns an array of unique projects.
   */
  const fetchProjects = useCallback(async () => {
    try {
      if (!userId || !userEmail) {
        console.warn("⚠️ User ID or email is missing. Skipping fetch.");
        return [];
      }

      console.log("🔍 Fetching projects for user:", { userId, userEmail });

      // Query for projects created by the user
      const createdByQuery = query(
        collection(db, "projects"),
        where("createdBy", "==", userId)
      );

      // Query for projects shared with the user (by ID or email)
      const sharedWithQuery = query(
        collection(db, "projects"),
        where("sharedWith", "array-contains-any", [userId, userEmail.trim()])
      );

      // Execute both queries in parallel
      const [createdBySnapshot, sharedWithSnapshot] = await Promise.all([
        getDocs(createdByQuery),
        getDocs(sharedWithQuery),
      ]);

      // Map Snapshots to Project Objects
      const createdByProjects = createdBySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sharedWithProjects = sharedWithSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine Results and Remove Duplicates
      const allProjects = [
        ...createdByProjects,
        ...sharedWithProjects,
      ].reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {});

      console.log("✅ Fetched projects:", Object.values(allProjects));
      return Object.values(allProjects);
    } catch (error) {
      console.error("❌ Error fetching projects: ", error);
      throw error;
    }
  }, [userId, userEmail]);

  return { createProject, fetchProjects };
};

//==============================//
// Exports (All at the Bottom)  //
//==============================//
export { fetchProjectUserIds };
export default useProjectService;