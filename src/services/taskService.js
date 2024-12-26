import { db } from '../config/firebaseConfig'; // Adjust the path as necessary
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Function to create a new task
export const createTask = async (projectId, taskName, dueDate, ownerId) => {
  try {
    const taskRef = await addDoc(collection(db, `projects/${projectId}/tasks`), {
      name: taskName,
      dueDate: dueDate,
      owner: ownerId,
      subtasks: [], // Initialize with an empty array
    });
    return taskRef.id; // Return the ID of the created task
  } catch (error) {
    console.error("Error creating task:", error);
    throw error; // Propagate the error
  }
};

// Function to fetch tasks for a specific project
export const fetchTasks = async (projectId) => {
  try {
    const tasksQuery = query(collection(db, `projects/${projectId}/tasks`), orderBy('dueDate'));
    const querySnapshot = await getDocs(tasksQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Propagate the error
  }
};