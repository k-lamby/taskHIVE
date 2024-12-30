//================== SummaryScreen.js ===========================//
// This shows a summary of the user's projects and tasks for now.
// It will just show projects for now; we will expand this for the final version.
//===============================================================//

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBolt, faPlus } from '@fortawesome/free-solid-svg-icons';

import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 
import { fetchProjects } from '../services/projectService';
import { useUser } from '../contexts/UserContext';
import GlobalStyles from '../styles/styles';

const SummaryScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const { userId, userEmail } = useUser();

  useEffect(() => {
    const getProjects = async () => {
      if (!userId) {
        Alert.alert("Error", "User is not logged in.");
        return;
      }
      try {
        const projectData = await fetchProjects(userId, userEmail);
        setProjects(projectData); 
      } catch (error) {
        Alert.alert("Error", "Failed to fetch projects.");
        console.error(error);
      }
    };

    getProjects();
  }, [userId, userEmail]);

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}>
    <View style={styles.projectItem}>
      <FontAwesomeIcon style={GlobalStyles.bulletStyle} icon={faBolt}  />
      <Text style={GlobalStyles.normalText}>{item.name}</Text>
    </View>
    </TouchableOpacity>
  ); 

  return (
    <GradientBackground>
      <TopBar title="Welcome, Katherine!" />
      <View style={styles.container}>
        <View style={styles.projectsSection}>
          <Text style={GlobalStyles.subheaderText}>Current Projects</Text>
          {projects.length > 0 ? (
            <FlatList
              data={projects}
              renderItem={renderProjectItem}
              keyExtractor={item => item.id}
              style={styles.projectList}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Text style={styles.normalText}>No projects created yet.</Text>
          )}
          <TouchableOpacity 
            style={styles.addProject} 
            onPress={() => {}}
          >
            <FontAwesomeIcon style={GlobalStyles.bulletStyle} icon={faPlus}  />
            <Text style={GlobalStyles.translucentText}>Add new project</Text>
          </TouchableOpacity>
        </View> 

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <Text style={GlobalStyles.subheaderText}>Tasks</Text>
          <Text style={GlobalStyles.normalText}>No tasks</Text>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <Text style={GlobalStyles.subheaderText}>Recent Activity</Text>
          <Text style={GlobalStyles.normalText}>No activity</Text>
        </View>
      </View>
      <BottomBar navigation={navigation} activeScreen="Summary" />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  projectsSection: {
    backgroundColor: 'rgba(34, 9, 1, 0.5)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  tasksSection: {
    backgroundColor: 'rgba(104, 142, 38, 0.5)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  activitySection: {
    backgroundColor: 'rgba(248, 148, 59, 0.5)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 10,
  },
  projectList: {
    width: '100%',
    marginTop: 10,
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 5,
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#688e26',
    marginRight: 10,
  },
  projectName: {
    color: '#ffffff',
    fontSize: 18,
    flex: 1,
  },
  noProjectsText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
  addProject: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addProjectText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
  noTasksText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
  noActivityText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SummaryScreen;