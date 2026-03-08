import React from 'react';
import {Text, TextProps, StyleProp, TextStyle} from 'react-native';

interface RNTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const RNText = ({children, style, ...props}: RNTextProps) => {
  return (
    <Text {...props} style={[style]}>
      {children}
    </Text>
  );
};

export default RNText;
