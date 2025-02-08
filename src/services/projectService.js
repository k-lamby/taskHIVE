//==============================//
// projectService.js            //
//==============================//
// This module handles the logic for creating and accessing projects
// in Firestore. It includes functions for adding a new project,
// as well as fetching projects created by or shared with a user.
//==============================//

import { useCallback } from "react";
import { db } from "../config/firebaseConfig"; // Ensure your Firebase config is set up correctly
import {
  collection,
  where,
  query,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore functions
import { useUser } from "../contexts/UserContext"; // Import User Context

const useProjectService = () => {
  const { userId, userEmail } = useUser(); // Get user details from context

  /**
   * Create a new project in Firestore.
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
        createdBy: userId, // Ensure it uses the context user ID
        sharedWith: Array.isArray(sharedWith) ? sharedWith : [],
        description: description || "",
        attachments: attachments || [],
        createdAt: serverTimestamp(),
        dueDate: validDueDate || serverTimestamp(),
      });

      console.log("Project created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating project: ", error);
      throw error;
    }
  };

  /**
   * Fetch all projects associated with the logged-in user.
   * This includes projects created by the user and projects shared with the user.
   * @returns {Promise<Array>} - Returns an array of unique projects.
   */
  const fetchProjects = useCallback(async () => {
    try {
      if (!userId || !userEmail) {
        console.warn("User ID or email is missing. Skipping fetch.");
        return [];
      }

      console.log("Fetching projects for user:", { userId, userEmail });

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

      console.log("Fetched projects:", Object.values(allProjects));
      return Object.values(allProjects);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      throw error;
    }
  }, [userId, userEmail]); // Memoized so it doesn't trigger infinite re-renders

  return { createProject, fetchProjects };
};

export default useProjectService;