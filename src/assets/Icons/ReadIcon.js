import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function ReadIcon({ color = "#546A7E", ...props }) {
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
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.639 12.812v-4.19a.684.684 0 00-.754-.692h-.02c-.73.063-1.837.434-2.455.823l-.06.039a.385.385 0 01-.367 0l-.087-.053c-.618-.385-1.723-.753-2.452-.812a.683.683 0 00-.75.69v4.195c0 .334.271.646.604.688l.101.014c.754.1 1.917.482 2.584.847l.013.007a.375.375 0 00.334 0c.666-.368 1.833-.754 2.59-.854l.115-.014a.714.714 0 00.604-.688zM10.166 8.906v5.209M8.69 9.948h-.78M8.951 10.99H7.91"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
