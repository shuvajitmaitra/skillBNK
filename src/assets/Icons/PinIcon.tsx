import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function PinIcon({size, colors, ...props}: {size?: number; colors?: string}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconColor = colors || Colors.BodyText;
  const iconSize = size || 16;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path
        d="M9.219 1.127l5.657 5.657-.943.943-.471-.472-2.829 2.829-.471 2.357-.943.942-2.828-2.828-3.3 3.3-.943-.943 3.3-3.3-2.829-2.828.943-.943L5.92 5.37 8.748 2.54l-.472-.471.943-.943zm.471 2.357L6.577 6.598l-1.882.376 4.334 4.334.376-1.882 3.114-3.114L9.69 3.484z"
        fill={iconColor}
      />
    </Svg>
  );
}

export default PinIcon;
