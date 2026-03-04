import * as React from "react";
import Svg, { Path } from "react-native-svg";

function AudioIcon(props) {
  const { color = "#27AC1F", width = 35, height = 35, ...otherProps } = props;
  
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...otherProps}
    >
      <Path
        d="M2 10v4c0 2 1 3 3 3h1.43c.37 0 .74.11 1.06.3l2.92 1.83c2.52 1.58 4.59.43 4.59-2.54V7.41c0-2.98-2.07-4.12-4.59-2.54L7.49 6.7c-.32.19-.69.3-1.06.3H5c-2 0-3 1-3 3z"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M18 8a6.66 6.66 0 010 8M19.83 5.5a10.83 10.83 0 010 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default AudioIcon;
