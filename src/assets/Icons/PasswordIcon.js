import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function PasswordIcon(props) {
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
        d="M5 8.333V6.667c0-2.759.833-5 5-5s5 2.241 5 5v1.666M10 15.417a2.083 2.083 0 100-4.167 2.083 2.083 0 000 4.167z"
        stroke={Colors.Heading}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.167 18.333H5.833c-3.333 0-4.166-.833-4.166-4.166V12.5c0-3.333.833-4.167 4.166-4.167h8.334c3.333 0 4.166.834 4.166 4.167v1.667c0 3.333-.833 4.166-4.166 4.166z"
        stroke={Colors.Heading}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PasswordIcon;
