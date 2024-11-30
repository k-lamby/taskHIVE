// SummaryScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Summary Screen</Text>
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