import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';
import {useTheme} from '../../context/ThemeContext';

function MessageIconLive2({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 30}
      height={size || 30}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M22 10v3c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h6"
        stroke={color || '#292D32'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke={Colors.SuccessColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.996 11h.01M11.995 11h.01M7.995 11h.008"
        stroke={color || '#292D32'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MessageIconLive2;
