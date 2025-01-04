import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage.
 * @param {string} uri - The local file URI (e.g., from Expo Image Picker).
 * @param {string} storagePath - The path in Firebase Storage to save the file (e.g., `projects/{userId}/{fileName}`).
 * @returns {Promise<string>} - Returns the download URL of the uploaded file.
 */
export const uploadFile = async (uri, storagePath) => {
  try {
    // Fetch the file from the local URI and convert it to a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Initialize Firebase Storage and create a reference
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);

    // Upload the file Blob to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get and return the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Deletes a file from Firebase Storage.
 * @param {string} storagePath - The path in Firebase Storage of the file to delete (e.g., `projects/{userId}/{fileName}`).
 * @returns {Promise<void>} - Resolves when the file is deleted successfully.
 */
export const deleteFile = async (storagePath) => {
  try {
    // Initialize Firebase Storage and create a reference
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);

    // Delete the file from Firebase Storage
    await deleteObject(storageRef);
    console.log(`File at path "${storagePath}" successfully deleted.`);
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Retrieves a download URL for a file in Firebase Storage.
 * @param {string} storagePath - The path in Firebase Storage of the file (e.g., `projects/{userId}/{fileName}`).
 * @returns {Promise<string>} - Returns the download URL of the file.
 */
export const getFileDownloadURL = async (storagePath) => {
  try {
    // Initialize Firebase Storage and create a reference
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);

    // Get and return the download URL of the file
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error retrieving file download URL from Firebase Storage:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};