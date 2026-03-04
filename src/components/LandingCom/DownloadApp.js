import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import { Image } from "react-native";
import bgImage from "../../assets/Images/downloadLine.png";
import google from "../../assets/Images/googlePlay.png";
import apple from "../../assets/Images/appStore.png";

const DownloadApp = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.contentContainer}>
        <Text style={styles.titleText}>Take Your Education with Our App</Text>
        <Text style={styles.descriptionText}>
          Over 1 lakh+ installs Always stay up to date with faster & easier matchmaking Get 24/7 support and world class user experience
        </Text>
        <Text style={styles.downloadText}>Download Now</Text>
        <View style={styles.downloadContainer}>
          <TouchableOpacity style={styles.googleDownloadImage}>
            <Image style={styles.image} source={google} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.appleDownloadImage}>
            <Image style={styles.image} source={apple} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default DownloadApp;

const getStyles = (Colors) =>
  StyleSheet.create({
    googleDownloadImage: {
      width: "100%",
      height: "100%",
      flex: 0.5,
    },
    appleDownloadImage: {
      flex: 0.5,
      width: "100%",
      height: "100%",
    },
    image: {
      width: "100%",
      height: responsiveHeight(4.5),
      resizeMode: "contain",
    },
    downloadContainer: {
      flexDirection: "row",
      flex: 1,
      // gap: 15,
      marginTop: 20,
    },
    contentContainer: {
      width: "100%",
      height: 350,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    container: {
      backgroundColor: Colors.Primary,
      //   padding: 30,
      borderRadius: 10,
    },
    titleText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3.6),
      textAlign: "center",
    },
    descriptionText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(2),
      textAlign: "center",
      marginTop: 20,
    },
    downloadText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2.5),
      textAlign: "center",
      marginTop: 20,
    },
  });
