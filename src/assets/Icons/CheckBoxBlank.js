import * as React from "react";
import Svg, { Rect } from "react-native-svg";

function CheckBoxBlank(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={0.5}
        width={17}
        height={17}
        rx={3.5}
        stroke="#546A7E"
        strokeOpacity={0.5}
      />
    </Svg>
  );
}

export default CheckBoxBlank;
