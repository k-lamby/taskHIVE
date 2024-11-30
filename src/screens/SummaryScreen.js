// SummaryScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import GlobalStyles from '../styles/styles';

const SummaryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
  style={GlobalStyles.primaryButton} 
  onPress={() => navigation.navigate('CreateProject')}>
  <Text style={GlobalStyles.primaryButtonText}>Create Project</Text>
</TouchableOpacity>
      <Text style={styles.text}>Welcome to the Summary Screen!</Text>
      {/* Add a button to navigate back to Home */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#220901',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
});

export default SummaryScreen;