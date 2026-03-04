import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ArrowDownFour({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 30}
      height={size || 30}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M4 8l8 8 8-8"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowDownFour;
