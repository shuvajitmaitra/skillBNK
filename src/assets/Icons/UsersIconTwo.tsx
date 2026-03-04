import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

import {TIcons} from '../../types';
function UsersIconsTwo({color, size, ...props}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconColor = color || Colors.Primary;
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M7.633 9.058a1.515 1.515 0 00-.275 0A3.683 3.683 0 013.8 5.367c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 01.133 7.392zM13.675 3.333A2.915 2.915 0 0116.59 6.25a2.92 2.92 0 01-2.808 2.917.94.94 0 00-.217 0M3.467 12.133c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0zM15.283 16.667a4.03 4.03 0 001.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default UsersIconsTwo;
