import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function LockIcon(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.5 19a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
        stroke="#546A7E"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.084 9.472v-.694c0-1.15.347-2.084 2.083-2.084 1.736 0 2.083.934 2.083 2.084v.694M10.167 12.424a.868.868 0 100-1.736.868.868 0 000 1.736z"
        stroke="#546A7E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.903 13.639H8.43c-1.388 0-1.736-.347-1.736-1.736v-.695c0-1.389.348-1.736 1.736-1.736h3.473c1.389 0 1.736.347 1.736 1.736v.695c0 1.389-.347 1.736-1.736 1.736z"
        stroke="#546A7E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
