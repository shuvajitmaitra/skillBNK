import * as React from "react";
import Svg, { Path } from "react-native-svg";

function AssessmentLineIcon(props) {
  return (
    <Svg
      width={410}
      height={1}
      viewBox="0 0 410 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path stroke="#000" strokeOpacity={0.1} d="M0 0.5L410 0.5" />
    </Svg>
  );
}

export default AssessmentLineIcon;
