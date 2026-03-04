import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function WarningIcon2({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      fill={color || Colors.Red}
      width={size || 100}
      height={size || 100}
      viewBox="0 0 24 24"
      data-name="Flat Color"
      xmlns="http://www.w3.org/2000/svg"
      className="icon flat-color"
      {...props}>
      <Path
        d="M22.25 17.55L14.63 3.71a3 3 0 00-5.26 0L1.75 17.55A3 3 0 004.38 22h15.24a3 3 0 002.63-4.45z"
        fill={color || Colors.Red}
        opacity={0.3}
      />
      <Path
        d="M11 13V9a1 1 0 012 0v4a1 1 0 01-2 0zm1 2.5a1.5 1.5 0 101.5 1.5 1.5 1.5 0 00-1.5-1.5z"
        fill={color || Colors.Red}
      />
    </Svg>
  );
}

export default WarningIcon2;
