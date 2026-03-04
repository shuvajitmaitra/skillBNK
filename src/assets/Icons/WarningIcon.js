import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function WarningIcon({size, color, ...props}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconSize = size || 25;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={'red'}>
      <Path
        fill={color || Colors.Red}
        d="M512 64a448 448 0 110 896 448 448 0 010-896zm0 192a58.432 58.432 0 00-58.24 63.744l23.36 256.384a35.072 35.072 0 0069.76 0l23.296-256.384A58.432 58.432 0 00512 256zm0 512a51.2 51.2 0 100-102.4 51.2 51.2 0 000 102.4z"
      />
    </Svg>
  );
}

export default WarningIcon;
