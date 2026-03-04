import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const CalenderIcon = ({color, size, ...props}: TIcons) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconColor = color || Colors.BodyText;
  const iconSize = size || 24;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.695 13.7h.009M15.695 16.7h.009M11.995 13.7h.01M11.995 16.7h.01M8.294 13.7h.01M8.294 16.7h.01"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default CalenderIcon;
