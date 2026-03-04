import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ClockIcon({size, props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 12}
      height={size || 12}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.71 15.18l-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ClockIcon;
