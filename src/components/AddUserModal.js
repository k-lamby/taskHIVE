import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import GlobalStyles from '../styles/styles';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  const [userEmail, setUserEmail] = useState('');

  const handleAddUser = () => {
    if (userEmail.trim() === '') {
      return; // Avoid adding empty email
    }
    
    onUserAdded(prev => [...prev, userEmail]); // Add user to the parent component's state
    setUserEmail(''); // Clear input
    onClose(); // Close modal after adding user
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={GlobalStyles.headerText}>Add Users to Project</Text>
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