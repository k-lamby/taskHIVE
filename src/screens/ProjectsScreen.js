import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import { fetchProjects } from "../services/projectService";
import { fetchTasksByProjectId } from "../services/taskService";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Feather";

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const { userId, userEmail } = useUser();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjects(userId, userEmail);

        // Fetch tasks for each project and get the top 4
        const projectsWithTasks = await Promise.all(
          projectData.map(async (project) => {
            const tasks = await fetchTasksByProjectId(project.id);
            return {
              ...project,
              tasks: tasks.slice(0, 4),
            };
          })
        );

        setProjects(projectsWithTasks);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId, userEmail]);

  const renderProject = ({ item }) => (
    <View style={styles.projectContainer}>
      {/* Project Header */}
      <View style={styles.projectHeader}>
        <Text style={styles.projectName}>{item.name}</Text>

        {/* Icons for Add User, Edit, Delete */}
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Icon name="user-plus" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shared Users */}
      <Text style={styles.sharedUsers}>
        {item.sharedWith && item.sharedWith.length > 0
          ? `Shared with: ${item.sharedWith.join(", ")}`
          : "Not shared"}
      </Text>

      {/* Task List */}
      {item.tasks.length > 0 ? (
        item.tasks.map((task, index) => (
          <Text key={index} style={styles.taskItem}>
            • {task.name}
          </Text>
        ))
      ) : (
        <Text style={styles.noTasks}>No tasks yet</Text>
      )}

      {/* "See More" Link */}
      <TouchableOpacity
        style={styles.seeMore}
        onPress={() =>
          navigation.navigate("ProjectDetailScreen", { projectId: item.id })
        }
      >
        <Text style={styles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground>
      {/* Top navigation bar */}
      <TopBar title="Your Projects" />

      <View style={styles.container}>
        {/* Projects Section */}


          {loading ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : error ? (
            <Text style={GlobalStyles.translucentText}>{error}</Text>
          ) : projects.length > 0 ? (
            <FlatList
              data={projects}
              renderItem={renderProject}
              keyExtractor={(item) => item.id}
              style={styles.projectList}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Text style={GlobalStyles.translucentText}>No projects found.</Text>
          )}

      </View>

      {/* Bottom navigation bar */}
      <BottomBar
        navigation={navigation}
        activeScreen="Projects"
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
  projectContainer: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  sharedUsers: {
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: 4,
  },
  taskItem: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 10,
    marginTop: 4,
  },
  noTasks: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
    marginTop: 4,
  },
  seeMore: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  seeMoreText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  addIcon: {
    color: "white",
  },
  flatListContent: {
    paddingTop: 3,
  },
});

export default ProjectsScreen;