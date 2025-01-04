import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchTasksByProjectId, createTaskWithSubtasks } from '../services/taskService';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from '../components/GradientBackground';
import GlobalStyles from '../styles/styles';
import AddTaskModal from '../components/AddTaskModal';

const ProjectDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { projectId, projectName } = route.params;
  const [tasks, setTasks] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await fetchTasksByProjectId(projectId);
      fetchedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(fetchedTasks);
      console.log(fetchedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <GradientBackground>
      <TopBar title={projectName} />
      <View style={styles.container}>
        <View style={styles.tasksSection}>
          <Text style={GlobalStyles.subheaderText}>Project Tasks</Text>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <View style={styles.bullet} />
                <Text style={GlobalStyles.normalText}>
                  {item.name} - Due: {new Date(item.dueDate).toLocaleDateString()} - Assigned to:{' '}
                  {item.assignedUser || 'Unassigned'}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={GlobalStyles.normalText}>No tasks created yet.</Text>
            }
          />

          <TouchableOpacity
            style={styles.addTask}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={GlobalStyles.translucentText}>Add New Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddTaskModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onTaskAdded={fetchTasks}
        projectId={projectId}
        createTaskWithSubtasks={createTaskWithSubtasks} // Pass the function
      />

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
  tasksSection: {
    backgroundColor: 'rgba(104, 142, 38, 0.5)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#688e26',
    marginRight: 10,
  },
  addTask: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

export default ProjectDetailScreen;