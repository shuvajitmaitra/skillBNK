import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function BinIcon({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  const iconColor = color || Colors.BodyText;
  const iconSize = size || 18;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 16 18"
      fill="none"
      {...props}>
      <Path
        d="M10.283 6.5L9.995 14m-3.99 0l-.288-7.5m8.306-2.675c.285.044.569.09.852.139m-.852-.138l-.89 11.569a1.875 1.875 0 01-1.87 1.73H4.737a1.875 1.875 0 01-1.87-1.73l-.89-11.57m12.046 0a40.086 40.086 0 00-2.898-.33m-10 .468c.283-.05.567-.095.852-.138m0 0a40.091 40.091 0 012.898-.33m6.25 0V2.73c0-.983-.758-1.803-1.742-1.834-.922-.03-1.844-.03-2.766 0-.984.03-1.742.852-1.742 1.834v.764m6.25 0c-2.08-.161-4.17-.161-6.25 0"
        stroke={iconColor}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BinIcon;
