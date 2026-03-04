import * as React from "react";
import Svg, { G, Path, Rect } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function BlockIcon(props) {
  const Colors = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={19}
      viewBox="0 0 256 256"
      {...props}
    >
      <G
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
        stroke="none"
        strokeWidth={0}
        strokeDasharray="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        fill="none"
        fillRule="nonzero"
        opacity={1}
      >
        <Path
          d="M45 90c-12.02 0-23.32-4.681-31.82-13.181C4.681 68.32 0 57.02 0 45s4.681-23.32 13.18-31.82C21.68 4.681 32.98 0 45 0s23.32 4.681 31.819 13.18C85.319 21.68 90 32.98 90 45s-4.681 23.32-13.181 31.819C68.32 85.319 57.02 90 45 90zm0-82c-9.883 0-19.174 3.849-26.163 10.837C11.849 25.826 8 35.117 8 45s3.849 19.174 10.837 26.163C25.826 78.151 35.117 82 45 82s19.174-3.849 26.163-10.837C78.151 64.174 82 54.883 82 45s-3.849-19.174-10.837-26.163C64.174 11.849 54.883 8 45 8z"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          fill={Colors.BodyText}
          fillRule="nonzero"
          opacity={1}
        />
        <Rect
          x={4}
          y={41}
          rx={0}
          ry={0}
          width={82}
          height={8}
          transform="rotate(-45.009 44.995 44.999)"
          stroke="none"
          strokeWidth={1}
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          fill={Colors.BodyText}
          fillRule="nonzero"
          opacity={1}
        />
      </G>
    </Svg>
  );
}

export default BlockIcon;
