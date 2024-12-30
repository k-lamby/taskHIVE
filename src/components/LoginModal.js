//================== LoginModal.js===========================//
// This is the pop up box to handle logging the user in
//===========================================================//

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import GlobalStyles from '../styles/styles';
import { logIn } from '../services/authService';
import { useUser } from '../contexts/UserContext';

const LoginModal = ({ visible, onClose, navigation }) => {
  // set up various states for grabbing the login details
  const usernameInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId } = useUser();
  const { setUserEmail } = useUser();

  useEffect(() => {
    if (visible) {
      // When opening the modal, start with cursor in the email box
      // add a short delay to ensure the component is rendered before
      //focusing
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // handle the login functionality
  const handleLogin = async () => {
    try {
      // call login from the auth service passing it the inputs
      // wait for the response
      const userId = await logIn(email, password);
      // set the user information
      setUserId(userId.uid);
      setUserEmail(userId.email);
      // close the modal after login
      onClose(); 
      // then navigate to the summary page
      navigation.navigate('Summary');
    } catch (error) {
      // if there is error with the login just display an alert for now
      Alert.alert("Login Error", error.message);
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
        onPressOut={onClose}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={GlobalStyles.headerText}>Login</Text>
            <TextInput 
              ref={usernameInputRef}
              style={GlobalStyles.textInput} 
              placeholder="Email" 
              placeholderTextColor="#ffffff" 
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email input"
              accessibilityHint="Enter your email"
            />
            <TextInput 
              style={GlobalStyles.textInput} 
              placeholder="Password" 
              placeholderTextColor="#ffffff" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
            />
            <TouchableOpacity 
              style={GlobalStyles.primaryButton} 
              onPress={handleLogin}
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