import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import HorizontalLine from '../../constants/HorizontalLine';

const FinanceOption = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Finance Option</Text>
      <HorizontalLine width="70%" />
      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Climb Credit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Stride Flexible Student Loans</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionTitle}>States Funding</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Self Funding</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinanceOption;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      paddingVertical: 30,
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
      textAlign: 'center',
    },
    optionTitle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
      color: Colors.Heading,
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.PureWhite,
      borderRadius: 10,
      padding: 15,
      marginTop: 10,
    },
  });
