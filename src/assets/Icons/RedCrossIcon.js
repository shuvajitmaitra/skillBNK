import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function RedCrossIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_b_1295_7001)">
        <Circle cx={7} cy={7} r={7} fill="#FF0000" fillOpacity={0.7} />
        <Circle cx={7} cy={7} r={6.6} stroke="#fff" strokeWidth={0.8} />
      </G>
      <Path
        d="M8.964 5.318l-3.64 3.64M8.965 8.958l-3.64-3.64"
        stroke="#fff"
        strokeLinecap="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default RedCrossIcon;
