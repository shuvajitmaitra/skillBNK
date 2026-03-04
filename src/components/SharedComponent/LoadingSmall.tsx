import {ActivityIndicator} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';

const LoadingSmall = ({size, color}: {size?: number; color?: string}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <ActivityIndicator
      size={size || 10}
      animating={true}
      color={color || Colors.LightGreen}
    />
  );
};

export default LoadingSmall;
