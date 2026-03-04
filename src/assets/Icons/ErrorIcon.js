import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ErrorIcon(props) {
  return (
    <Svg
      height={80}
      width={80}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      fill="#000"
      {...props}
    >
      <Path
        d="M0 256c0 141.384 114.615 256 256 256l22.261-256L256 0C114.615 0 0 114.615 0 256z"
        fill="#F42A41"
      />
      <Path
        d="M256 0v512c141.384 0 256-114.616 256-256S397.384 0 256 0z"
        fill="#F42A41"
      />
      <Path
        d="M161.555 114.333L114.333 161.555 208.778 256 114.333 350.445 161.555 397.667 256 303.222 278.261 256 256 208.778z"
        fill="#fff"
      />
      <Path
        d="M397.667 161.555L350.445 114.333 256 208.778 256 303.222 350.445 397.667 397.667 350.445 303.222 256z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ErrorIcon;
