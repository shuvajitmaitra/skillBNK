import * as React from "react";
import Svg, { Path } from "react-native-svg";

function DocumentIconThree(props) {
  return (
    <Svg
      width={30}
      height={30}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 505 505"
      xmlSpace="preserve"
      {...props}
    >
      <Path
        d="M505 252.5c0 75.2-32.9 142.8-85.1 189.1-44.5 39.5-103.2 63.4-167.4 63.4s-122.8-23.9-167.4-63.4C32.9 395.3 0 327.7 0 252.5 0 113 113.1 0 252.5 0 392 0 505 113 505 252.5z"
        fill="#84dbff"
      />
      <Path
        d="M179.4 84.2L179.4 137.8 125.9 137.8 125.9 416.9 379.1 416.9 379.1 84.2z"
        fill="#fff"
      />
      <Path d="M179.4 84.2L125.9 137.8 179.4 137.8z" fill="#e6e9ee" />
      <Path d="M157.4 292.4H347V307H157.4z" fill="#e6e9ee" />
      <Path d="M157.4 323.1H347V337.70000000000005H157.4z" fill="#e6e9ee" />
      <Path d="M157.4 353.7H269.7V368.3H157.4z" fill="#e6e9ee" />
      <Path
        d="M293.5 241.7c-22.6 22.6-59.4 22.6-82 0s-22.7-59.4 0-82c11.2-11.2 25.9-16.9 40.7-17l.3 58 58 .3c-.1 14.7-5.7 29.4-17 40.7z"
        fill="#ff7058"
      />
      <Path
        d="M310.5 201l-58-.3-.3-58c15-.1 30 5.6 41.4 17 11.3 11.3 17 26.3 16.9 41.3z"
        fill="#ffd05b"
      />
    </Svg>
  );
}

export default DocumentIconThree;
