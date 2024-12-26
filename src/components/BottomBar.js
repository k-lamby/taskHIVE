//================== BottomBar.js ===========================//
// This is the tool bar at the bottom of the page
// it is displayed throughout the application whenever the user is logged in
//===============================================================//
import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import CreateProjectForm from './CreateProjectForm';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faClipboardCheck, faCirclePlus, faCircleCheck, faUser} from '@fortawesome/free-solid-svg-icons';

const BottomBar = ({ navigation, activeScreen, userId }) => {
  // this stores the state of the modal form for creating a project
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <TouchableOpacity 
            onPress={() => navigation.navigate('Summary')}
            style={[styles.iconContainer, activeScreen === 'Summary' && styles.activeIconContainer]} >
            <FontAwesomeIcon
                icon = {faHouse}
                size = {24}
                style={[styles.icon, activeScreen === 'Summary' && styles.activeIcon]} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Projects')}
          style={[styles.iconContainer, activeScreen === 'Projects' && styles.activeIconContainer]}    >
                <FontAwesomeIcon
            icon = {faClipboardCheck}
            size = {24}
            style={[styles.icon, activeScreen === 'Projects' && styles.activeIcon]} />
         
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setFormVisible(true)}
          style={[styles.iconContainer]}
        >
           <FontAwesomeIcon
            icon = {faCirclePlus}
            size = {24}
            style={[styles.icon]} />
         
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Tasks')}
          style={[styles.iconContainer, activeScreen === 'Tasks' && styles.activeIconContainer]}
        >
           <FontAwesomeIcon
            icon = {faCircleCheck}
            size = {24}
            style={[styles.icon, activeScreen === 'Tasks' && styles.activeIcon]} />
         
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={[styles.iconContainer, activeScreen === 'Settings' && styles.activeIconContainer]}
        >
           <FontAwesomeIcon
            icon = {faUser}
            size = {24}
            style={[styles.icon, activeScreen === 'Settings' && styles.activeIcon]} />
       
        </TouchableOpacity>
        <CreateProjectForm 
        visible={isFormVisible} 
        onClose={() => setFormVisible(false)} 
        userId={userId}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // make sure we arent overlapping any graphics at the bottom of the screen
  safeArea: {
    backgroundColor: '#220901',
    width: '100%',
  },
  // contents to be aligned vertically
  // spaced evenly across the bottom of the page
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#220901',
    paddingVertical: 10,
  },
  // then create a transparent container for the icon to go in
  // adds contrast
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30, 
    padding: 10, 
  },
  // then set the default icon style
  icon: {
    fontSize: 60,
    color: 'white'
  },
  // if the active screen corresponds to the container then we want to make sure
  // this is communicated back to the user
  activeIconContainer: {
    backgroundColor: 'rgba(104, 142, 38, 0.2)',
  },
  activeIcon: {
    fontSize: 40,
    color: 'rgba(104, 142, 38, 1)',

  },
});

export default BottomBar;