//================== HomeScreen.js===============================//
// This is the first page displayed to the user; it has the logo,
// application tagline, and buttons to either log in or sign up.
//===============================================================//

import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import GlobalStyles from '../styles/styles';
import { LinearGradient } from 'expo-linear-gradient';
import LoginModal from '../components/LoginModal'; //

const HomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
  return (
    <LinearGradient 
    colors={['#220901', '#Bc3908']} 
    style={GlobalStyles.gradientContainer}
    start={{ x: 0, y: 0 }}  
    end={{ x: 1, y: 0 }}>
    <ImageBackground 
    source={require('../../assets/images/beeHive.png')} // Update the path as necessary
    style={GlobalStyles.gradientContainer}
    resizeMode="cover" >
      

    <View style={GlobalStyles.fullPageContainer}>
        <Image source={require('../../assets/images/logo.png')} style={GlobalStyles.logo} />
        <Text style={GlobalStyles.logoText}>task</Text>
        <Text style={GlobalStyles.logoText}>HIVE</Text>
        <Text style={GlobalStyles.subheaderText}>Transform Chaos Into Clarity</Text>
        <View style={GlobalStyles.buttonContainer}>
            <TouchableOpacity 
                style={GlobalStyles.primaryButton} 
                onPress={() => setModalVisible(true)}>
                <Text style={GlobalStyles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={GlobalStyles.secondaryButton}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={GlobalStyles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
      </View>


      <LoginModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)}
        />

</ImageBackground>
</LinearGradient>
     
  );
};

export default HomeScreen;