import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

export default function CustomeBtn({
  handlePress = () => {},
  title = 'Button Title',
  isLoading = false,
  customeContainerStyle = {},
  disable = false,
  buttonTextStyle = {},
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  /*

handlePress = {() => {} }
title = "Button Title"
customeContainerStyle={{ flex: 0.3, height: 30, borderRadius: 4, marginTop: 0 }}
isLoading={{}}
disable={{}}


 */
  return (
    <TouchableOpacity
      disabled={isLoading ? isLoading : disable ? disable : false}
      onPress={handlePress}
      style={{
        ...styles.btnContainer,
        ...{
          backgroundColor: disable
            ? Colors.DisablePrimaryBackgroundColor
            : Colors.Primary,
        },
        ...customeContainerStyle,
      }}
      activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator
          color={Colors.PureWhite}
          animating={true}
          size="large"
          style={{marginRight: 5}}
        />
      ) : (
        <Text
          style={{
            ...styles.btnText,
            ...{
              color: disable
                ? Colors.DisablePrimaryButtonTextColor
                : Colors.PureWhite,
            },
            ...buttonTextStyle,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    btnContainer: {
      width: '100%',
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
    },
    btnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
  });
