import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function GlobeIcon({color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9 16.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        stroke={color || '#626262'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 2.25h.75a21.318 21.318 0 000 13.5H6M11.25 2.25a21.318 21.318 0 010 13.5"
        stroke={color || '#626262'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.25 12v-.75a21.318 21.318 0 0013.5 0V12M2.25 6.75a21.318 21.318 0 0113.5 0"
        stroke={color || '#626262'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GlobeIcon;
