import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function TickCircleIcon({size, color}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg width={size || 20} height={size || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 18.333c4.583 0 8.333-3.75 8.333-8.333S14.583 1.667 10 1.667 1.667 5.417 1.667 10s3.75 8.333 8.333 8.333z"
        stroke={color || Colors.PureWhite}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.458 10l2.359 2.358 4.725-4.716"
        stroke={color || Colors.PureWhite}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TickCircleIcon;
