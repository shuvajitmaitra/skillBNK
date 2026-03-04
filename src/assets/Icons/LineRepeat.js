import * as React from "react";
import Svg, { Path } from "react-native-svg";

function LineRepeat(props) {
  return (
    <Svg
      width={340}
      height={1}
      viewBox="0 0 380 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path stroke="#000" strokeOpacity={0.1} d="M4.37114e-8 0.5L300 0.50002" />
    </Svg>
  );
}

export default LineRepeat;
