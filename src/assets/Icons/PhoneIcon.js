import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const PhoneIcon = (props) => {
  const Colors = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <Path
        stroke={Colors.BodyText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M.875 4.625c0 6.903 5.597 12.5 12.5 12.5h1.875a1.875 1.875 0 0 0 1.875-1.875v-1.143a.937.937 0 0 0-.71-.91l-3.686-.921a.937.937 0 0 0-.977.347l-.809 1.078a.884.884 0 0 1-1.008.316 10.03 10.03 0 0 1-5.953-5.952.884.884 0 0 1 .317-1.008l1.078-.809a.936.936 0 0 0 .347-.977l-.921-3.686a.938.938 0 0 0-.91-.71H2.75A1.875 1.875 0 0 0 .875 2.75v1.875Z"
      />
    </Svg>
  );
};
export default PhoneIcon;
