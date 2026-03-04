import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import salaryImage from "../../assets/Images/salaryRole.png";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";

const SalaryRole = ({ salary }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    salary && (
      <View style={styles.container}>
        <Text style={styles.titleText}>{salary?.title}</Text>
        <Text style={styles.descriptionText}>{salary?.description}</Text>
        <View style={styles.imageContainer}>
          <Image source={salaryImage} style={styles.image} />
        </View>
      </View>
    )
  );
};

export default SalaryRole;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
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
      overflow: "hidden",
      borderRadius: 12,
    },
    image: {
      width: "100%",
      height: undefined,
      aspectRatio: 0.986,
      resizeMode: "contain",
    },
  });
