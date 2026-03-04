import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {TIcons} from '../../types';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function CopySmallIcon({size, color}: TIcons) {
  return (
    <Svg width={size || 19} height={size || 19} viewBox="0 0 17 17" fill="none">
      <G opacity={0.1} filter="url(#filter0_b_3694_9574)">
        <Circle
          cx={8.76459}
          cy={8.73529}
          r={8.23529}
          fill={color || '#546A7E'}
        />
      </G>
      <Path
        d="M10.137 9.044v1.441c0 1.201-.48 1.682-1.681 1.682H7.014c-1.2 0-1.681-.48-1.681-1.682v-1.44c0-1.202.48-1.682 1.681-1.682h1.442c1.2 0 1.68.48 1.68 1.681z"
        stroke={color || '#546A7E'}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.196 6.985v1.441c0 1.201-.48 1.682-1.681 1.682h-.378V9.044c0-1.2-.48-1.681-1.681-1.681H7.392v-.378c0-1.2.48-1.681 1.681-1.681h1.442c1.2 0 1.681.48 1.681 1.681z"
        stroke={color || '#546A7E'}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs />
    </Svg>
  );
}

export default CopySmallIcon;
