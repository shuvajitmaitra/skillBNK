import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';
const ProgramIcon = ({size, color}: TIcons) => (
  <Svg width={size || 24} height={size || 24} viewBox="0 0 25 25" fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m8.5 14.5 3.4-2.5-3.4-2.5v5Z"
    />
    <Path
      stroke={color}
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m10 7 7 5-7 5"
    />
  </Svg>
);
export default ProgramIcon;
