import * as React from "react";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useTheme } from "../../context/ThemeContext";

function ThreeDotGrayIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      width={4}
      height={16}
      viewBox="0 0 4 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={2} cy={2} r={2} fill={Colors.Gray} fillOpacity={0.9} />
      <Circle cx={2} cy={9} r={2} fill={Colors.Gray} fillOpacity={0.9} />
      <Circle cx={2} cy={16} r={2} fill={Colors.Gray} fillOpacity={0.9} />
    </Svg>
  );
}

export default ThreeDotGrayIcon;
