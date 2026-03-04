import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function VolumeMute(props) {
  const Colors = useTheme();
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
        d="M1.667 8.466V11.8c0 1.666.833 2.5 2.5 2.5h1.192c.308 0 .616.091.883.25l2.433 1.524c2.1 1.317 3.825.359 3.825-2.116v-7.65c0-2.484-1.725-3.434-3.825-2.117L6.242 5.716c-.267.158-.575.25-.883.25H4.167c-1.667 0-2.5.833-2.5 2.5z"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
      />
      <Path
        d="M18.333 11.766l-3.3-3.3M18.3 8.5L15 11.8"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default VolumeMute;
