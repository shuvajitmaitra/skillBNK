import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ArrowRightWithoutTail({color, size, ...props}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  const iconColor = color || Colors.Primary;
  const iconSize = size || 25;

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <G
        clipPath="url(#clip0_429_11254)"
        stroke={iconColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M10 17l5-5M15 12l-5-5" />
      </G>
      <Defs>
        <ClipPath id="clip0_429_11254">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ArrowRightWithoutTail;
