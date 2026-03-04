import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import MediumPriorityIcon from '../../assets/Icons/MediumPriorityIcon';
import LowPriorityIcon from '../../assets/Icons/LowPriorityIcon';
import HighPriorityIcon from '../../assets/Icons/HighPriorityIcon';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

const Priority = ({priority}) => {
  const {Colors} = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.priorityContainer}>
      <Text
        style={
          priority === 1
            ? styles.lowText
            : priority === 2
            ? styles.mediumText
            : priority === 3
            ? styles.highText
            : styles.text
        }>
        {priority === 1 && 'L-'}
        {priority === 2 && 'M-'}
        {priority === 3 && 'H-'}
      </Text>
      {priority === 1 && <LowPriorityIcon width={14} height={14} />}
      {priority === 2 && <MediumPriorityIcon width={14} height={14} />}
      {priority === 3 && <HighPriorityIcon width={14} height={14} />}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: responsiveScreenHeight(1),
    },
    priorityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
