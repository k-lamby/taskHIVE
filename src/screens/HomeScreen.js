//================== HomeScreen.js===============================//
// This is the first page displayed to the user; it has the logo,
// application tagline, and buttons to either log in or sign up.
//===============================================================//

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import GlobalStyles from "../styles/styles";
import LoginModal from "../components/LoginModal"; 
import GradientBackground from "../components/GradientBackground"; 

const HomeScreen = ({ navigation }) => {
  // Control whether the login modal is visible or not
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <GradientBackground>
      <View style={GlobalStyles.fullPageContainer}>
        {/* Logo and Branding */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={GlobalStyles.logo}
        />
        <Text style={GlobalStyles.logoText}>task</Text>
        <Text style={GlobalStyles.logoText}>HIVE</Text>
        <Text style={GlobalStyles.subheaderText}>
          Transform Chaos Into Clarity
        </Text>

        {/* Page-Specific Button Container */}
        <View style={styles.buttonContainer}>
          {/* Log In Button (Modal) */}
          <TouchableOpacity
            style={[GlobalStyles.standardButton, styles.equalWidthButton]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={GlobalStyles.standardButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Sign Up Button (Navigates to Signup Page) */}
          <TouchableOpacity
            style={[GlobalStyles.secondaryButton, styles.equalWidthButton]}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={GlobalStyles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Modal (Visibility controlled by state) */}
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </GradientBackground>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  equalWidthButton: {
    width: "50%", // Ensures both buttons have the same width
  },
});

export default HomeScreen;