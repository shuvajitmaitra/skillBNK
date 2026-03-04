import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function ArrowRightCircle({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 40}
      height={size || 40}
      viewBox="0 0 40 40"
      fill="none"
      {...props}>
      <G filter="url(#filter0_d_3_50432)">
        <Circle
          cx={12}
          cy={12}
          r={12}
          transform="matrix(-1 0 0 1 32 8)"
          fill={Colors.BodyTextOpacity}
        />
      </G>
      <Path
        d="M20.667 23.33L24 19.998l-3.333-3.333M16.003 23.33l3.333-3.333-3.333-3.333"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs />
    </Svg>
  );
}

export default ArrowRightCircle;
