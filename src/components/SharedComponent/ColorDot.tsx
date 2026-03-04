import {View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';

interface ColorDotProps {
  background?: string;
}

const ColorDot: React.FC<ColorDotProps> = ({background}) => {
  const Colors = useTheme();
  return (
    <View
      style={{
        width: 13,
        height: 13,
        borderRadius: 100,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: Colors.Foreground,
        backgroundColor: background || Colors.Primary,
      }}
    />
  );
};

export default ColorDot;
