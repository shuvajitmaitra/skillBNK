import {View, ViewStyle} from 'react-native';
import React from 'react';
import {gGap} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';

const DotIndicator = ({containerStyle}: {containerStyle?: ViewStyle}) => {
  const Colors = useTheme();
  return (
    <View
      style={{
        zIndex: 1,
        backgroundColor: Colors.Red,
        width: gGap(12),
        height: gGap(12),
        borderRadius: 50,
        position: 'absolute',
        top: 0,
        right: 0,
        ...containerStyle,
      }}
    />
  );
};

export default DotIndicator;
