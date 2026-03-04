import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ShareIcon({size, color, ...props}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  const iconColor = color || Colors.BodyText;
  const iconSize = size || 20;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M15 6.667a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM5 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM15 18.333a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7.158 11.258l5.692 3.317M12.842 5.425L7.158 8.742"
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ShareIcon;
