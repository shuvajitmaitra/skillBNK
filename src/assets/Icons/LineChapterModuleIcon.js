import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function LineChapterModuleIcon(props) {
  return (
    <Svg
      width={300}
      height={2}
      viewBox="0 0 300 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        stroke="#546A7E"
        strokeOpacity={0.2}
        d="M4.37114e-8 1L295 1.00002"
      />
    </Svg>
  );
}
