import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {TIcons} from '../../types';

function FacebookIcon({size, color, ...props}: TIcons) {
  return (
    <Svg
      width={size || 25}
      height={size || 25}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.084 5.237a11.46 11.46 0 00-1.191-.055c-1.18 0-1.99.633-1.99 1.794v1H6.572v1.359h1.331v3.482h1.598V9.335h1.327l.204-1.358h-1.53v-.868c0-.39.12-.66.762-.66h.82V5.236z"
        fill={color || '#27AC1F'}
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

export default FacebookIcon;
