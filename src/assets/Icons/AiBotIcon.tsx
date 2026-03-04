import * as React from 'react';
import Svg, {Path, Ellipse} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function AiBotIcon({size, color, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg width={size || 30} height={size || 30} viewBox="0 0 24 24" {...props}>
      <Path
        fill={color || Colors.BodyText}
        d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 00-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 001.99 12v2a1 1 0 001 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 001-1v-1.938a1.006 1.006 0 00-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"
      />
      <Ellipse
        fill={color || Colors.BodyText}
        cx={8.5}
        cy={12}
        rx={1.5}
        ry={2}
      />
      <Ellipse
        fill={color || Colors.BodyText}
        cx={15.5}
        cy={12}
        rx={1.5}
        ry={2}
      />
      <Path fill={color || Colors.BodyText} d="M8 16h8v2H8z" />
    </Svg>
  );
}

export default AiBotIcon;
