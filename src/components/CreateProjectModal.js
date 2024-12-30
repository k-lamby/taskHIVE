import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Dimensions, 
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { createProject } from '../services/projectService';
import GlobalStyles from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddUserModal from './AddUserModal';
import { useUser } from '../contexts/UserContext';
import CustomDatePicker from './CustomDatePicker'; // Import your new component

// Get the height and width of the window
const { height, width } = Dimensions.get('window');

const CreateProjectForm = ({ visible, onClose }) => {
  const { userId } = useUser();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [addedUsers, setAddedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  const handleCreateProject = async () => {
    const sharedWithEmails = addedUsers.join(',');

    try {
      await createProject(projectName, sharedWithEmails, dueDate.toISOString(), userId);
      setProjectName('');
      setProjectDescription('');
      setDueDate(new Date());
      setAddedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View 
            style={styles.modalContainer}
            {...panResponder.panHandlers}
          >
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>Create New Project</Text>
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalText]}
              placeholder="Project Name"
              placeholderTextColor={GlobalStyles.translucentText.color}
              value={projectName}
              onChangeText={setProjectName}
              required
            />
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalText, styles.descriptionBox]}
              placeholder="Project Description"
              placeholderTextColor={GlobalStyles.translucentText.color}
              multiline={true}
              value={projectDescription}
              onChangeText={setProjectDescription}
              required
            />
            <TouchableOpacity 
              style={GlobalStyles.inputContainer} 
              onPress={() => setShowDatePicker(true)} // Show date picker on press
            >
              <Text style={{ color: 'black' }}>
                {dueDate.toDateString()}
              </Text>
            </TouchableOpacity>

            <View style={styles.addedUsersContainer}>
              {addedUsers.map((user, index) => (
                <Text key={index} style={styles.addedUser}>{user}</Text>
              ))}
            </View>
            <TouchableOpacity
              style={GlobalStyles.primaryButton}
              onPress={handleCreateProject}>
              <Text style={GlobalStyles.primaryButtonText}>Create Project</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.secondaryButton}
              onPress={onClose}>
              <Text style={GlobalStyles.primaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <Icon name="paperclip" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <Icon name="image" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <Icon name="comment" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              <TouchableOpacity onPress={() => setShowUserModal(true)}>
                <Icon name="user-plus" style={styles.icons} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <AddUserModal 
        visible={showUserModal} 
        onClose={() => setShowUserModal(false)} 
        onUserAdded={setAddedUsers} 
      />
      {/* Include the Custom Date Picker */}
      <CustomDatePicker 
        visible={showDatePicker} 
        onClose={() => setShowDatePicker(false)} 
        onDateChange={setDueDate} 
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
    justifyContent: 'flex-start'
  },
  modalHeader: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  descriptionBox: {
    height: 110,
  },
  addedUsersContainer: {
    marginTop: 10,
    width: '100%',
  },
  addedUser: {
    color: 'white',
    marginBottom: 5,
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