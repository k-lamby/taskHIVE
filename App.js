import 'react-native-gesture-handler';
import React, { useEffect } from 'react'; // Added useEffect import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SignupScreen from './src/screens/SignupScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import ProjectsScreen from './src/screens/ProjectsScreen'; 
import TasksScreen from './src/screens/TasksScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { UserProvider, useUser } from './src/contexts/UserContext'; // Ensure UserContext is updated
import { requestUserPermission, getFCMToken, handleForegroundMessages } from './src/services/firebaseService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Akzidenz-grotesk-bold': require('./assets/fonts/Akzidenz-grotesk-bold.ttf'),
    'Akzidenz-grotesk-light': require('./assets/fonts/Akzidenz-grotesk-light.ttf'),
  });
  
  // Here we handle grabbing the FCM tokens
  useEffect(() => {
    const initializeFCM = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        const { user } = useContext(UserContext); // Access the user directly from the context
        if (user?.id) {
          await getFCMToken(user.id); // Use user.id instead of useUser()
        } else {
          Alert.alert('User ID not found');
        }
        handleForegroundMessages();
      }
    };
  
    initializeFCM();
  }, []);

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
          <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Tasks" component={TasksScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}