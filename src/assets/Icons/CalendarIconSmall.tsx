import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function CalendarIconSmall({size, color, ...props}: TIcons) {
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M6.667 1.667v2.5M13.333 1.667v2.5M2.917 7.575h14.166M17.5 7.083v7.084c0 2.5-1.25 4.166-4.167 4.166H6.667c-2.917 0-4.167-1.666-4.167-4.166V7.083c0-2.5 1.25-4.166 4.167-4.166h6.666c2.917 0 4.167 1.666 4.167 4.166z"
        stroke={color || '#666'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.078 11.416h.008M13.078 13.916h.008M9.995 11.416h.008M9.995 13.916h.008M6.913 11.416h.007M6.913 13.916h.007"
        stroke={color || '#666'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CalendarIconSmall;
