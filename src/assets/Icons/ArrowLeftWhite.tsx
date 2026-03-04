import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ArrowLeftWhite({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  const iconColor = color || Colors.PureWhite;
  return (
    <Svg
      width={size || 14}
      height={size || 14}
      viewBox="0 0 14 14"
      fill="none"
      {...props}>
      <Path
        d="M5.583 3.459l-3.541 3.54 3.54 3.542M11.959 7H2.141"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowLeftWhite;
