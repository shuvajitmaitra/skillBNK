import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const DrawerIcon = (props) => {
  const Colors = useTheme();

  return (
    <>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={16}
        fill="none"
        {...props}
      >
        <Path
          fill={Colors.Heading}
          d="M0 1a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm0 7a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm0 7a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Z"
        />
      </Svg>
    </>
  );
};


export default DrawerIcon;
