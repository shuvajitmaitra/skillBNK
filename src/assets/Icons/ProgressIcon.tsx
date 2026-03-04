import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function ProgressIcon({color, size, ...props}: TIcons) {
  return (
    <Svg
      width={size || 21}
      height={size || 20}
      viewBox="0 0 21 20"
      fill="none"
      {...props}>
      <Path
        d="M6.233 15.125V13.4M10.5 15.125v-3.45M14.767 15.125V9.942M14.767 4.875l-.384.45a15.735 15.735 0 01-8.15 5.033"
        stroke={color || '#fff'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M12.325 4.875h2.442v2.433"
        stroke={color || '#fff'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 18.333h5c4.166 0 5.833-1.666 5.833-5.833v-5c0-4.167-1.666-5.833-5.833-5.833H8c-4.167 0-5.833 1.666-5.833 5.833v5c0 4.167 1.666 5.833 5.833 5.833z"
        stroke={color || '#fff'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ProgressIcon;
