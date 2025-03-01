//================== activityService.js ==========================//
// This service handles adding and fetching user activities from Firestore.
// Activities include logs such as project updates, task completions,
// file uploads, or other user-initiated actions.
//===============================================================//

import { db } from "../config/firebaseConfig"; // Ensure Firebase is correctly configured
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetch recent activities where the user is either:
 * 1️⃣ The owner of the activity (`userId` matches)
 * 2️⃣ Involved in a task (`taskId` belongs to a task they are assigned to)
 * 
 * @param {string} userId - The user's unique ID.
 * @param {number} [maxActivities=5] - Max number of activities to return.
 * @returns {Promise<Array>} - A list of activity objects.
 */
export const fetchRecentActivities = async (userId, maxActivities = 5) => {
  try {
    if (!userId) throw new Error("User ID is required to fetch activities.");

    console.log("📌 Fetching recent activities for user:", userId);

    // Query activities where the user is either the creator or assigned to the task
    const activitiesQuery = query(
      collection(db, "activities"),
      where("userId", "==", userId), // Fetch activities created by the user
      orderBy("timestamp", "desc"),
      limit(maxActivities)
    );

    const snapshot = await getDocs(activitiesQuery);

    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Fetched ${activities.length} activities.`);
    return activities;
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    throw error;
  }
};

/**
 * Add a new activity log to Firestore.
 * 
 * @param {string} projectId - The project ID.
 * @param {string} taskId - The task ID.
 * @param {string} userId - The user performing the activity.
 * @param {Object} activityData - Details of the activity (e.g., message).
 * @returns {Promise<string>} - The document ID of the added activity.
 */
export const addActivity = async (projectId, taskId, userId, activityData) => {
  try {
    if (!projectId || !taskId || !userId) {
      throw new Error("Project ID, Task ID, and User ID are required.");
    }

    console.log("📌 Adding activity:", { projectId, taskId, userId, activityData });

    // Store activities in a top-level "activities" collection
    const activityRef = collection(db, "activities");

    // Add the activity with relevant metadata
    const docRef = await addDoc(activityRef, {
      projectId,
      taskId,
      userId,
      ...activityData,
      timestamp: Timestamp.now(),
    });

    console.log("✅ Activity added successfully! Document ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding activity:", error);
    throw error;
  }
};