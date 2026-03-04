import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function TwitterIcon(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={0.5}
        width={17}
        height={17}
        rx={8.5}
        stroke="#27AC1F"
        strokeOpacity={0.8}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.97 6.56c-.336.15-.696.25-1.074.294.39-.233.683-.601.822-1.034a3.745 3.745 0 01-1.187.454 1.87 1.87 0 00-3.187 1.705A5.308 5.308 0 015.49 6.025a1.869 1.869 0 00.578 2.497 1.863 1.863 0 01-.846-.234v.024a1.871 1.871 0 001.5 1.834 1.872 1.872 0 01-.846.031 1.872 1.872 0 001.748 1.3 3.752 3.752 0 01-2.769.774c.856.55 1.85.841 2.867.84 3.44 0 5.32-2.85 5.32-5.32 0-.081-.001-.162-.005-.242a3.8 3.8 0 00.933-.968"
        fill="#27AC1F"
      />
    </Svg>
  );
}

export default TwitterIcon;
