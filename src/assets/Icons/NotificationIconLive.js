import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function NotificationIconLive(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_d_725_9299)">
        <Circle cx={30} cy={30} r={20} fill={Colors.Foreground} />
      </G>
      <Path
        d="M30.02 20.91c-3.31 0-6 2.69-6 6v2.89c0 .61-.26 1.54-.57 2.06l-1.15 1.91c-.71 1.18-.22 2.49 1.08 2.93 4.31 1.44 8.96 1.44 13.27 0 1.21-.4 1.74-1.83 1.08-2.93l-1.15-1.91c-.3-.52-.56-1.45-.56-2.06v-2.89c0-3.3-2.7-6-6-6z"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <Path
        d="M31.87 21.2a6.754 6.754 0 00-3.7 0c.29-.74 1.01-1.26 1.85-1.26.84 0 1.56.52 1.85 1.26z"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M33.02 37.06c0 1.65-1.35 3-3 3-.82 0-1.58-.34-2.12-.88a3.01 3.01 0 01-.88-2.12"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
      <Defs></Defs>
    </Svg>
  );
}

export default NotificationIconLive;
