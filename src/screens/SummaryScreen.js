//================== SummaryScreen.js===========================//
// This shows a summary of the users projects and tasks for now
// it will just show projects for now we will expand this for the final version
//===============================================================//
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert } from 'react-native';
import GlobalStyles from '../styles/styles';
import { fetchProjects } from '../services/firebaseService';
import { useUser } from '../contexts/UserContext';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 

const SummaryScreen = ({ navigation }) => {
  // use states to pull in the projects associated with this user
  const [projects, setProjects] = useState([]); 
  const { userId, userEmail } = useUser();

  useEffect(() => {
    const getProjects = async () => {
      // check to ensure the user is logged in before accessing any sensitive information
      if (!userId) {
        Alert.alert("Error", "User is not logged in.");
        return;
      }
      // then try catch to fetch user projects
      try {
        const projectData = await fetchProjects(userId, userEmail);
        // update the states with the returned project data
        setProjects(projectData); 
      } catch (error) {
        // basic error handling, we will expand on this in the next iteration
        Alert.alert("Error", "Failed to fetch projects.");
        console.error(error);
      }
    };

    getProjects();
  }, [userId, userEmail]); // add user details as a dependency in case we need to refetch

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.sharedWith}>Shared with: {item.sharedWith.join(', ')}</Text>
    </View>
  );

  return (
    <GradientBackground>
      <TopBar title="Welcome, Katherine!" />
      <View style={styles.container}>
        {/* Display the list of projects */}
        {projects.length > 0 ? (
          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={item => item.id}
            style={styles.projectList}
            contentContainerStyle={styles.flatListContent} // Adjust FlatList content
          />
        ) : (
          <Text style={styles.noProjectsText}>No projects created yet.</Text>
        )}

<BottomBar navigation={navigation} activeScreen="Summary" />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0, // Ensure no horizontal padding
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  projectList: {
    width: '100%', // Full width for the FlatList
    marginTop: 20,
  },
  flatListContent: {
    paddingHorizontal: 0, // Ensure no horizontal padding
  },
  projectItem: {
    backgroundColor: '#Bc3908',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  projectName: {
    color: '#ffffff',
    fontSize: 18,
  },
  sharedWith: {
    color: '#ffffff',
    fontSize: 14,
  },
  noProjectsText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SummaryScreen;