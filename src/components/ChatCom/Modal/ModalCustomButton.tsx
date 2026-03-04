import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';

import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';

interface IProps {
  textColor: string;
  backgroundColor: string;
  buttonText: string;
  toggleModal: () => void;
  customTextStyle?: StyleProp<TextStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
}

export default function ModalCustomButton({
  textColor,
  backgroundColor,
  buttonText,
  toggleModal,
  customTextStyle,
  customContainerStyle,
  disable,
}: IProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      disabled={disable || false}
      onPress={toggleModal}
      style={[
        styles.button,
        {backgroundColor: backgroundColor},
        customContainerStyle,
      ]}
      activeOpacity={0.7}>
      <Text style={[styles.buttonText, {color: textColor}, customTextStyle]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    button: {
      flex: 1,
      backgroundColor: Colors.Primary,
      minWidth: responsiveScreenWidth(35),
      alignItems: 'center',
      borderRadius: 10,
      padding: responsiveScreenWidth(2.5),
    },
    buttonText: {
      color: Colors.Foreground,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
    },
  });
