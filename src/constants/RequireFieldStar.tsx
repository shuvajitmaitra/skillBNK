import {Text} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';

const RequireFieldStar = ({color}: {color?: string}) => {
  const Colors = useTheme();
  return <Text style={{color: color || Colors.Red}}>*</Text>;
};

export default RequireFieldStar;
