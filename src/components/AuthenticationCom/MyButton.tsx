import React from 'react';
import {Text, TouchableOpacity, StyleSheet, DimensionValue} from 'react-native';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const MyButton = ({
  bg = 'red',
  colour = 'white',
  onPress = () => {},
  title = 'No Title',
  width = '48%',
  activeOpacity = 0.5,
  height = 48,
  borderRadius = 10,
  fontSize = responsiveScreenFontSize(2),
  flex = 1,
  disable = false,
  borderWidth = 1,
  containerStyle = {},
  textStyle = {},
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      style={{
        flex: flex,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius,
        flexDirection: 'row',
        backgroundColor: bg,
        width: width as DimensionValue,
        borderWidth: borderWidth,
        borderColor: Colors.BorderColor,
        ...containerStyle,
      }}
      disabled={disable}
      onPress={onPress}
      activeOpacity={activeOpacity}>
      <Text
        style={[
          styles.buttonText,
          {color: colour, fontSize: fontSize, ...textStyle},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonOulined: {
      width: '50%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      color: Colors.Primary,
      borderColor: Colors.Primary,
      borderWidth: 1,
      marginTop: 15,
    },
  });
export default MyButton;
