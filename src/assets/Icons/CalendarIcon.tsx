import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function CalendarIcon({color, size}: TIcons) {
  return (
    <Svg width={size || 16} height={size || 15} viewBox="0 0 16 15" fill="none">
      <Path
        d="M8.875 2.543h1.75"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.875 2.543h1.75"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.375 2.543h1.75"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.375 2.543h1.75"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.375 2.543h1.458A1.17 1.17 0 0115 3.71v8.749a1.17 1.17 0 01-1.167 1.166H2.167A1.17 1.17 0 011 12.459v-8.75a1.17 1.17 0 011.167-1.166h1.166"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.375 2.543h1.458A1.17 1.17 0 0115 3.71v8.749a1.17 1.17 0 01-1.167 1.166H2.167A1.17 1.17 0 011 12.459v-8.75a1.17 1.17 0 011.167-1.166h1.166"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 3.125v-1.75"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 3.125v-1.75"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 3.125v-1.75"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 3.125v-1.75"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.5 3.125v-1.75"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.5 3.125v-1.75"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 5.167h14"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 5.167h14"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.929 9.015l1.633 1.662 2.508-2.508"
        stroke={color || '#0736D1'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.929 9.015l1.633 1.662 2.508-2.508"
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CalendarIcon;
