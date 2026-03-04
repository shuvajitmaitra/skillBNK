import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function PlayIcon({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg width={size || 20} height={size || 20} viewBox="0 0 16 16" {...props}>
      <Path
        d="M2 2.5v11c0 1.5 1.27 1.492 1.27 1.492h.128c.247.004.489-.05.7-.172l9.797-5.597c.433-.243.656-.735.656-1.227 0-.492-.223-.984-.656-1.223L4.098 1.176a1.399 1.399 0 00-.7-.176H3.27S2 1 2 2.5zm0 0"
        fill={color || Colors.PureWhite}
      />
    </Svg>
  );
}

export default PlayIcon;
