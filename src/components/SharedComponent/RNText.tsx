import {Text, TextStyle} from 'react-native';
import React from 'react';
import CustomFonts from '../../constants/CustomFonts';

const RNText = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style: TextStyle;
}) => {
  return (
    <Text style={{...style, fontFamily: CustomFonts.MEDIUM}} {...props}>
      {children}{' '}
    </Text>
  );
};

export default RNText;
