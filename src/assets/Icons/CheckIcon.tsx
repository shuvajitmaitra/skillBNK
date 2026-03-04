import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import {TIcons} from '../../types';

function CheckIcon({size, color, ...props}: TIcons) {
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
        stroke={color || '#27AC1F'}
      />
      <Path
        d="M17.999 6l-8.25 8.25-3.75-3.75"
        stroke={color || '#27AC1F'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CheckIcon;
