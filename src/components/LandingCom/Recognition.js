import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import recognitionImage from "../../assets/Images/recognition.png";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";

const Recognition = ({ recognition }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    recognition && (
      <View style={styles.container}>
        <Text style={styles.titleText}>Recognition of Schools</Text>
        <Text style={styles.descriptionText}>
          Take one of Schools Hub’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax
          and readability makes Python perfect for Flask, Django, data science, and machine learning. You’ll learn how to build everything
          from games to sites to apps. Choose from a range of courses that will appeal to Take one of Schools Hub’s range of Python courses
          and learn how to code using this incredibly useful language
        </Text>
        <View style={styles.imageContainer}>
          <Image source={recognitionImage} style={styles.image} />
        </View>
      </View>
    )
  );
};

export default Recognition;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 20,
      flex: 1,
      paddingVertical: 25,
    },
    titleText: {
      fontSize: responsiveFontSize(3),
      fontFamily: CustomFonts.SEMI_BOLD,
      textAlign: "center",
      color: Colors.Heading,
    },
    descriptionText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(2),
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
