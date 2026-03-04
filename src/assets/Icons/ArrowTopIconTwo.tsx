import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';
import {useTheme} from '../../context/ThemeContext';

function ArrowTopIconTwo({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 -4.5 20 20"
      {...props}>
      <Path
        d="M223.708 6534.634c.39-.405.39-1.06 0-1.464l-8.264-8.563a1.95 1.95 0 00-2.827 0l-8.325 8.625c-.385.4-.39 1.048-.01 1.454a.976.976 0 001.425.01l7.617-7.893a.975.975 0 011.414 0l7.557 7.83a.974.974 0 001.413 0"
        transform="translate(-260 -6684) translate(56 160)"
        fill={color || Colors.Primary}
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
      />
    </Svg>
  );
}

export default ArrowTopIconTwo;
