import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

function GoToChatIcon(props) {
  return (
    <Svg width={40} height={40} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={15} cy={15} r={15} fill="#27AC1F" fillOpacity={0.1} />
      <Path
        d="M21.666 14.667v2c0 2.666-1.333 4-4 4h-.333c-.207 0-.407.1-.533.266l-1 1.334c-.44.587-1.16.587-1.6 0l-1-1.334a.754.754 0 00-.534-.266h-.333c-2.667 0-4-.667-4-4v-3.334c0-2.666 1.333-4 4-4h4"
        stroke="#27AC1F"
        strokeWidth={1.2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M20 12.667a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z" fill="#27AC1F" />
      <Path
        d="M17.665 15.333h.006M14.997 15.333h.006M12.33 15.333h.006"
        stroke="#27AC1F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GoToChatIcon;
