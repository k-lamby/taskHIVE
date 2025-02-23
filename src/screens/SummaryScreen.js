import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import useProjectService from "../services/projectService";
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
  const [isFormVisible, setFormVisible] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { userId, userEmail, firstName } = useUser();
  const { fetchProjects } = useProjectService();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !userEmail) {
        console.warn("User ID or email is missing. Skipping fetch.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const projectData = await fetchProjects();
        setProjects(projectData.slice(0, 3));

        const userTasks = await fetchTasksWithSubtasksByOwner(userId);
        setTasks(userTasks.slice(0, 3));

        const recentActivities = await fetchRecentActivities(userId);
        setActivities(recentActivities.slice(0, 3));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userEmail, fetchProjects]);

  const renderSection = (title, data, noDataText, navigateTo, type) => (
    <View style={GlobalStyles.sectionContainer}>
      {/* Section Header */}
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="medium" color="#ffffff" />
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.listItem}
              onPress={() => {
                if (type === "project") {
                  navigation.navigate("ProjectDetail", {
                    projectId: item.id,
                    projectName: item.name,
                  });
                } else if (type === "task") {
                  setSelectedTask(item);
                } else if (type === "activity") {
                  setSelectedActivity(item);
                }
              }}
            >
              <FontAwesomeIcon style={GlobalStyles.bulletPoint} icon={faBolt} />
              <Text style={GlobalStyles.normalText}>
                {item.name || item.title || item.description}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={GlobalStyles.translucentText}>{noDataText}</Text>
      )}

      {/* See More Button */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground>
      {/* Top navigation bar */}
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      <View style={GlobalStyles.container}>
        {/* Featured Projects Section */}
        {renderSection(
          "Featured Projects",
          projects,
          "No projects found.",
          "Projects",
          "project"
        )}

        {/* Featured Tasks Section */}
        {renderSection(
          "Featured Tasks",
          tasks,
          "No tasks found.",
          "TasksScreen",
          "task"
        )}

        {/* Recent Activities Section */}
        {renderSection(
          "Recent Activities",
          activities,
          "No activities found.",
          "ActivitiesScreen",
          "activity"
        )}
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedTask}
          onRequestClose={() => setSelectedTask(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTask.title}</Text>
              <Text style={styles.modalText}>{selectedTask.description}</Text>

              <TouchableOpacity
                style={GlobalStyles.standardButton}
                onPress={() => setSelectedTask(null)}
              >
                <Text style={GlobalStyles.standardButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedActivity}
          onRequestClose={() => setSelectedActivity(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedActivity.description}</Text>

              <TouchableOpacity
                style={GlobalStyles.standardButton}
                onPress={() => setSelectedActivity(null)}
              >
                <Text style={GlobalStyles.standardButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </GradientBackground>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#001524",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalText: {
    color: "#FFFFFF",
    marginTop: 10,
  },
});

export default SummaryScreen;