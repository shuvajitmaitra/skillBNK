import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function RefreshIcon(props) {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14.166 15.729C15.9338 14.4411 17.0827 12.3548 17.0827 10.0002C17.0827 6.08815 13.9114 2.91683 9.99935 2.91683H9.58268M9.99935 17.0835C6.08733 17.0835 2.91602 13.9122 2.91602 10.0002C2.91602 7.64555 4.0649 5.55927 5.83268 4.27133M9.16602 18.6668L10.8327 17.0002L9.16602 15.3335M10.8327 4.66683L9.16602 3.00016L10.8327 1.3335"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default RefreshIcon;
