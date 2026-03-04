import React from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {TColors} from '../types';

const TopContainer = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const navigation = useNavigation();
  return (
    <View style={styles.topArrowContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color={Colors.BodyText} />
      </TouchableOpacity>
      <Text style={styles.topText}>Back</Text>
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    topText: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
  });

export default TopContainer;
