import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import GlobalStyles from '../styles/styles';
import { signIn } from '../config/firebaseConfig'; // Import the signIn function

const LoginModal = ({ visible, onClose, navigation }) => {
  const usernameInputRef = useRef(null); // Reference for the username input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (visible) {
      // Focus the username input when the modal is visible
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100); // Delay to ensure the modal is fully rendered
    }
  }, [visible]);

  const handleLogin = async () => {
    try {
      await signIn(email, password); // Attempt to sign in
      console.log("User logged in:", email);
      onClose(); // Close modal after login
      navigation.navigate('Summary'); // Navigate to the Summary screen
    } catch (error) {
      Alert.alert("Login Error", error.message); // Show error if login fails
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={1} 
        onPressOut={onClose} // Close modal on outside press
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={GlobalStyles.headerText}>Login</Text>
            <TextInput 
              ref={usernameInputRef} // Set the reference for the username input
              style={GlobalStyles.textInput} 
              placeholder="Email" 
              placeholderTextColor="#ffffff" 
              value={email}
              onChangeText={setEmail} // Handle email input
              accessibilityLabel="Email input"
              accessibilityHint="Enter your email"
            />
            <TextInput 
              style={GlobalStyles.textInput} 
              placeholder="Password" 
              placeholderTextColor="#ffffff" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword} // Handle password input
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
            />
            <TouchableOpacity 
              style={GlobalStyles.primaryButton} 
              onPress={handleLogin} // Call handleLogin on press
              accessibilityLabel="Login button"
              accessibilityHint="Tap to log in"
            >
              <Text style={GlobalStyles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onClose}
              accessibilityLabel="Close button"
              accessibilityHint="Tap to close the login modal"
            >
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top', // Center the modal container
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    paddingTop: '45%'
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#220901',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    color: '#ffffff',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
});

export default LoginModal;