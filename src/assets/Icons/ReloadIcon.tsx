import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function ReloadIcon({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg width={size || 20} height={size || 20} viewBox="0 0 24 24" {...props}>
      <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <Path fillRule="nonzero" d="M0 0H24V24H0z" />
        <Path
          d="M4 13a8 8 0 103.755-6.782M9.238 1.898l-1.74 3.941a1 1 0 00.512 1.319l3.94 1.74"
          stroke={color || Colors.PureWhite}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export default ReloadIcon;
