//================== CreateProjectForm.js ===========================//
// This component allows the user to create a project and add users
// documents etc.
// Connects to various other modals for controlled input of the data.
//===============================================================//

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Dimensions, 
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import AddUserModal from './AddUserModal';
import CustomDatePicker from './CustomDatePicker';
import { createProject } from '../services/projectService';
import { useUser } from '../contexts/UserContext';

import GlobalStyles from '../styles/styles';

// Get the height and width of the window for determining the slide pull up
const { height, width } = Dimensions.get('window');

const CreateProjectForm = ({ visible, onClose }) => {
  const { userId } = useUser(); // Get user id
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [addedUsers, setAddedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateProject = async () => {
    const sharedWithEmails = addedUsers.join(',');

    try {
      await createProject(projectName, sharedWithEmails, dueDate.toISOString(), userId);
      resetFormFields();
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const resetFormFields = () => {
    setProjectName('');
    setProjectDescription('');
    setDueDate(new Date());
    setAddedUsers([]);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>Create New Project</Text>
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalText, styles.inputText]}
              placeholder="Project Name"
              placeholderTextColor="white"
              value={projectName}
              onChangeText={setProjectName}
              required
            />
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalText, styles.inputText, styles.desc]}
              placeholder="Project Description"
              placeholderTextColor="white"
              multiline={true}
              numberOfLines={3} // Set to 3 lines high
              value={projectDescription}
              onChangeText={setProjectDescription}
              required
            />
            <View style={styles.dueDateContainer}>
              <Text style={styles.dueDateLabel}>Due Date:</Text>
              <Pressable 
                style={[GlobalStyles.inputContainer, styles.dateContainer]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            <View style={styles.addedUsersContainer}>
              {addedUsers.map((user, index) => (
                <Text key={index} style={styles.addedUser}>{user}</Text>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={GlobalStyles.smallSecondaryButton}
                onPress={handleCreateProject}>
                <Text style={GlobalStyles.smallButtonText}>Create</Text>
              </Pressable>
              <Pressable
                style={GlobalStyles.smallPrimaryButton}
                onPress={() => {
                  resetFormFields();
                  onClose();
                }}>
                <Text style={GlobalStyles.smallButtonText}>Cancel</Text>
              </Pressable>
            </View>
            <View style={styles.iconContainer}>
              <Icon name="paperclip" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <Icon name="image" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <Icon name="comment" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <Pressable onPress={() => setShowUserModal(true)}>
                <Icon name="user-plus" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <AddUserModal 
        visible={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        onUserAdded={setAddedUsers} 
      />
      <CustomDatePicker 
        visible={showDatePicker} 
        onClose={() => setShowDatePicker(false)} 
        onDateChange={setDueDate} 
        title="Due Date"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end', 
  },
  modalContainer: {
    height: height * 0.80,
    width: width * 0.9,
    backgroundColor: '#e87722',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: '5%',
    alignItems: 'center',
  },
  modalHeader: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
  },
  dueDateLabel: {
    color: 'white',
    marginRight: 10,
  },
  dateContainer: {
    flex: 1, 
  },
  dateText: {
    color: 'black',
    textAlign: 'center',
  },
  addedUsersContainer: {
    marginTop: 10,
    width: '100%',
  },
  addedUser: {
    color: 'white',
    marginBottom: 5,
  },
  inputText: {
    color: 'black',
  },
  descriptionContainer: {
    height: 110
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%', 
    marginTop: 20, 
  },
  iconContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icons: {
    fontSize: 30,
    paddingRight: 10,
    paddingLeft: 5,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default CreateProjectForm;