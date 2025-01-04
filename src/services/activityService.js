//================== activityService.js ==========================//
// This service handles the logic for fetching user activities
// from Firestore. Activities can include logs such as project
// updates, task completions, or other user-initiated actions.
//===============================================================//

import { db } from "../config/firebaseConfig"; // Ensure Firebase is correctly configured
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

/**
 * Fetch recent activities for a specific user.
 * @param {string} userId - The unique ID of the user.
 * @param {number} [maxActivities=3] - The maximum number of activities to return (default is 3).
 * @returns {Promise<Array>} - Returns a list of activity objects.
 */
const fetchRecentActivities = async (userId, maxActivities = 3) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch activities.");
    }

    // Define the Firestore query to fetch activities for the user
    const activitiesQuery = query(
      collection(db, "activities"), // Reference the "activities" collection
      where("userId", "==", userId), // Filter activities by the user's ID
      limit(maxActivities) // Limit the number of activities to return
    );

    // Execute the query and retrieve the activity documents
    const snapshot = await getDocs(activitiesQuery);

    // Map the documents into an array of activity objects
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the Firestore document ID
      ...doc.data(), // Spread the rest of the data
    }));

    return activities;
  } catch (error) {
    console.error("Error fetching activities: ", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export { fetchRecentActivities };