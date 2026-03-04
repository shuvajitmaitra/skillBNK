import * as React from "react";
import Svg, { Circle } from "react-native-svg";

function IncompleteIcon({ width = 9, height = 9, ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9 9"
      fill="none"
      {...props}
    >
      <Circle
        cx={4.46289}
        cy={4.86566}
        r={4}
        fill="#FF5454"
        fillOpacity={0.2}
      />
      <Circle
        cx={4.4655}
        cy={4.8657}
        r={2.66667}
        fill="#FF5454"
        fillOpacity={0.2}
      />
      <Circle cx={4.46029} cy={4.86562} r={1.33333} fill="#FF5454" />
    </Svg>
  );
}

export default IncompleteIcon;
