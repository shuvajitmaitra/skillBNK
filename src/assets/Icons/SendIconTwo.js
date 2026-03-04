import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function SendIconTwo({ color = "#fff", ...props }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_3_50194)"
        stroke={color}  // Use the color prop here
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M11.034 1.142L5.689 6.486M11.035 1.142l-3.4 9.716L5.69 6.486 1.318 4.543l9.717-3.401z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3_50194">
          <Path
            fill={color} // Use the color prop here
            transform="translate(.346 .17)"
            d="M0 0H11.66V11.66H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SendIconTwo;
