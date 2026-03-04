import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function PlusCircleIcon({color, size}: {color?: string; size?: number}) {
  return (
    <Svg width={size || 14} height={size || 14} viewBox="0 0 14 14" fill="none">
      <G
        clipPath="url(#clip0_403_2472)"
        stroke={color || '#fff'}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M7 12.833A5.833 5.833 0 107 1.167a5.833 5.833 0 000 11.666zM7 4.667v4.666M4.667 7h4.666" />
      </G>
      <Defs>
        <ClipPath id="clip0_403_2472">
          <Path fill={color || '#fff'} d="M0 0H14V14H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PlusCircleIcon;
