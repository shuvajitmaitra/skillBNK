import * as React from "react";
import Svg, { Path } from "react-native-svg";

function OnlineStatus(props) {
  return (
    <Svg width={15} height={15} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M7.519 2.395a8 8 0 015.12.053 1 1 0 00.66-1.888 10 10 0 106.568 7.812 1 1 0 10-1.974.326A8 8 0 117.52 2.395z" fill="green" />
      <Path
        d="M17.847 4.74a1.125 1.125 0 00-1.694-1.48l-6.208 7.094-2.15-2.15a1.125 1.125 0 00-1.59 1.591l3 3a1.125 1.125 0 001.642-.054l7-8z"
        fill="green"
      />
    </Svg>
  );
}

export default OnlineStatus;
