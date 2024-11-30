//================== UserContext.js===========================//
// We want to be able to access certain user level information
// throughout the app. This allows us to ensure we tag new projects
// and events to the correct person
//===============================================================//

import React, { createContext, useContext, useState } from 'react';

// create the new context for the user
const UserContext = createContext();

// Create a provider, this will wrap around the components that
// I want to pass the user details to
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initial state for user ID

  // This will be what is passed to the components
  // set user id allows us to update it when the user is loggin in
  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook for simplicity in accessing the usercontext
export const useUser = () => useContext(UserContext);