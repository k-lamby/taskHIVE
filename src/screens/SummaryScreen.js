//================== SummaryScreen.js===========================//
// This shows a summary of the users projects and tasks for now
// it will just show projects for now we will expand this for the final version
//===============================================================//
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert } from 'react-native';
import GlobalStyles from '../styles/styles';
import { fetchProjects } from '../services/firebaseService'; // Import fetchProjects

const SummaryScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]); // State to hold projects

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectData = await fetchProjects(); // Pass userId if needed
        setProjects(projectData); // Update state with fetched projects
      } catch (error) {
        Alert.alert("Error", "Failed to fetch projects.");
        console.error(error);
      }
    };

    getProjects(); // Fetch projects on component mount
  }, []);

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.sharedWith}>Shared with: {item.sharedWith.join(', ')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={GlobalStyles.primaryButton} 
        onPress={() => navigation.navigate('CreateProject')}>
        <Text style={GlobalStyles.primaryButtonText}>Create Project</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Welcome to the Summary Screen!</Text>

      {/* Display the list of projects */}
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          style={styles.projectList}
        />
      ) : (
        <Text style={styles.noProjectsText}>No projects created yet.</Text>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#220901',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  projectList: {
    width: '100%',
    marginTop: 20,
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