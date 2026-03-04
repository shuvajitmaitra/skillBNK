import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Plus({size, color, ...props}: {size?: number; color?: string}) {
  return (
    <Svg
      width={size || 18}
      height={size || 17}
      viewBox="0 0 18 17"
      fill="none"
      {...props}>
      <G filter="url(#filter0_b_3694_9622)">
        <Circle
          cx={8.99994}
          cy={8.73529}
          r={8.23529}
          fill={color || '#27AC1F'}
          fillOpacity={0.1}
        />
      </G>
      <Path
        d="M11.725 8.99h-5.45M9.003 11.72V6.27"
        stroke={color || '#27AC1F'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Defs />
    </Svg>
  );
}

export default Plus;
