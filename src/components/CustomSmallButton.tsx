import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

type CustomSmallButtonType = {
  textColor?: string;
  backgroundColor?: string;
  buttonText: string;
  toggleModal?: () => void;
  containerStyle?: ViewStyle;
};
const CustomSmallButton = ({
  textColor,
  backgroundColor,
  buttonText,
  toggleModal,
  containerStyle,
}: CustomSmallButtonType) => {
  return (
    <TouchableOpacity
      onPress={toggleModal}
      style={[
        styles.button,
        {backgroundColor: backgroundColor, ...containerStyle},
      ]}>
      <Text style={[styles.buttonText, {color: textColor}]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default CustomSmallButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#27ac1f',
    minWidth: responsiveScreenWidth(15),
    alignItems: 'center',
    borderRadius: 10,
    padding: responsiveScreenWidth(2),
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveScreenFontSize(2.2),
  },
});
