import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import mentorImage from '../../assets/Images/mentor.png';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Images from '../../constants/Images';

const MentorCard = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            // mentorImage && mentorImage !== ""
            //   ? { uri: mentorImage }
            //   : Images.DEFAULT_IMAGE ||
            Images.DEFAULT_IMAGE
          }
        />
      </View>
      <Text style={styles.cardTitle}>Mentor</Text>
      <View style={styles.nameContainer}>
        <Text style={styles.mentorName}>Md Shiblu Ahmad </Text>
        <Text style={styles.mentorDesignation}>Software Engineer</Text>
      </View>
    </View>
  );
};

export default MentorCard;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      flex: 1,
    },
    imageContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: undefined,
      aspectRatio: 1.27,
      resizeMode: 'contain',
    },
    cardTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2.5),
      marginTop: 20,
      marginBottom: 10,
      color: Colors.Heading,
    },
    mentorName: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
    },
    mentorDesignation: {
      fontSize: responsiveFontSize(1.5),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
    },
  });
