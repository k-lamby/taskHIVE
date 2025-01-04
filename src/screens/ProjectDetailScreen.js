import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchTasks, createTask } from '../services/taskService';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 
import GlobalStyles from '../styles/styles';
import CustomDatePicker from '../components/CustomDatePicker';
import AddUserModal from '../components/AddUserModal';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this is the correct import

const ProjectDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { projectId, projectName } = route.params;
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [assignedUser, setAssignedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(projectId);
        fetchedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    try {
      await createTask(projectId, taskName, taskDescription, dueDate.toISOString(), assignedUser);
      setTaskName('');
      setTaskDescription('');
      setDueDate(new Date());
      setAssignedUser(null);
      setModalVisible(false);
      const updatedTasks = await fetchTasks(projectId);
      updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
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
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <View style={styles.bullet} />
                <Text style={GlobalStyles.normalText}>
                  {item.name} - Due: {new Date(item.dueDate).toLocaleDateString()} - Assigned to: {item.assignedUser || 'Unassigned'}
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={GlobalStyles.normalText}>No tasks created yet.</Text>}
          />
          
          <TouchableOpacity 
            style={styles.addTask} 
            onPress={() => setModalVisible(true)}
          >
            <Icon name="plus" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
            <Text style={GlobalStyles.translucentText}>Add new task</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={[GlobalStyles.headerText, styles.modalTitle]}>Add Task</Text>
              <TextInput
                style={[GlobalStyles.inputContainer, styles.descriptionInput]}
                placeholder="Task Description"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />
              
              {/* User Assignment */}
              <Pressable onPress={() => setUserModalVisible(true)} style={styles.userContainer}>
                <Icon name="user-plus" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.userText}>{assignedUser || 'Unassigned'}</Text>
              </Pressable>
              
              {/* Due Date */}
              <Pressable onPress={() => setDatePickerVisible(true)} style={styles.dateContainer}>
                <Icon name="calendar" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.dateText}>Due Date: {dueDate.toLocaleDateString()}</Text>
              </Pressable>

              {/* Subtask prompt */}
              <Pressable style={styles.subtaskContainer}>
                <Icon name="plus" style={GlobalStyles.translucentText} />
                <Text style={GlobalStyles.translucentText}>Add a subtask</Text>
              </Pressable>

              <View style={styles.modalButtonContainer}>
                <Pressable style={GlobalStyles.smallPrimaryButton} onPress={handleAddTask}>
                  <Text style={GlobalStyles.smallButtonText}>Add Task</Text>
                </Pressable>
                <Pressable style={GlobalStyles.smallSecondaryButton} onPress={() => setModalVisible(false)}>
                  <Text style={GlobalStyles.smallButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <AddUserModal 
          visible={userModalVisible} 
          onClose={() => setUserModalVisible(false)} 
          onUserAdded={(user) => {
            setAssignedUser(prev => [...prev, user]);
            setUserModalVisible(false);
          }} 
        />

        <CustomDatePicker
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onDateChange={(date) => setDueDate(date)}
          title="Select Due Date"
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '50%',
    backgroundColor: '#220901',
    borderRadius: 10,
    padding: 20,
    marginTop: '50%',
    alignSelf: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionInput: {
    height: 80,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  subtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  icons: {
    fontSize: 24,
    marginRight: 5,
  },
});

export default ProjectDetailScreen;