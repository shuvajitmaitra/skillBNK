import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function SwapIconTwo({ color, size, ...props }) {
  const Colors = useTheme();
  return (
    <Svg width={size || 35} height={size || 35} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fill={color || Colors.BodyText}
        d="M36.4 28.6l-4.9-5a2.1 2.1 0 00-2.7-.2 1.9 1.9 0 00-.2 3l1.6 1.6H15a2 2 0 000 4h15.2l-1.6 1.6a1.9 1.9 0 00.2 3 2.1 2.1 0 002.7-.2l4.9-5a1.9 1.9 0 000-2.8zM33 16H17.8l1.6-1.6a1.9 1.9 0 00-.2-3 2.1 2.1 0 00-2.7.2l-4.9 5a1.9 1.9 0 000 2.8l4.9 5a2.1 2.1 0 002.7.2 1.9 1.9 0 00.2-3L17.8 20H33a2 2 0 000-4z"
      />
      {/* <Path d="M42 24A18 18 0 1124 6a18.1 18.1 0 0118 18m4 0a22 22 0 10-22 22 21.9 21.9 0 0022-22z" /> */}
    </Svg>
  );
}

export default SwapIconTwo;
