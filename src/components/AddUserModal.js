import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import GlobalStyles from '../styles/styles';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userList] = useState(['user@example.com', 'test@example.com', 'alice@example.com', 'bob@example.com']); // Example users
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleAddUser = () => {
    if (userEmail.trim() === '') {
      return; // Avoid adding empty email
    }
    
    onUserAdded(prev => [...prev, userEmail]); // Add user to the parent component's state
    setUserEmail(''); // Clear input
    onClose(); // Close modal after adding user
  };

  const handleSearch = (email) => {
    setUserEmail(email);
    const filtered = userList.filter(user => user.includes(email));
    setFilteredUsers(filtered);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add Users to Project</Text>
            <TextInput
              style={GlobalStyles.inputContainer}
              placeholder="Search Users by Email"
              value={userEmail}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
              <Text style={GlobalStyles.primaryButtonText}>Add User</Text>
            </TouchableOpacity>
            <View style={styles.userList}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <Text key={index} style={styles.user}>{user}</Text>
                ))
              ) : (
                <Text style={styles.noUserText}>No users found</Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={GlobalStyles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: '#e87722',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userList: {
    marginTop: 10,
    maxHeight: 150,
    overflow: 'scroll',
  },
  user: {
    color: 'white',
    padding: 10,
  },
  noUserText: {
    color: 'white',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50', // Example color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#f44336', // Example color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default AddUserModal;