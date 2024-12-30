import { StyleSheet, ImageBackground  } from 'react-native';


const GlobalStyles = StyleSheet.create({
// Login and sign up page specific styles
  fullPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    paddingTop: 60,
    paddingLeft: 40,
    paddingRight: 40
  },
  logo: {
    width: 130,
    height: 120,
    marginBottom: 10
  },
  logoText: {
    color: '#ffffff',
    fontSize:90,
    fontFamily: 'Akzidenz-grotesk-light', 
    padding: 0,
    margin: 0
  },
  // ===== REUSABLE TEXT STYLES ===== //
  // used for page headers
  headerText: {
    color: '#ffffff',
    fontSize:22,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  // sub title text
  subheaderText: {
    color: '#ffffff',
    fontSize:18,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  // normal fonts
  normalText: {
    color: '#ffffff',
    fontSize:16,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  // translucent normal text for inputs etc
  translucentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize:16,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  bulletStyle: {
    color: '#688e26',
    fontSize:24,
  },
  buttonContainer: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    width: '60%',
    padding: 15, 
    backgroundColor: '#688e26',
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  secondaryButton: {
    width: '60%',
    padding: 15, 
    backgroundColor: '#Bc3908', 
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Akzidenz-grotesk-light', 
  },
  inputContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginBottom: 10,
      padding: 10,
      borderRadius: 20,
      width: '100%',
      justifyContent: 'flex-start'
  },
  textInput: {
    width: '90%',
    padding: 15, 
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  label: {
    alignSelf:'flex-start'
  },
  gradientContainer: {
    flex: 1,
  },
});

export default GlobalStyles;