import { db } from '../config/firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

/* ======================
   Create a task with subtasks, attachments, and messages
   ====================== */
export const createTaskWithSubtasks = async (
  projectId,
  taskName,
  dueDate,
  ownerId,
  subtasks = [],
  attachments = [],
  messages = []
) => {
  try {
    // Format subtasks
    const formattedSubtasks = subtasks.map((subtask, index) => ({
      id: `subtask${index + 1}`,
      name: subtask.name,
      owner: subtask.owner || ownerId,
      priority: subtask.priority || 'Medium',
      dueDate: new Date(subtask.dueDate || dueDate), // Ensure date consistency
      completionDate: null,
      completed: false,
      attachments: subtask.attachments || [], // Subtask-level attachments
      messages: subtask.messages || [], // Subtask-level messages
    }));

    // Add the task to Firestore
    const taskRef = await addDoc(collection(db, 'tasks'), {
      name: taskName,
      projectId,
      owner: ownerId,
      dueDate: new Date(dueDate), // Ensure dueDate is stored as a valid Date object
      createdAt: serverTimestamp(), // Use Firestore's server timestamp
      subtasks: formattedSubtasks,
      attachments, // Task-level attachments
      messages, // Task-level messages
    });

    return taskRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/* ======================
   Fetch tasks by projectId (with Timestamp conversion)
   ====================== */
export const fetchTasksByProjectId = async (projectId) => {
  try {
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('projectId', '==', projectId) // Query tasks by projectId
    );

    const querySnapshot = await getDocs(tasksQuery);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convert Firestore Timestamps to JavaScript Date objects
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : null,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      };
    });
  } catch (error) {
    console.error('Error fetching tasks by projectId:', error);
    throw error;
  }
};

/* ======================
   Fetch tasks and subtasks for a specific user
   ====================== */
export const fetchTasksWithSubtasksByOwner = async (ownerId) => {
  try {
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('owner', '==', ownerId) // Query tasks by owner
    );

    const querySnapshot = await getDocs(tasksQuery);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convert Firestore Timestamps to JavaScript Date objects
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : null,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      };
    });
  } catch (error) {
    console.error('Error fetching tasks by owner:', error);
    throw error;
  }
};

/* ======================
   Mark a subtask as completed
   ====================== */
export const markSubtaskComplete = async (taskId, subtaskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    const updatedSubtasks = taskData.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: true, completionDate: serverTimestamp() }
        : subtask
    );

    await updateDoc(taskRef, { subtasks: updatedSubtasks });
  } catch (error) {
    console.error('Error marking subtask complete:', error);
    throw error;
  }
};

/* ======================
   Add an attachment to a task or subtask
   ====================== */
export const addAttachment = async (taskId, subtaskId = null, attachment) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    if (subtaskId) {
      // Add attachment to a subtask
      const updatedSubtasks = taskData.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, attachments: [...subtask.attachments, attachment] }
          : subtask
      );
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } else {
      // Add attachment to the task
      await updateDoc(taskRef, {
        attachments: [...taskData.attachments, attachment],
      });
    }
  } catch (error) {
    console.error('Error adding attachment:', error);
    throw error;
  }
};

/* ======================
   Add a message to a task or subtask
   ====================== */
export const addMessage = async (taskId, subtaskId = null, message) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    if (subtaskId) {
      // Add message to a subtask
      const updatedSubtasks = taskData.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, messages: [...subtask.messages, message] }
          : subtask
      );
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } else {
      // Add message to the task
      await updateDoc(taskRef, {
        messages: [...taskData.messages, message],
      });
    }
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};