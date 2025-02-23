//================== ProjectDetailsScreen.js ===========================//
// This is designed to be a complete view of all the information
// related to the specific project.
// the name of the project will be the title, there will be a smalll
// section at the top with a description of the project and who the project
// has been shared with.
// it will then list all project tasks, who the owner is the due date
// and then any recent activities
//========================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
// these are the various services that contain components for interacting
// with the database
import { fetchTasksByProjectId, createTaskWithSubtasks } from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import { fetchProjectUserIds } from "../services/projectService";
// reusable components for navigation
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
// modals for adding and viewing more detail
import CreateTaskModal from "../components/AddTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import AddActivityModal from "../components/AddActivityModal";
// global styles for anything reusable, and icones for display
import GlobalStyles from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import GradientBackground from "../components/GradientBackground";


const ProjectDetailScreen = ({ navigation }) => {
  // this is where we capture the details of the project
  // the user has navigated from
  const route = useRoute();
  const { projectId, projectName } = route.params;
  // these states are used for storing the data once collected from the 
  // database
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]); 
  const [projectUsers, setProjectUsers] = useState([]);
  // these states are used for showing a loading message while the data is being collected
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  // these states control the visibility of the modals
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [addActivityModalVisible, setAddActivityModalVisible] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  //grab the tasks activities and users 
  // for this particular project
  useEffect(() => {
    fetchTasks();
    fetchActivities();
    fetchUsers();
  }, [projectId]);

  // get the tasks for this particular project
  const fetchTasks = async () => {
    // try catch for debugging
    try {
      // use this to display a load icon while the database is queried
      setLoadingTasks(true);
      // use the taskService to fetch the tasks by id
      const fetchedTasks = await fetchTasksByProjectId(projectId);
      // we then sort the tasks to show the nearest due date first
      fetchedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("ProjectDetailsScreen - Error fetching tasks:", error);
    } finally {
      // finally revert the loading back to false
      setLoadingTasks(false);
    }
  };

  // fetch activities, similar format to fetching tasks
  const fetchActivities = async () => {
    try {
      // state to control the loading display
      setLoadingActivities(true);
      //use the activity service to get the activities associated with the project
      const fetchedActivities = await fetchRecentActivities(projectId);
      //store them in the setActivities state
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("ProjectDetailsScreen - Error fetching activities:", error);
    } finally {
      // then set the loading status back to false
      setLoadingActivities(false);
    }
  };

  // we then want to grab the user ids associated with this project
  // this allows us to display ownership of tasks
  // but also drives the user selection for changing ownership
  const fetchUsers = async () => {
    try {
      // uses the projectService to grab the users associated with the project
      const userIds = await fetchProjectUserIds(projectId);
      setProjectUsers(userIds);
    } catch (error) {
      console.error("ProjectDetailsScreen - Error fetching project users:", error);
    }
  };

  // w
  const handleTaskPress = (task) => {
    setSelectedTask(task);
  };

  return (
    <GradientBackground>
      {/* Display the project name as the top bar title */}
      <TopBar title={projectName} />
      <View style={GlobalStyles.container}>
        {/* Project Tasks Section */}
        <View style={GlobalStyles.sectionContainer}>
          <View style={GlobalStyles.sectionHeader}>
            <Text style={GlobalStyles.sectionTitle}>Project Tasks</Text>
            <TouchableOpacity onPress={() => setAddTaskModalVisible(true)}>
              <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} />
            </TouchableOpacity>
          </View>

          {loadingTasks ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : tasks.length > 0 ? (
            <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTaskPress(item)} style={styles.taskItem}>
                  {/* ✅ Task Status Icon */}
                  <FontAwesomeIcon
                    icon={item.status === "completed" ? faCheckCircle : faCircle}
                    style={item.status === "completed" ? styles.completedIcon : styles.pendingIcon}
                  />

                  {/* ✅ Task Details */}
                  <View style={styles.taskInfo}>
                    <Text style={GlobalStyles.normalText}>{item.name}</Text>
                    <Text style={styles.assignedText}>Assigned to: {item.assignedTo || "Unassigned"}</Text>
                  </View>

                  {/* ✅ Due Date */}
                  <Text style={GlobalStyles.normalText}>{new Date(item.dueDate).toLocaleDateString()}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={GlobalStyles.translucentText}>No tasks created yet.</Text>
          )}
        </View>

        {/* ✅ Recent Activities Section */}
        <View style={styles.projectContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity onPress={() => setAddActivityModalVisible(true)}>
              <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} />
            </TouchableOpacity>
          </View>

          {loadingActivities ? (
            <ActivityIndicator size="medium" color="#ffffff" />
          ) : activities.length > 0 ? (
            <FlatList
              data={activities}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={GlobalStyles.normalText}>{item.description}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={GlobalStyles.translucentText}>No recent activities.</Text>
          )}
        </View>

        {/* ✅ Add Task Modal */}
        <CreateTaskModal
          visible={addTaskModalVisible}
          onClose={() => setAddTaskModalVisible(false)}
          onTaskAdded={fetchTasks}
          projectId={projectId}
          projectUsers={projectUsers}
          createTaskWithSubtasks={createTaskWithSubtasks}
        />

        {/* ✅ Add Activity Modal */}
        <AddActivityModal
          visible={addActivityModalVisible}
          onClose={() => setAddActivityModalVisible(false)}
          projectId={projectId}
        />

        {/* ✅ Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            visible={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={fetchTasks}
          />
        )}
      </View>

      {/* ✅ Bottom Navigation Bar */}
      <BottomBar navigation={navigation} activeScreen="ProjectDetail" />
    </GradientBackground>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  projectContainer: {
    backgroundColor: "#001524",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  taskInfo: {
    flex: 1,
    marginLeft: 10,
  },
  assignedText: {
    fontSize: 12,
    color: "#BBBBBB",
  },
  completedIcon: {
    color: "#00FF00",
    fontSize: 20,
  },
  pendingIcon: {
    color: "#BBBBBB",
    fontSize: 20,
  },
  plusIcon: {
    color: "#FFA500",
    fontSize: 16,
  },
});

export default ProjectDetailScreen;