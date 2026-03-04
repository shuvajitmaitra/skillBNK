import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function DoubleArrowRightIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_d_3946_8911)">
        <Circle
          cx={12}
          cy={12}
          r={12}
          transform="matrix(-1 0 0 1 32 8)"
          fill="#fff"
        />
      </G>
      <Path
        d="M20.667 23.33L24 19.998l-3.333-3.333M16.003 23.33l3.333-3.333-3.333-3.333"
        stroke="#000"
        strokeOpacity={0.5}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default DoubleArrowRightIcon;
