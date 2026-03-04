import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Marquee from './Marquee';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const AlumniCom = ({images}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    images.length > 0 && (
      <View style={styles.alumniContainer}>
        <Text style={styles.alumniTitleText}>Where Our Alumni Works</Text>
        <View style={styles.horizontalLine} />
        <Marquee images={images} />
      </View>
    )
  );
};

export default AlumniCom;

const getStyles = Colors =>
  StyleSheet.create({
    horizontalLine: {
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BodyTextOpacity,
      marginVertical: 20,
    },
    alumniTitleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
      marginBottom: 10,
      textAlign: 'center',
    },
    alumniContainer: {
      backgroundColor: Colors.Foreground,
      paddingVertical: 25,
      // backgroundColor: "green",
    },
  });
