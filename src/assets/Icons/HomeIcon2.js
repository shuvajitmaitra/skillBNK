import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function HomeIconTwo(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 -0.5 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        clipRule="evenodd"
        d="M18.867 15.832l.006-5.793-4.123-4.11a3.189 3.189 0 00-4.5 0l-4.114 4.1v5.8A3.177 3.177 0 009.318 19h6.367a3.177 3.177 0 003.182-3.168z"
        stroke={Colors.Heading}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.624 6.018a.75.75 0 00-1.5 0h1.5zm-.75 4.021h-.75c0 .2.08.39.22.531l.53-.53zm1.097 2.152a.75.75 0 101.058-1.062l-1.058 1.062zm-13.305-1.63a.75.75 0 10-1.06-1.063l1.06 1.062zm-2.696.568a.75.75 0 001.06 1.062L3.97 11.13zM13.75 19a.75.75 0 001.5 0h-1.5zm-4 0a.75.75 0 001.5 0h-1.5zm8.374-12.982v4.021h1.5V6.02h-1.5zm.22 4.552l1.627 1.621 1.058-1.062-1.625-1.621-1.06 1.062zM5.607 9.498l-1.636 1.63 1.06 1.063 1.636-1.63-1.06-1.063zM15.25 19v-1.78h-1.5V19h1.5zm0-1.78a2.75 2.75 0 00-2.75-2.75v1.5c.69 0 1.25.56 1.25 1.25h1.5zm-2.75-2.75a2.75 2.75 0 00-2.75 2.75h1.5c0-.69.56-1.25 1.25-1.25v-1.5zm-2.75 2.75V19h1.5v-1.78h-1.5z"
        fill={Colors.Heading}
      />
    </Svg>
  );
}

export default HomeIconTwo;
