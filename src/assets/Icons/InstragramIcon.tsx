import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {TIcons} from '../../types';

function InstragramIcon({size, color, ...props}: TIcons) {
  return (
    <Svg
      width={size || 25}
      height={size || 25}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        d="M10.673 5.65h-3.35c-.926 0-1.676.75-1.676 1.675v3.351c0 .925.75 1.675 1.675 1.675h3.351c.926 0 1.676-.75 1.676-1.675V7.325c0-.925-.75-1.676-1.676-1.676z"
        stroke={color || '#27AC1F'}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.34 8.79a1.34 1.34 0 11-2.652.394 1.34 1.34 0 012.652-.394z"
        stroke={color || '#27AC1F'}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.842 7.158h.007"
        stroke={color || '#27AC1F'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x={0.5}
        y={0.5}
        width={17}
        height={17}
        rx={8.5}
        stroke={color || '#27AC1F'}
        strokeOpacity={0.8}
      />
    </Svg>
  );
}

export default InstragramIcon;
