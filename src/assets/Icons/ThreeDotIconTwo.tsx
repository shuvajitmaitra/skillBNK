import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';
import {useTheme} from '../../context/ThemeContext';

function ThreeDotIconTwo({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 8 24"
      fill="none"
      {...props}>
      <Path
        d="M14.5 4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM12 22.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        fill={color || Colors.BodyText}
      />
    </Svg>
  );
}

export default ThreeDotIconTwo;
