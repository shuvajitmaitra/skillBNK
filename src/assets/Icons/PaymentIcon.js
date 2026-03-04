import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const PaymentIcon = (props) => {
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
        d="M7.227 11.941c0 1.075.825 1.942 1.85 1.942h2.091c.892 0 1.617-.758 1.617-1.691 0-1.017-.442-1.376-1.1-1.609L8.327 9.416c-.659-.233-1.1-.591-1.1-1.608 0-.933.725-1.692 1.616-1.692h2.092c1.025 0 1.85.867 1.85 1.942M10 5v10"
      />
      <Path
        stroke={Colors.Heading}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z"
      />
    </Svg>
  );
};
export default PaymentIcon;
