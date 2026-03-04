import * as React from "react";
import Svg, { Path } from "react-native-svg";

function LineUp(props) {
  return (
    <Svg
      width={2}
      height={50}
      viewBox="0 0 1 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path stroke="#000" strokeOpacity={0.1} d="M0.5 2.18552e-8L0.499999 32" />
    </Svg>
  );
}

export default LineUp;
