import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function UsersIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.2 12a5 5 0 100-10 5 5 0 000 10zM1 22a9.71 9.71 0 019-7c4.12 0 7.63 2.91 9 7M17.82 4.44a4 4 0 01-1.34 7.53M17.32 14.57A7.998 7.998 0 0123 20"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default UsersIcon;
