import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function DocumentsIcon({size, color, ...props}: TIcons) {
  const iconColor = color || '#FFFFFF';
  const iconSize = size || 25;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DocumentsIcon;
