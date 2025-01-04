import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../styles/styles';
import CustomDatePicker from './CustomDatePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddUserModal from './AddUserModal';

const AddTaskModal = ({ visible, onClose, onTaskAdded, projectId, createTaskWithSubtasks }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [assignedUser, setAssignedUser] = useState(null); // Single assigned user
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const handleAddTask = async () => {
    try {
      if (!taskName.trim()) {
        alert('Task name is required!');
        return;
      }

      if (!assignedUser) {
        alert('You must assign a user to this task!');
        return;
      }

      // Log the task data for debugging
      console.log('Creating task:', { taskName, taskDescription, dueDate, assignedUser });

      // Add the task
      await createTaskWithSubtasks(projectId, taskName, dueDate, assignedUser);

      // Clear inputs and close the modal
      setTaskName('');
      setTaskDescription('');
      setDueDate(new Date());
      setAssignedUser(null);
      onTaskAdded(); // Notify parent to refresh tasks
      onClose(); // Close modal
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[GlobalStyles.headerText, styles.modalTitle]}>Add Task</Text>

          {/* Task Name Input */}
          <TextInput
            style={[GlobalStyles.inputContainer, styles.input]}
            placeholder="Task Name"
            value={taskName}
            onChangeText={setTaskName}
          />

          {/* Task Description Input */}
          <TextInput
            style={[GlobalStyles.inputContainer, styles.input]}
            placeholder="Task Description"
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
          />

          {/* User Assignment */}
          <Pressable onPress={() => setUserModalVisible(true)} style={styles.userContainer}>
            <Icon name="user-plus" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.userText}>
              {assignedUser ? `Assigned to: ${assignedUser}` : 'Assign a User'}
            </Text>
          </Pressable>

          {/* Due Date Picker */}
          <Pressable onPress={() => setDatePickerVisible(true)} style={styles.dateContainer}>
            <Icon name="calendar" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.dateText}>Due Date: {dueDate.toLocaleDateString()}</Text>
          </Pressable>

          {/* Modal Buttons */}
          <View style={styles.modalButtonContainer}>
            <Pressable style={GlobalStyles.smallPrimaryButton} onPress={handleAddTask}>
              <Text style={GlobalStyles.smallButtonText}>Add Task</Text>
            </Pressable>
            <Pressable style={GlobalStyles.smallSecondaryButton} onPress={onClose}>
              <Text style={GlobalStyles.smallButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* User Assignment Modal */}
      <AddUserModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        onUserAdded={(newUser) => {
          if (newUser) {
            console.log('User added:', newUser); // Debugging
            setAssignedUser(newUser); // Safely set the new user
          } else {
            alert('Invalid user! Please select a valid user.');
          }
        }}
      />

      {/* Due Date Picker */}
      <CustomDatePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onDateChange={(date) => setDueDate(date)}
        title="Select Due Date"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#220901',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
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

export default AddTaskModal;