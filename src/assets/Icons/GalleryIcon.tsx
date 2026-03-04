import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function GalleryIcon({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 10a2 2 0 100-4 2 2 0 000 4zM2.67 18.95l4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GalleryIcon;
