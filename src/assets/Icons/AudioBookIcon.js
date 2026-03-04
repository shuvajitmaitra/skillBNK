import * as React from "react";
import Svg, { Path } from "react-native-svg";

function AudioBookIcon(props) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="-6 0 64 64"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M48 0H0v64h48a4 4 0 004-3.999V4a4 4 0 00-4-4z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#48a0dc"
      />
      <Path d="M0 0H8V64H0z" fill="#387ba8" />
      <Path
        d="M39.654 21.353c-2.979-4.052-7.21-5.05-9.678-5.271-.056-1.157-.92-2.08-1.987-2.08-1.104 0-1.997.983-1.997 2.195V42.23a8.717 8.717 0 00-2.002-.233c-3.311 0-5.994 1.791-5.994 4.003 0 2.211 2.684 4.004 5.994 4.004 3.138 0 5.707-1.611 5.968-3.661.027-.078.042-.19.042-.342l-.011-25.547c5.091.798 7.965 4.532 8.007 7.48-.002.028-.009.054-.009.082 0 1.102.896 1.995 2.002 1.995a2 2 0 002.003-1.995l-.001-.009c.001-.002.009-.003.009-.006 0-1.633.309-3.039-2.346-6.648z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#fff"
      />
    </Svg>
  );
}

export default AudioBookIcon;
