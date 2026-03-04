import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function CrowdIcon({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 27}
      height={size || 27}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M18 18.72a9.095 9.095 0 003.742-.479 3 3 0 00-4.682-2.72m.94 3.198v.031c0 .225-.011.447-.036.666A11.945 11.945 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.06 6.06 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.057 2.772m0 0a3 3 0 00-4.681 2.72 8.985 8.985 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0v0zm6 3a2.249 2.249 0 11-4.498 0 2.249 2.249 0 014.498 0v0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0v0z"
        stroke={color || Colors.Heading}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CrowdIcon;
