import {View, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {borderRadius, gGap} from '../../constants/Sizes';

const CustomProgressbar = ({
  progress,
  containerStyle,
  innerContainerStyle,
}: {
  progress: number;
  containerStyle?: ViewStyle;
  innerContainerStyle?: ViewStyle;
}) => {
  const Colors = useTheme();
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: Colors.PrimaryOpacityColor,
        borderRadius: borderRadius.circle,
        ...(containerStyle as ViewStyle),
      }}>
      <View
        style={{
          backgroundColor: Colors.Primary,
          width: `${progress}%`,
          height: gGap(10),
          borderRadius: borderRadius.circle,
          ...(innerContainerStyle as ViewStyle),
        }}>
        <></>
      </View>
    </View>
  );
};

export default CustomProgressbar;
