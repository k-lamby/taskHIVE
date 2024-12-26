//================== CreateProjectForm.js ===========================//
// This is a tray that pops up from the bottom of the bar and allows the
// user to create a project. It is a reusable component, as while it is
// attached to the bottom bar, it can be pulled up from elsewhere in 
// the application
//===============================================================//
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { createProject } from '../services/projectService'; //firestore logic handled seperately

// get the height of the window. This is to make sure this doesnt cover the bottom bar.
const { height } = Dimensions.get('window');

const CreateProjectForm = ({ visible, onClose, userId }) => {
  // create states for grabbing the information from the form
  const [projectName, setProjectName] = useState('');
  const [sharedWith, setSharedWith] = useState('');
  const [dueDate, setDueDate] = useState('');

  // async function, so the user can continue to navigate around the app
  // while this runs
  const handleCreateProject = async () => {
    try {
      // call the create project function, sharing with it the form data
      await createProject(projectName, sharedWith, userId, dueDate);
      setProjectName('');
      setSharedWith('');
      setDueDate('');
      // the modal form pops up, so after we have grabbed the information
      // close it back in the tray.
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Modal
    transparent={true}
    visible={visible}
    animationType="slide"
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Create Project</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Shared With (comma-separated emails)"
            value={sharedWith}
            onChangeText={setSharedWith}
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <Button title="Create Project" onPress={handleCreateProject} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened background
    justifyContent: 'flex-end', // Align modal to the bottom
    alignContent: 'center'
  },
  modalContainer: {
    height: height * 0.8, // 90% of screen height
    width: '90%',
    backgroundColor: '#e87722', // Form color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0, // Align to the bottom of the view
    left: 0,
    right: 0,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default CreateProjectForm;