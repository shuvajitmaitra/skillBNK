import {StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import Feather from 'react-native-vector-icons/Feather';
import {fontSizes} from '../../constants/Sizes';
import RNText from './RNText';
const AIcon = Feather as any;
type GlobalSeeMoreButtonProps = {
  onPress: () => void;
  buttonContainerStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  buttonStatus: boolean;
  beforeText?: string;
  afterText?: string;
};

const GlobalSeeMoreButton = ({
  onPress,
  buttonContainerStyle,
  buttonTextStyle,
  buttonStatus,
  beforeText,
  afterText,
}: GlobalSeeMoreButtonProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      style={{...styles.buttonContainer, ...buttonContainerStyle}}
      onPress={onPress}>
      {buttonStatus ? (
        <>
          <RNText style={{...styles.buttonText, ...buttonTextStyle}}>
            {afterText || 'See less'}
          </RNText>
          <AIcon
            name="chevron-up"
            size={30}
            color={Colors.SecondaryButtonTextColor}
          />
        </>
      ) : (
        <>
          <RNText style={{...styles.buttonText, ...buttonTextStyle}}>
            {beforeText || 'See more'}
          </RNText>
          <AIcon
            name="chevron-down"
            size={30}
            color={Colors.SecondaryButtonTextColor}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

export default GlobalSeeMoreButton;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      borderRadius: 25,
      // width: responsiveScreenWidth(33),
      alignSelf: 'center',
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingHorizontal: 10,
    },
    buttonText: {
      color: Colors.SecondaryButtonTextColor,
      fontSize: fontSizes.subHeading,
      paddingBottom: 3,
    },
  });
