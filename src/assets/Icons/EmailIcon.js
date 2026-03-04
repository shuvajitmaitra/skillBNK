import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function EmailIcon(props) {
  const Colors = useTheme();
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
        d="M14.167 17.083H5.834c-2.5 0-4.167-1.25-4.167-4.166V7.083c0-2.916 1.667-4.166 4.167-4.166h8.333c2.5 0 4.167 1.25 4.167 4.166v5.834c0 2.916-1.667 4.166-4.167 4.166z"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.166 7.5l-2.608 2.083c-.858.684-2.267.684-3.125 0L5.833 7.5"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EmailIcon;
