import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function ExpandLeftIcon(props) {
  const Colors = useTheme();
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M10.1 4.1v-2h-8v8h2V5.516l5.779 5.778 1.414-1.414L5.515 4.1H10.1zM19.9 13.9h2v8h-8v-2h4.585l-5.778-5.779 1.414-1.414 5.779 5.778V13.9z"
        fill={Colors.BodyText}
      />
    </Svg>
  );
}

export default ExpandLeftIcon;
