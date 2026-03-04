import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function MembersIcon(props) {
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
        d="M7.634 9.058a1.515 1.515 0 00-.275 0 3.683 3.683 0 01-3.558-3.692c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 01.133 7.392zM13.675 3.334a2.915 2.915 0 012.916 2.917 2.92 2.92 0 01-2.808 2.916.942.942 0 00-.217 0M3.466 12.134c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0zM15.285 16.666a4.032 4.032 0 001.634-.725c1.3-.975 1.3-2.583 0-3.558-.459-.35-1.017-.584-1.609-.717"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MembersIcon;
