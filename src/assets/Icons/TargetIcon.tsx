import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function TargetIcon({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg width={size || 20} height={size || 20} viewBox="0 0 20 20" {...props}>
      <Path
        d="M255 7689a1 1 0 11-2 0 1 1 0 012 0m4 1h.91a6.008 6.008 0 01-4.91 4.91v-.91a1 1 0 00-2 0v.91a6.008 6.008 0 01-4.91-4.91h.91a1 1 0 000-2h-.91a6.008 6.008 0 014.91-4.91v.91a1 1 0 002 0v-.91a6.008 6.008 0 014.91 4.91H259a1 1 0 000 2m4-2h-1.069a7.994 7.994 0 00-6.931-6.931V7680a1 1 0 00-2 0v1.069a7.994 7.994 0 00-6.931 6.931H245a1 1 0 000 2h1.069a7.994 7.994 0 006.931 6.931V7698a1 1 0 002 0v-1.069a7.994 7.994 0 006.931-6.931H263a1 1 0 000-2"
        transform="translate(-300 -7839) translate(56 160)"
        fill={color || Colors.BodyText}
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export default TargetIcon;
