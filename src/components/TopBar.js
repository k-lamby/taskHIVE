//================== TopBar.js ===========================//
// This is a reusable component for the top of the screen
// It takes a `title` prop and displays it at the top
// Includes a small bee logo for the app
//========================================================//

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import GlobalStyles from '../styles/styles';

// Importing the logo from the assets folder
const logo = require('../../assets/images/logo.png');

const TopBar = ({ title }) => {
  return (
    // using safearea as we know each mobile we have a different layout at the top
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        {/* Title text will be passed when rendering the component */}
        <Text style={GlobalStyles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

//========== Styles specific for the TopBar ===============//
const styles = StyleSheet.create({
  // specifiy the colour for the top bar safe area
  // to be the same as the container so it blends together
  safeArea: {
    backgroundColor: '#001524',
    width: '100%',
  },
  // flex it in the row direction, so containers are inline
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  // format the logo to be small and inline with title text
  logo: {
    width: 35, 
    height: 35,
    marginRight: 10,
  },
});

export default TopBar;