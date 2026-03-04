import * as React from "react";
import Svg, { Circle } from "react-native-svg";

function CircleIcon(props) {
  return (
    <Svg
      width={10}
      height={10}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={4.70628}
        cy={4.88231}
        r={3.55882}
        fill="#BDBDBD"
        stroke="#fff"
      />
    </Svg>
  );
}

export default CircleIcon;
