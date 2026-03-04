import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const ProfileGreenIcon = (props) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <G
        stroke={Colors.Heading}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path d="M10 10a4.167 4.167 0 1 0 0-8.333A4.167 4.167 0 0 0 10 10Z" />
        <G strokeMiterlimit={10}>
          <Path d="m16.008 13.117-2.95 2.95a1.027 1.027 0 0 0-.25.491l-.158 1.125c-.058.409.225.692.633.634l1.125-.159a.991.991 0 0 0 .492-.25l2.95-2.95c.508-.508.75-1.1 0-1.85-.742-.741-1.333-.5-1.842.009Z" />
          <Path d="M15.583 13.542c.25.9.95 1.6 1.85 1.85" />
        </G>
        <Path d="M2.842 18.333C2.842 15.108 6.05 12.5 10 12.5c.867 0 1.7.125 2.475.358" />
      </G>
    </Svg>
  );
};
export default ProfileGreenIcon;
