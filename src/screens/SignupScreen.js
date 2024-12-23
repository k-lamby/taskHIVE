import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import GlobalStyles from '../styles/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { signUp } from '../services/authService';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Validate input
    if (!email || !password || password !== confirmPassword) {
      Alert.alert("Error", "Please fill in all fields correctly.");
      return;
    }

    try {
      const user = await signUp(email, password);
      console.log("User signed up:", user);
      // Navigate to another screen after successful signup
      navigation.navigate('Home'); // Change 'Home' to the appropriate screen name
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <LinearGradient 
      colors={['#220901', '#Bc3908']} 
      style={GlobalStyles.gradientContainer}
      start={{ x: 0, y: 0 }}  
      end={{ x: 1, y: 0 }}
    >
      <ImageBackground 
        source={require('../../assets/images/beeHive.png')} // Update the path as necessary
        style={GlobalStyles.gradientContainer}
        resizeMode="cover"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={GlobalStyles.container}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={[GlobalStyles.logo, { width: 70, height: 60 }]} // Smaller logo
              />
              <View style={styles.textContainer}>
                <Text style={[GlobalStyles.logoText, { fontSize: 24 }]}>task</Text>
                <Text style={[GlobalStyles.logoText, { fontSize: 24 }]}>HIVE</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              <TextInput 
                style={GlobalStyles.textInput} 
                placeholder="Full Name" 
                placeholderTextColor="#ffffff" 
                value={name}
                onChangeText={setName}
              />
              <TextInput 
                style={GlobalStyles.textInput} 
                placeholder="Email" 
                placeholderTextColor="#ffffff" 
                value={email}
                onChangeText={setEmail}
              />
              <TextInput 
                style={GlobalStyles.textInput} 
                placeholder="Password" 
                placeholderTextColor="#ffffff" 
                secureTextEntry 
                value={password}
                onChangeText={setPassword}
              />
              <TextInput 
                style={GlobalStyles.textInput} 
                placeholder="Confirm Password" 
                placeholderTextColor="#ffffff" 
                secureTextEntry 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity 
                style={GlobalStyles.primaryButton} 
                onPress={handleSignUp}
              >
                <Text style={GlobalStyles.primaryButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={GlobalStyles.secondaryButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={GlobalStyles.secondaryButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </LinearGradient>
  );
};

const styles = {
  logoContainer: {
    width: '100%',
    paddingLeft: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10, // Add some space between the logo and the text
  },
  formContainer: {
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
  },
};

export default SignupScreen;