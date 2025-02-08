//================== BottomBar.js ===========================//
// This is the tool bar at the bottom of the page
// it is displayed throughout the application whenever the user is logged in
//===============================================================//
import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faClipboardCheck, faCirclePlus, faCircleCheck, faUser} from '@fortawesome/free-solid-svg-icons';

import CreateProjectModal from './CreateProjectModal';

const BottomBar = ({ navigation, activeScreen, userId }) => {
  // this stores the visibility of the add project form
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    //make sure this is rendered within the viewable area of the device
    <SafeAreaView style={styles.safeArea}>
      <View>
      {/* Create project modal attached to the bottom bar */}
      <CreateProjectModal 
        visible={isFormVisible} 
        onClose={() => setFormVisible(false)} 
        userId={userId}
      />
      </View>
      {/* For each icon we check to see if its associated with the current page
      this then displays it a different colour to help with navigation around the application */}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // make sure we arent overlapping any graphics at the bottom of the screen
  safeArea: {
    backgroundColor: '#001524',
    width: '100%',
  },
  // contents to be aligned vertically
  // spaced evenly across the bottom of the page
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#001524',
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
    backgroundColor: 'rgba(255, 125, 0, 0.2)',
  },
  activeIcon: {
    fontSize: 40,
    color: 'rgba(255, 125, 0, 1)',

  },
});

export default BottomBar;