import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function ArrowRightWhite({color, ...props}: TIcons) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M8.417 3.459l3.541 3.54-3.54 3.542M2.041 7h9.817"
        stroke={color || '#fff'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowRightWhite;
