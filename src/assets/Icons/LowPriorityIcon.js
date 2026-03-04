import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function LowPriorityIcon({ width = 11, height = 11, ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 11 11"
      fill="none"
      {...props}
    >
      <Rect
        x={0.285156}
        y={5.18283}
        width={7.32964}
        height={7.32964}
        rx={0.732964}
        transform="rotate(-45 .285 5.183)"
        fill="#06B407"
      />
      <Path
        d="M5.518 2.984v3.141M7.09 5.078l-1.57 1.57-1.57-1.57"
        stroke="#fff"
        strokeWidth={0.586371}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LowPriorityIcon;
