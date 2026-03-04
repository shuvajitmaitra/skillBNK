import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';
import {TIcons} from '../../types';
import {useTheme} from '../../context/ThemeContext';

function PlusCircle({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  const iconColor = color || Colors.Primary;
  const iconSize = size || 16;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <G
        clipPath="url(#clip0_538_4107)"
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}>
        <Path d="M7.999 14.667a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM8 5.334v5.333M5.332 8h5.333" />
      </G>
      <Defs>
        <ClipPath id="clip0_538_4107">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PlusCircle;
