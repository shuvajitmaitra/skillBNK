import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function CheckMarkIcon({color, size, ...props}: TIcons) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  const iconSize = size || 15;
  const iconColor = color || Colors.PureWhite;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <G fill={iconColor}>
        <Path d="M15.374 5.986l-5 9c-.647 1.165-2.396.194-1.748-.972l5-9c.647-1.165 2.396-.194 1.748.972z" />
        <Path d="M5.125 9.72l5 4c1.04.832-.209 2.394-1.25 1.56l-5-4c-1.04-.832.209-2.394 1.25-1.56z" />
      </G>
    </Svg>
  );
}

export default CheckMarkIcon;
