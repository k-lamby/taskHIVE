import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt, faPlus } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
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

  return (
    <View style={GlobalStyles.backgroundContainer}>
      {/* Top navigation bar */}
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      {/* Main Scrollable Content */}
      <FlatList
        data={[]} // Empty dummy data to enable scrolling
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View>
            {/* Featured Projects Section */}
            <View style={GlobalStyles.transparentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={GlobalStyles.subheaderText}>Featured Projects</Text>
              </View>

              {loading ? (
                <ActivityIndicator size="medium" color="#ffffff" />
              ) : error ? (
                <Text style={GlobalStyles.translucentText}>{error}</Text>
              ) : projects.length > 0 ? (
                <FlatList
                  data={projects}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id, projectName: item.name })}>
                      <View style={styles.listItem}>
                        <FontAwesomeIcon style={GlobalStyles.bulletPoint} icon={faBolt} />
                        <Text style={GlobalStyles.normalText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <Text style={GlobalStyles.translucentText}>No projects found.</Text>
              )}

              <TouchableOpacity style={styles.newItemRow} onPress={() => setFormVisible(true)}>
                <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} />
                <Text style={styles.newItemText}>New project</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.smallButton, GlobalStyles.smallPrimaryButton, styles.customButton]}
                onPress={() => navigation.navigate("Projects")}
              >
                <Text style={GlobalStyles.smallButtonText}>See all projects</Text>
              </TouchableOpacity>
            </View>

            {/* Featured Tasks Section */}
            <View style={GlobalStyles.transparentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={GlobalStyles.subheaderText}>Featured Tasks</Text>
              </View>

              {loading ? (
                <ActivityIndicator size="medium" color="#ffffff" />
              ) : tasks.length > 0 ? (
                <FlatList
                  data={tasks}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                      <FontAwesomeIcon style={GlobalStyles.bulletPoint} icon={faBolt} />
                      <Text style={GlobalStyles.normalText}>{item.title}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <Text style={GlobalStyles.translucentText}>No tasks found.</Text>
              )}

              <TouchableOpacity style={styles.newItemRow} onPress={() => setFormVisible(true)}>
                <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} />
                <Text style={styles.newItemText}>New task</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.smallButton, GlobalStyles.smallPrimaryButton, styles.customButton]}
                onPress={() => navigation.navigate("TasksScreen")}
              >
                <Text style={GlobalStyles.smallButtonText}>See all tasks</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Activities Section */}
            <View style={GlobalStyles.transparentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={GlobalStyles.subheaderText}>Recent Activities</Text>
              </View>

              {loading ? (
                <ActivityIndicator size="medium" color="#ffffff" />
              ) : activities.length > 0 ? (
                <FlatList
                  data={activities}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                      <FontAwesomeIcon style={GlobalStyles.bulletPoint} icon={faBolt} />
                      <Text style={GlobalStyles.normalText}>{item.description}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <Text style={GlobalStyles.translucentText}>No activities found.</Text>
              )}

              <TouchableOpacity style={styles.newItemRow} onPress={() => setFormVisible(true)}>
                <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} />
                <Text style={styles.newItemText}>New activity</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.smallButton, GlobalStyles.smallPrimaryButton, styles.customButton]}
                onPress={() => navigation.navigate("ActivitiesScreen")}
              >
                <Text style={GlobalStyles.smallButtonText}>See all activities</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      {/* Bottom navigation bar */}
      <BottomBar navigation={navigation} activeScreen="Summary" setFormVisible={setFormVisible} />

      {/* Create Project Modal */}
      <CreateProjectModal visible={isFormVisible} onClose={() => setFormVisible(false)} userId={userId} />
    </View>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  newItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  newItemText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 8,
  },
  plusIcon: {
    color: "#78290f",
    fontSize: 16,
  },
  customButton: {
    width: "40%",
  },
});

export default SummaryScreen;