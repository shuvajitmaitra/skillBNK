import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function SpecialOffersIcon(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M16.995 4h-10c-3.83 0-4.9.92-4.99 4.5 1.93 0 3.49 1.57 3.49 3.5s-1.56 3.49-3.49 3.5c.09 3.58 1.16 4.5 4.99 4.5h10c4 0 5-1 5-5V9c0-4-1-5-5-5zM8.993 4v3.5M8.993 16.5V20"
        stroke={Colors.PureWhite}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.025 9.33l.62 1.25c.06.12.18.21.31.23l1.38.2c.34.05.48.47.23.71l-1 .97c-.1.09-.14.23-.12.37l.24 1.37c.06.34-.3.6-.6.44l-1.23-.65a.445.445 0 00-.39 0l-1.23.65c-.31.16-.66-.1-.6-.44l.24-1.37a.422.422 0 00-.12-.37l-.99-.97a.416.416 0 01.23-.71l1.38-.2c.14-.02.25-.1.31-.23l.61-1.25c.14-.31.58-.31.73 0z"
        stroke={Colors.PureWhite}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SpecialOffersIcon;
