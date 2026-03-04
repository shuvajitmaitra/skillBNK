import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function ArrowRight({color, size, ...props}: TIcons) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path
        d="M9.89 0L8.816 1.068 12.3 4.543H0v1.514h12.3L8.81 9.532l1.08 1.068 5.325-5.3L9.89 0z"
        fill={color || '#27AC1F'}
      />
    </Svg>
  );
}

export default ArrowRight;
