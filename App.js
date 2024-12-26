import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import TasksScreen from './src/screens/TasksScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen'; // Import the new screen
import { UserProvider } from './src/contexts/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Akzidenz-grotesk-bold': require('./assets/fonts/Akzidenz-grotesk-bold.ttf'),
    'Akzidenz-grotesk-light': require('./assets/fonts/Akzidenz-grotesk-light.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  
  return (
    <NavigationContainer>
      <UserProvider>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Summary" component={SummaryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Tasks" component={TasksScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}