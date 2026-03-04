import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ArrowLeft({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 26}
      height={size || 26}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowLeft;
