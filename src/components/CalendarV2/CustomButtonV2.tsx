import {
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
import CustomFonts from '../../constants/CustomFonts';
type CustomButtonProps = {
  textColor: string;
  backgroundColor: string;
  buttonText: string;
  toggleModal: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};
const CustomButton = ({
  textColor,
  backgroundColor,
  buttonText,
  toggleModal,
  containerStyle,
  textStyle,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={toggleModal}
      style={[
        styles.button,
        {backgroundColor: backgroundColor, ...containerStyle},
      ]}>
      <Text style={[styles.buttonText, {color: textColor, ...textStyle}]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#27ac1f',
    minWidth: responsiveScreenWidth(35),
    alignItems: 'center',
    borderRadius: 10,
    padding: responsiveScreenWidth(3),
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: CustomFonts.MEDIUM,
  },
});
