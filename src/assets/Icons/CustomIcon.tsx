import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function CustomIcon({size, color}: TIcons) {
  return (
    <Svg width={size || 30} height={size || 30} viewBox="0 0 30 30" fill="none">
      <Path
        fill={color || '#17191C'}
        d="M0.138672 0.544434H29.161972V29.567733999999998H0.138672z"
      />
    </Svg>
  );
}

export default CustomIcon;
