import * as React from "react";
import Svg, { Rect, Text } from "react-native-svg";

function MediumPriorityIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={11}
      viewBox="0 0 11 11"
      fill="none"
      {...props}
    >
      <Rect
        x={0.142578}
        y={5.0713}
        width={7.17189}
        height={7.17189}
        rx={0.671205}
        transform="rotate(-45 .143 5.071)"
        fill="orange"
      />
      <Text
        x="5.5"
        y="6.5"
        fontSize="3"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="#fff"
      >
        ...
      </Text>
    </Svg>
  );
}

export default MediumPriorityIcon;
