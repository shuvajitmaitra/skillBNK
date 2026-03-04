import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ForwardIcon({size, color}: TIcons) {
  // --------------------------

  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 11l-7-9v5C3.047 7 1.668 16.678 2 22c.502-2.685.735-7 13-7v5l7-9z"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ForwardIcon;
