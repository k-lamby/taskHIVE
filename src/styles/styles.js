import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  // ===== MAIN BACKGROUND CONTAINER ===== //
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#15616d", // Main background color for all screens
  },

  // ===== GENERAL PAGE STYLES ===== //
  fullPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 40,
  },

  // ===== LOGO STYLES ===== //
  logo: {
    width: 130,
    height: 120,
    marginBottom: 10,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 90,
    fontFamily: 'Akzidenz-grotesk-light',
  },

  // ===== REUSABLE TEXT STYLES ===== //
  headerText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  subheaderText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  normalText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  normalTextBlack: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  translucentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  bulletPoint: {
    color: "#32CD32", // Bright lime green
    fontSize: 20,
    marginRight: 8,
  },

  // ===== FLEXIBLE BUTTON STYLES ===== //
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#78290f',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  standardButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },

  // ===== SECONDARY BUTTON STYLES ===== //
  secondaryButton: {
    backgroundColor: '#869ba1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },

  // ===== SMALL BUTTON STYLES ===== //
  smallButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  smallPrimaryButton: {
    backgroundColor: '#Bc3908',
  },
  smallSecondaryButton: {
    backgroundColor: '#688e26',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },

  // ===== INPUT STYLES ===== //
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'flex-start',
  },
  textInput: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  label: {
    alignSelf: 'flex-start',
  },

  // ===== GRADIENT CONTAINER ===== //
  gradientContainer: {
    flex: 1,
  },

  // ===== TRANSPARENT CONTAINER (REUSABLE) ===== //
transparentContainer: {
  backgroundColor: "rgba(34, 9, 1, 0.5)", 
  padding: 15,
  borderRadius: 8,
  marginTop: 20,
  marginLeft: 20,
  marginRight: 20
},
});

export default GlobalStyles;