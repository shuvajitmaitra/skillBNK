import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import CustomFonts from '../../../constants/CustomFonts';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';

export default function ModalBackAndCrossButton({
  toggleModal = () => {},
  containerStyle = {},
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={[styles.topBarContainer, {...containerStyle}]}>
      <TouchableOpacity onPress={toggleModal} style={styles.modalArrowIcon}>
        <ArrowLeft />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
        <CrossIcon color="white" />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '100%',
      paddingBottom: responsiveScreenHeight(1.5),
      borderBottomWidth: 1,
      borderColor: Colors.LineColor,
    },
    modalArrowIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      color: 'rgba(71, 71, 72, 1)',
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.Red,
      padding: responsiveScreenWidth(2.2),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
