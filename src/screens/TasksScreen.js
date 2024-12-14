//================== ProjectsScreen.js===========================//
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 

const TasksScreen = ({ navigation }) => {
  return (
    <GradientBackground>
 <View style={styles.container}>
      <TopBar title="Tasks" />
      <View style={styles.content}>
        <Text style={styles.title}>Tasks Page</Text>
      </View>
      <BottomBar navigation={navigation} activeScreen="Tasks" />
    </View>
    </GradientBackground>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default TasksScreen;