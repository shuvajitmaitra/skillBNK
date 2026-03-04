import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const VideoIcon = (props) => {
  const Colors = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        stroke={Colors.BodyText}
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m13.125 8.75 3.933-3.933a.625.625 0 0 1 1.067.441v9.484a.625.625 0 0 1-1.067.441l-3.933-3.933M3.75 15.625h7.5a1.875 1.875 0 0 0 1.875-1.875v-7.5a1.875 1.875 0 0 0-1.875-1.875h-7.5A1.875 1.875 0 0 0 1.875 6.25v7.5a1.875 1.875 0 0 0 1.875 1.875v0Z"
      />
    </Svg>
  );
};
export default VideoIcon;
