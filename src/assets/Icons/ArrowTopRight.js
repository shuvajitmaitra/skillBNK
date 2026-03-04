import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function ArrowTopRight({ backgroundColor, color, ...props }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  const iconColor1 = color || Colors.PureWhite;
  const iconColor2 = backgroundColor || Colors.Primary;
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={11} cy={11} r={11} fill={iconColor2} />
      <Path
        d="M10.014 6.7l-.003 1.085 3.528-.005-6.236 6.237.768.767 6.236-6.236-.008 3.532 1.089-.006.012-5.387-5.386.013z"
        fill={iconColor1}
      />
    </Svg>
  );
}

export default ArrowTopRight;
