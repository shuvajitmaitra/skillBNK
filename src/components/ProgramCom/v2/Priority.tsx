import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import LowPriorityIcon from '../../../assets/Icons/LowPriorityIcon';
import MediumPriorityIcon from '../../../assets/Icons/MediumPriorityIcon';
import HighPriorityIcon from '../../../assets/Icons/HighPriorityIcon';
import CustomFonts from '../../../constants/CustomFonts';

const Priority = ({priority}: {priority: number}) => {
  const styles = getStyles();

  return (
    <View style={styles.priorityContainer}>
      <Text
        style={
          priority === 0
            ? styles.lowText
            : priority === 2
            ? styles.mediumText
            : priority === 3
            ? styles.highText
            : styles.text
        }>
        {priority === 0 && 'L-'}
        {priority === 2 && 'M-'}
        {priority === 3 && 'H-'}
      </Text>
      {priority === 0 && <LowPriorityIcon />}
      {priority === 2 && <MediumPriorityIcon />}
      {priority === 3 && <HighPriorityIcon />}
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    text: {},
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginTop: responsiveScreenHeight(),
    },
    priorityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      marginTop: responsiveScreenHeight(0.3),
    },
    highText: {
      color: '#F34141',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
    mediumText: {
      color: '#FFA500',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
    lowText: {
      color: '#27AC1F',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
  });

export default Priority;
