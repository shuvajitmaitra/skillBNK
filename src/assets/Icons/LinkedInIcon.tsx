import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {TIcons} from '../../types';

function LinkedInIcon({color, size, ...props}: TIcons) {
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
        d="M12.95 12.934h-1.652v-2.587c0-.616-.01-1.41-.86-1.41-.86 0-.99.672-.99 1.367v2.63H7.795v-5.32H9.38v.728h.023c.22-.418.76-.859 1.564-.859 1.675 0 1.984 1.102 1.984 2.534v2.917zM5.933 6.888a.959.959 0 110-1.917.959.959 0 010 1.917zm-.828.727h1.655v5.319H5.104v-5.32z"
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

export default LinkedInIcon;
