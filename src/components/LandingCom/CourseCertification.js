import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import certificationImage from '../../assets/Images/certification.png';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Image} from 'react-native';

const CourseCertification = ({certification}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  // console.log("certification", JSON.stringify(certification, null, 1));
  if (certification === '') {
    return;
  }
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionTitle}>{certification?.title}</Text>
      <Text style={styles.certificationText}>{certification?.description}</Text>
      <View style={styles.certificationImageContainer}>
        <Image source={certificationImage} style={styles.image} />
      </View>
    </View>
  );
};

export default CourseCertification;

const getStyles = Colors =>
  StyleSheet.create({
    descriptionContainer: {
      paddingVertical: 25,
      paddingHorizontal: 20,
    },
    descriptionTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      textAlign: 'center',
      marginBottom: 20,
      color: Colors.Heading,
    },
    certificationImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    image: {
      width: '100%',
      height: 300,
      resizeMode: 'contain', //
    },
    certificationText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveFontSize(2),
      lineHeight: 25,
    },
  });
