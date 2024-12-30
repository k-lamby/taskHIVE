//================== projectService.js===========================//
// Here we handle the logic associated creating and accessing projects
// from firestore
//===============================================================//

import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';

// get the authentication instance for authorisation
const auth = getAuth();

// Handler for adding a new project to the database
// async function so this can happen while the user navigates around
// the application
const createProject = async (projectName, sharedWith, dueDate) => {
    // first check to make sure the user is authenticated
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      // get the authenticated user id
      const userId = user.uid; 

      // add the project to the projects collection.
      // we allow multiple users to be added by email address, so split them by a ,
      // we will do a more controlled method of this in a future iteration
      const docRef = await addDoc(collection(db, 'projects'), {
        name: projectName,
        createdBy: userId,
        sharedWith: sharedWith.split(',').map(email => email.trim()),
        createdAt: new Date(),
        dueDate: new Date(dueDate)
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
const fetchProjects = async (userId, userEmail) => {
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
        console.log(project.sharedWith);
        const isSharedWithUser = Array.isArray(project.sharedWith) && project.sharedWith.length > 0
        ? project.sharedWith.some(email => email.trim() === userEmail.trim())
        : false;

        return isCreatedByUser || isSharedWithUser;
      });
    } catch (error) {
      console.error("Error fetching projects: ", error);
      throw error;
    }
};

// export only the functions that need to be used outside of this
export { createProject, fetchProjects };