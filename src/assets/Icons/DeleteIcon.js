import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const DeleteIcon = ({ color, ...props }) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconColor = color || Colors.BodyText;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="m12.283 7.5-.288 7.5m-3.99 0-.288-7.5m8.306-2.675c.285.044.569.09.852.139m-.852-.138-.89 11.569a1.875 1.875 0 0 1-1.87 1.73H6.737a1.875 1.875 0 0 1-1.87-1.73l-.89-11.57m12.046 0a40.086 40.086 0 0 0-2.898-.33m-10 .468c.283-.05.567-.095.852-.138m0 0a40.091 40.091 0 0 1 2.898-.33m6.25 0V3.73c0-.983-.758-1.803-1.742-1.834a43.3 43.3 0 0 0-2.766 0c-.984.03-1.742.852-1.742 1.834v.764m6.25 0c-2.08-.161-4.17-.161-6.25 0"
      />
    </Svg>
  );
};
export default DeleteIcon;
