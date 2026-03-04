import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function BellOffIcon({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.909 5.823A5.972 5.972 0 006 9v2.756c0 .402-.292.85-.9 1.49A3.99 3.99 0 004 16a2 2 0 002 2h10a2 2 0 001.85-1.237L16 14.914V16H6c0-.534.208-1.018.55-1.377.56-.59 1.45-1.573 1.45-2.867V9c0-.61.136-1.188.38-1.705L6.91 5.823zM16 12.086V9a4 4 0 00-6.334-3.249L8.239 4.325A6 6 0 0118 9v5.086l-2-2z"
        fill={color || Colors.BodyText}
      />
      <Path
        d="M3 3l18 18M13.798 19.877a2 2 0 01-3.62-.05M12 3v1"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BellOffIcon;
