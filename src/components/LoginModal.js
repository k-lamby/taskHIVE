//================== LoginModal.js===========================//
// This is the pop-up box to handle logging the user in
//===========================================================//

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import GlobalStyles from '../styles/styles';
import { logIn } from '../services/authService';
import { useUser } from '../contexts/UserContext';

const LoginModal = ({ visible, onClose, navigation }) => {
  // Set up states for capturing login details
  const usernameInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId, setUserEmail, setFirstName } = useUser();

  useEffect(() => {
    if (visible) {
      // Auto-focus email input when modal opens
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // Handle login functionality
  const handleLogin = async () => {
    try {
      const userId = await logIn(email, password);
      setUserId(userId.uid);
      setUserEmail(userId.email);
      setFirstName(userId.displayName);
      onClose(); // Close the modal after login
      navigation.navigate('Summary');
    } catch (error) {
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
              placeholderTextColor="rgba(255, 255, 255, 0.7)" 
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email input"
              accessibilityHint="Enter your email"
            />
            
            {/* Spacing between inputs */}
            <View style={styles.inputSpacing} />

            <TextInput 
              style={GlobalStyles.textInput} 
              placeholder="Password" 
              placeholderTextColor="rgba(255, 255, 255, 0.7)" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
            />
            
            <TouchableOpacity 
              style={GlobalStyles.standardButton} 
              onPress={handleLogin}
              accessibilityLabel="Login button"
              accessibilityHint="Tap to log in"
            >
              <Text style={GlobalStyles.standardButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Close Button - Underlined White Text */}
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

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    paddingTop: '45%',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#001524',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  inputSpacing: {
    height: 15, // Adds spacing between email and password inputs
  },
  closeButton: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginModal;