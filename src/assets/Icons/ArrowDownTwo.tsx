import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

export function ArrowDownTwo({color, size, ...props}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      width={size || 12}
      height={size || 12}
      viewBox="0 0 12 8"
      fill="none"
      {...props}>
      <Path
        d="M1 1.5l5 5 5-5"
        stroke={color || Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
