import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function ChevronIconUp(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={14}
      height={8}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 7l6-6 6 6"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChevronIconUp;
