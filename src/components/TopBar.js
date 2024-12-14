//================== TopBar.js===========================//
// This is a reusable component for the top of the screen
// takes a title argument
//========================================================//

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import GlobalStyles from '../styles/styles';

const TopBar = ({ title }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Text style={GlobalStyles.primaryButtonText}>{title}</Text>
        </View>
    </SafeAreaView>
  );
};

// this page specific styles
const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#220901',
        width: '100%'
        },
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'left',
        justifyContent: 'center',
    }
});

export default TopBar;