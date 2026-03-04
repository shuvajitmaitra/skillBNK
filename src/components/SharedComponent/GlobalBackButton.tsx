import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const GlobalBackButton = ({containerStyle}: {containerStyle?: any}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.backButton, containerStyle]}>
      <ArrowLeft />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
  );
};

export default GlobalBackButton;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    backText: {
      color: Colors.BodyText,
      fontWeight: '600',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginLeft: 20,
      // backgroundColor: 'red',
      width: responsiveScreenWidth(25),
    },
  });
