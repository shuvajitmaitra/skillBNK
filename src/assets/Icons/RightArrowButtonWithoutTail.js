import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function RightArrowButtonWithoutTail(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={37}
      height={31}
      viewBox="0 0 37 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        x={0.557495}
        width={35.5575}
        height={31}
        rx={8}
        fill={Colors.Foreground}
      />
      <Rect
        x={1.0575}
        y={0.5}
        width={34.5575}
        height={30}
        rx={7.5}
        stroke="#000"
        strokeOpacity={0.1}
      />
      <Path
        d="M16.615 11l-1.057 1.057 3.434 3.443-3.435 3.442L16.616 20l4.5-4.5-4.5-4.5z"
        fill={Colors.BodyText}
      />
    </Svg>
  );
}

export default RightArrowButtonWithoutTail;
