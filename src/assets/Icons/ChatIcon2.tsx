import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ChatIcon2({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M17 3.338A9.954 9.954 0 0012 2C6.477 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 001.591 1.591l2.226-.595a1.634 1.634 0 011.149.133A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10 0-1.821-.487-3.53-1.338-5"
        stroke={color || Colors.Heading}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M8 12h.009m3.982 0H12m3.991 0H16"
        stroke={color || Colors.Heading}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChatIcon2;
