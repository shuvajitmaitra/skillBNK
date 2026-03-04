import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function DoNotDisturbIcon({color, size, props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="iconify iconify--emojione"
      {...props}>
      <Circle cx={32} cy={32} r={30} fill={color || Colors.Red} />
      <Path fill="#fff" d="M9 26h46v12H9z" />
    </Svg>
  );
}

export default DoNotDisturbIcon;
