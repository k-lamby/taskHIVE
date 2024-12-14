//================== BottomBar.js===========================//
import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomBar = ({ navigation, activeScreen }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Summary')}
          style={[styles.iconContainer, activeScreen === 'Summary' && styles.activeIconContainer]}
        >
          <Ionicons 
            name="home-outline" 
            size={24} 
            color={activeScreen === 'Summary' ? '#688e26' : 'rgba(255, 255, 255, 0.7)'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Projects')}
          style={[styles.iconContainer, activeScreen === 'Projects' && styles.activeIconContainer]}
        >
          <Ionicons 
            name="clipboard-outline" 
            size={24} 
            color={activeScreen === 'Projects' ? '#688e26' : 'rgba(255, 255, 255, 0.7)'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('CreateProject')}
          style={[styles.iconContainer, activeScreen === 'CreateProject' && styles.activeIconContainer]}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={24} 
            color={activeScreen === 'CreateProject' ? '#688e26' : 'rgba(255, 255, 255, 0.7)'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Tasks')}
          style={[styles.iconContainer, activeScreen === 'Tasks' && styles.activeIconContainer]}
        >
          <Ionicons 
            name="checkmark-circle-outline" 
            size={24} 
            color={activeScreen === 'Tasks' ? '#688e26' : 'rgba(255, 255, 255, 0.7)'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={[styles.iconContainer, activeScreen === 'Settings' && styles.activeIconContainer]}
        >
          <Ionicons 
            name="person-outline" 
            size={24} 
            color={activeScreen === 'Settings' ? '#688e26' : 'rgba(255, 255, 255, 0.7)'} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#220901',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#220901',
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    borderRadius: 30, // Circle effect
    padding: 10, // Padding for the circle
  },
  activeIconContainer: {
    backgroundColor: 'rgba(104, 142, 38, 0.2)', // Green background for active icon
  },
});

export default BottomBar;