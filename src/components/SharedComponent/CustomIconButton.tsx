import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {fontSizes} from '../../constants/Sizes';

export default function CustomIconButton({
  handlePress = () => {},
  title = 'Button Title',
  customContainerStyle = {},
  isLoading = false,
  disable = false,
  icon = <></>, // Expecting an icon component passed as prop
  iconPosition = 'left', // Option to place icon on left or right
  background = '',
  color = '',
}) {
  const Colors = useTheme();
  const styles = getStyles();

  /*
handlePress = {() => {}}
title = "Button Title"
customContainerStyle={{}}
isLoading = {false}
disable = {false}
icon = {null} // Expecting an icon component passed as prop
iconPosition = {"left"}// Option to place icon on left or right


*/
  return (
    <TouchableOpacity
      disabled={isLoading || disable}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.btnContainer,
        customContainerStyle,
        {
          backgroundColor: background
            ? background
            : disable
            ? Colors.DisablePrimaryBackgroundColor
            : Colors.Primary,
        },
      ]}>
      {icon && iconPosition === 'left' && <>{icon}</>}

      {
        <Text
          style={[
            styles.btnText,
            {
              color: color
                ? color
                : disable
                ? Colors.DisablePrimaryButtonTextColor
                : Colors.PureWhite,
            },
          ]}>
          {title}
        </Text>
      }

      {icon && iconPosition === 'right' && <>{icon}</>}
    </TouchableOpacity>
  );
}

const getStyles = () =>
  StyleSheet.create({
    btnContainer: {
      width: '100%',
      height: 'auto',
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'red',
    },
    btnContent: {},
    btnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: fontSizes.subHeading,
    },
  });
