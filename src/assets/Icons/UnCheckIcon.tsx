import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
import {TIcons} from '../../types';

function UnCheckIcon({size, color, ...props}: TIcons) {
  return (
    <Svg
      width={size || 23}
      height={size || 22}
      viewBox="0 0 23 22"
      fill="none"
      {...props}>
      <Rect
        x={1.26465}
        y={0.5}
        width={21}
        height={21}
        rx={5.5}
        stroke={color || '#546A7E'}
        strokeOpacity={0.5}
      />
    </Svg>
  );
}

export default UnCheckIcon;
