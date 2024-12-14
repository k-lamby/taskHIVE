import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig'; // Ensure this points to your existing Firebase config
import { createProject } from '../services/firebaseService'; // Import the createProject function
import { onAuthStateChanged } from 'firebase/auth'; // Import for checking authentication state
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 

const CreateProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [sharedWith, setSharedWith] = useState(''); // Emails to share the project
  const [userId, setUserId] = useState(null); // State to hold the user ID

  useEffect(() => {
    const getFCMToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };
    getFCMToken();
  }, []);
  
  useEffect(() => {
    // Subscribe to the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set user ID if user is logged in
      } else {
        Alert.alert("Error", "You must be logged in to create a project.");
        navigation.goBack(); // Navigate back if no user is logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigation]);

  const handleCreateProject = async () => {
    if (!projectName) {
      Alert.alert("Error", "Please enter a project name.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID is not available.");
      return;
    }

    try {
      // Use the createProject function from firebaseService to save the project
      const projectId = await createProject(projectName, sharedWith, userId);
      Alert.alert("Project Created", `Project ID: ${projectId}\nShared with: ${sharedWith}`);
      navigation.goBack(); // Navigate back after creation
    } catch (error) {
      Alert.alert("Error", "There was a problem creating the project.");
      console.error("Error adding document: ", error);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <TopBar title="Create Project" />
        <View style={styles.content}>
          <Text style={styles.header}>Create Project</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
          />
          <TextInput
            style={styles.input}
            placeholder="Share with (emails separated by commas)"
            value={sharedWith}
            onChangeText={setSharedWith}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateProject}>
            <Text style={styles.buttonText}>Create Project</Text>
          </TouchableOpacity>
        </View>
        <BottomBar navigation={navigation} activeScreen="CreateProject" />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Column layout
  },
  content: {
    flex: 1, // Fill the available space
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0, // Ensure no horizontal padding
  },
  header: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#Bc3908',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default CreateProjectScreen;