import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt, faPlus } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import { fetchProjects } from "../services/projectService";
import { fetchTasksWithSubtasksByOwner } from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const SummaryScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for creating a project
  const [isFormVisible, setFormVisible] = useState(false);

  // Get the logged-in user's details from the UserContext
  const { userId, userEmail } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const projectData = await fetchProjects(userId, userEmail);
        const sortedProjects = projectData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProjects(sortedProjects.slice(0, 3)); // Top 3 projects

        const userTasks = await fetchTasksWithSubtasksByOwner(userId);
        const sortedTasks = userTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        setTasks(sortedTasks.slice(0, 3)); // Top 3 tasks

        const recentActivities = await fetchRecentActivities(userId);
        const sortedActivities = recentActivities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(sortedActivities.slice(0, 3));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userEmail]);

  const renderProjectItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id, projectName: item.name })}>
        <View style={styles.projectItem}>
          <FontAwesomeIcon style={GlobalStyles.bulletStyle} icon={faBolt} />
          <Text style={GlobalStyles.normalText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation]
  );

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={GlobalStyles.headerText}>{item.name}</Text>
      <Text style={GlobalStyles.translucentText}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={GlobalStyles.normalText}>Activity: {item.description}</Text>
      <Text style={GlobalStyles.translucentText}>
        Timestamp: {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <GradientBackground>
      {/* Top navigation bar */}
      <TopBar title={`Welcome, ${userEmail || "User"}!`} />

      <View style={styles.container}>
        {/* Projects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={GlobalStyles.subheaderText}>Featured Projects</Text>
            {/* Add Project Button */}
            <TouchableOpacity onPress={() => setFormVisible(true)}>
              <FontAwesomeIcon icon={faPlus} size={24} style={styles.addIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : error ? (
            <Text style={GlobalStyles.translucentText}>{error}</Text>
          ) : projects.length > 0 ? (
            <FlatList
              data={projects}
              renderItem={renderProjectItem}
              keyExtractor={(item) => item.id}
              style={styles.projectList}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Text style={GlobalStyles.translucentText}>No projects found.</Text>
          )}

          {/* See All Projects Button */}
          <TouchableOpacity
            style={[styles.seeAllButton]}
            onPress={() => navigation.navigate("Projects")}
          >
            <Text style={styles.seeAllButtonText}>See All Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={GlobalStyles.subheaderText}>Your Tasks</Text>
          {loading ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : tasks.length > 0 ? (
            <FlatList data={tasks} renderItem={renderTaskItem} keyExtractor={(item) => item.id} />
          ) : (
            <Text style={GlobalStyles.translucentText}>No tasks found.</Text>
          )}
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={GlobalStyles.subheaderText}>Recent Activities</Text>
          {loading ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : activities.length > 0 ? (
            <FlatList
              data={activities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={GlobalStyles.translucentText}>No activities found.</Text>
          )}
        </View>
      </View>

      {/* Bottom navigation bar */}
      <BottomBar
        navigation={navigation}
        activeScreen="Summary"
        setFormVisible={setFormVisible}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        userId={userId}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: "rgba(34, 9, 1, 0.5)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 5,
  },
  addIcon: {
    color: "white",
  },
  flatListContent: {
    paddingTop: 3,
  },
  seeAllButton: {
    alignSelf: "flex-start",
    backgroundColor: "#688e26",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  seeAllButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SummaryScreen;