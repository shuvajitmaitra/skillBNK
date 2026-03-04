import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function DownloadIconTwo({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  const iconColor = color || Colors.Primary;
  const iconSize = size || 24;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11.51l3 3 3-3M12 14.51v-8M6 16.51c3.89 1.3 8.11 1.3 12 0"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DownloadIconTwo;
