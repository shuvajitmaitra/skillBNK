import * as React from "react";
import Svg, { Path } from "react-native-svg";

function RepeatIcon(props) {
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
        d="M6.25 6.951h6.167c.741 0 1.333.6 1.333 1.333V9.76"
        stroke="#666"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.658 5.55L6.25 6.95l1.408 1.41M13.75 13.05H7.583c-.741 0-1.333-.6-1.333-1.333v-1.475"
        stroke="#666"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.34 14.451l1.408-1.4-1.408-1.408"
        stroke="#666"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.001 18.333a8.333 8.333 0 100-16.667 8.333 8.333 0 000 16.667z"
        stroke="#666"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default RepeatIcon;
