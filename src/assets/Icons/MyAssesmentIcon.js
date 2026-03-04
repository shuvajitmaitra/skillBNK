import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function MyAssesmentIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  //  const styles = getStyles(Colors);
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.678 2.797a.625.625 0 01.644 0l8.333 5a.625.625 0 010 1.072l-8.333 5a.625.625 0 01-.644 0l-8.333-5a.625.625 0 010-1.072l8.333-5zM2.882 8.333L10 12.604l7.118-4.27L10 4.061 2.882 8.333z"
        fill={Colors.Heading}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.917 7.708a.625.625 0 01.625.625v3.75a.625.625 0 01-1.25 0v-3.75a.625.625 0 01.625-.625zM5 9.792a.625.625 0 01.625.625v3.333A1.875 1.875 0 007.5 15.625h5a1.875 1.875 0 001.875-1.875v-3.333a.625.625 0 111.25 0v3.333a3.125 3.125 0 01-3.125 3.125h-5a3.125 3.125 0 01-3.125-3.125v-3.333A.625.625 0 015 9.792z"
        fill={Colors.Heading}
      />
    </Svg>
  );
}

export default MyAssesmentIcon;
