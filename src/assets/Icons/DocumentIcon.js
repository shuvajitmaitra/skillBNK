import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const DocumentIcon = (props) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        stroke={Colors.Heading}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.333 8.333V12.5c0 4.167-1.666 5.833-5.833 5.833h-5c-4.167 0-5.833-1.666-5.833-5.833v-5c0-4.167 1.666-5.833 5.833-5.833h4.167"
      />
      <Path
        stroke={Colors.Heading}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.333 8.333H15c-2.5 0-3.333-.833-3.333-3.333V1.667l6.666 6.666ZM5.833 10.833h5M5.833 14.167h3.334"
      />
    </Svg>
  );
};
export default DocumentIcon;
