import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function VolumeIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
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
        d="M1.667 8.333v3.334c0 1.666.833 2.5 2.5 2.5h1.192c.308 0 .616.091.883.25l2.433 1.525c2.1 1.316 3.825.358 3.825-2.117v-7.65c0-2.483-1.725-3.433-3.825-2.117L6.242 5.583c-.267.159-.575.25-.883.25H4.167c-1.667 0-2.5.834-2.5 2.5z"
        stroke={Colors.BodyText}
        strokeWidth={1.2}
      />
      <Path
        d="M15 6.667a5.55 5.55 0 010 6.666M16.525 4.583a9.025 9.025 0 010 10.834"
        stroke={Colors.BodyText}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default VolumeIcon;
