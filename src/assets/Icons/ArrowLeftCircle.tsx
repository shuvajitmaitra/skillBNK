import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function ArrowLeftCircle({size, color, props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 40}
      height={size || 40}
      viewBox="0 0 40 40"
      fill="none"
      {...props}>
      <G filter="url(#filter0_d_3_50427)">
        <Circle cx={20} cy={20} r={12} fill={Colors.BodyTextOpacity} />
      </G>
      <Path
        d="M19.333 23.33L16 19.998l3.333-3.333M23.997 23.33l-3.333-3.333 3.333-3.333"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs />
    </Svg>
  );
}

export default ArrowLeftCircle;
