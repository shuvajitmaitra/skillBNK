import * as React from "react";
import Svg, { Rect, Text } from "react-native-svg";

function HighPriorityIcon({ width = 11, height = 11, ...props }) {
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
        fill="#F34141"
      />
      <Text
        x="5.5"
        y="7"
        fontSize="5"
        fontWeight="bold"
        textAnchor="middle"
        fill="#fff"
      >
        !
      </Text>
    </Svg>
  );
}

export default HighPriorityIcon;
