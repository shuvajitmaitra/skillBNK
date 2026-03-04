import * as React from "react";
import Svg, { Path } from "react-native-svg";

function HorizontalLineIcon(props) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M3 11h18a1 1 0 000-2H3a1 1 0 000 2zm18 2H3a1 1 0 000 2h18a1 1 0 000-2z" />
    </Svg>
  );
}

export default HorizontalLineIcon;
