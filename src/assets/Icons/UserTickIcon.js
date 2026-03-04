import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function UserTickIcon({ size, color, ...props }) {
  // --------------------------
  // ----------- Import theme Color -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Color);
  const iconColor = color || Colors.Primary;
  const iconSize = size || 20;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.003 9.997a4.167 4.167 0 100-8.333 4.167 4.167 0 000 8.333zM2.84 18.333c0-3.225 3.208-5.833 7.158-5.833.8 0 1.575.108 2.3.308"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.337 15.003c0 .625-.175 1.217-.484 1.717-.175.3-.4.567-.658.783a3.254 3.254 0 01-2.192.834 3.308 3.308 0 01-2.85-1.617 3.267 3.267 0 01-.483-1.717c0-1.05.483-1.991 1.25-2.6a3.332 3.332 0 015.417 2.6z"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.703 15.006l.825.825 1.775-1.641"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default UserTickIcon;
