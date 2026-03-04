import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function LeftArrowButtonWithoutTail(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={36}
      height={31}
      viewBox="0 0 36 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={35.5575} height={31} rx={8} fill={Colors.Foreground} />
      <Rect
        x={0.5}
        y={0.5}
        width={34.5575}
        height={30}
        rx={7.5}
        stroke="#000"
        strokeOpacity={0.1}
      />
      <Path
        d="M19.5 11l1.058 1.057-3.436 3.443 3.436 3.442L19.5 20 15 15.5l4.5-4.5z"
        fill={Colors.BodyText}
      />
    </Svg>
  );
}

export default LeftArrowButtonWithoutTail;
