import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function AttachmentIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.385 11.354l8.13-8.583a3.695 3.695 0 015.365 5.082l-8.131 8.583a2.218 2.218 0 01-3.134.085l-.508.536.508-.536a2.217 2.217 0 01-.085-3.134l8.131-8.583a.74.74 0 011.045-.028l.508-.537-.508.537a.739.739 0 01.028 1.045l-6.098 6.437a.74.74 0 001.073 1.016l6.098-6.437a2.217 2.217 0 00-.085-3.134l-.508.536.508-.536a2.218 2.218 0 00-3.133.085L2.457 12.37a3.694 3.694 0 00.142 5.223l.508-.537-.508.537a3.695 3.695 0 005.223-.141l8.13-8.583a5.173 5.173 0 10-7.51-7.115l-8.13 8.583a.74.74 0 001.073 1.016z"
        fill={Colors.BodyText}
      />
    </Svg>
  );
}

export default AttachmentIcon;
