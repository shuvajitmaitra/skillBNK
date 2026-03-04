import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function NotifyBell({size = 20, color, ...props}: TIcons) {
  const Colors = useTheme();
  const iconColor = color || Colors.BodyText;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M10.017 2.425c-2.759 0-5 2.242-5 5v2.408c0 .509-.217 1.284-.476 1.717l-.958 1.592c-.592.983-.183 2.075.9 2.441 3.592 1.2 7.467 1.2 11.058 0a1.669 1.669 0 00.9-2.441l-.958-1.592c-.25-.433-.466-1.208-.466-1.717V7.425c0-2.75-2.25-5-5-5z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <Path
        d="M11.558 2.667a5.628 5.628 0 00-3.083 0 1.654 1.654 0 011.542-1.05c.7 0 1.3.433 1.541 1.05z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.517 15.883c0 1.375-1.125 2.5-2.5 2.5a2.509 2.509 0 01-1.767-.733 2.509 2.509 0 01-.733-1.767"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

export default NotifyBell;
