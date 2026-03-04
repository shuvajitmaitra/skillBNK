import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import salaryImage from "../../assets/Images/partnership.png";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";

const PartnershipOfSchool = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Partnership of Schools</Text>
      <Text style={styles.descriptionText}>
        Take one of Schools Hub’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax and
        readability makes Python perfect for Flask, Django, data science, and machine learning.
      </Text>
      <View style={styles.imageContainer}>
        <Image source={salaryImage} style={styles.image} />
      </View>
    </View>
  );
};

export default PartnershipOfSchool;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      backgroundColor: Colors.PureWhite,
      marginHorizontal: -20,
      padding: 20,
    },
    titleText: {
      fontSize: responsiveFontSize(3),
      fontFamily: CustomFonts.SEMI_BOLD,
      textAlign: "center",
      color: Colors.Heading,
    },
    descriptionText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(1.6),
      lineHeight: responsiveHeight(3),
      textAlign: "center",
      marginVertical: 20,
      color: Colors.BodyText,
    },
    imageContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: undefined,
      aspectRatio: 1,
      resizeMode: "contain",
    },
  });
