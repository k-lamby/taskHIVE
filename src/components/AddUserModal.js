import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import GlobalStyles from '../styles/styles';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  const [userEmail, setUserEmail] = useState('');

  const handleAddUser = () => {
    // Validate email input
    if (!userEmail.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return; // Prevent adding an empty or invalid email
    }

    // Log the email for debugging
    console.log('Adding user:', userEmail);

    // Pass the email to the parent callback
    onUserAdded(userEmail.trim());

    // Reset the input field and close the modal
    setUserEmail('');
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={GlobalStyles.headerText}>Add User</Text>
            <TextInput
              style={GlobalStyles.inputContainer}
              placeholder="Enter User Email"
              value={userEmail}
              onChangeText={setUserEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleAddUser} style={GlobalStyles.smallPrimaryButton}>
                <Text style={GlobalStyles.smallButtonText}>Add User</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={GlobalStyles.smallSecondaryButton}>
                <Text style={GlobalStyles.smallButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#220901',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default AddUserModal;