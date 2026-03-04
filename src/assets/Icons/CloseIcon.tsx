import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function CloseIcon({size, color}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg width={size || 28} height={size || 28} viewBox="0 0 32 32" fill="none">
      <G opacity={0.15} filter="url(#filter0_b_529_3335)">
        <Circle cx={16} cy={16} r={16} fill={color || Colors.BodyText} />
      </G>
      <Path
        d="M20.48 12.16l-8.32 8.32M20.48 20.48l-8.32-8.32"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default CloseIcon;
