import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import MentorCard from './MentorCard';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import HorizontalLine from '../../constants/HorizontalLine';

const ClassDeliveryBy = ({instructurs}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    instructurs && (
      <View style={styles.container}>
        <Text style={styles.titleText}>Class Delivery By</Text>
        <HorizontalLine width="70%" />
        <MentorCard />
        <MentorCard />
      </View>
    )
  );
};

export default ClassDeliveryBy;

const getStyles = Colors =>
  StyleSheet.create({
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      textAlign: 'center',
      color: Colors.Heading,
    },
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
    },
  });
