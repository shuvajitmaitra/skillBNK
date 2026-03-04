import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SwapIcon(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_d_3008_6821)">
        <Circle cx={30} cy={30} r={20} fill={Colors.Foreground} />
      </G>
      <Path
        d="M34.167 20.833l3.333 3.334-3.333 3.333"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.5 29.167V27.5a3.333 3.333 0 013.333-3.333H37.5M25.833 39.167L22.5 35.833l3.333-3.333"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.5 30.833V32.5a3.333 3.333 0 01-3.333 3.333H22.5"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default SwapIcon;
