import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function BusyStatusIcon({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 15}
      height={size || 15}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path d="M16 8A8 8 0 110 8a8 8 0 0116 0z" fill={color || Colors.Red} />
    </Svg>
  );
}

export default BusyStatusIcon;
