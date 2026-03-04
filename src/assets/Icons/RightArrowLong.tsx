import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function RightArrowLong({
  height = 20,
  width = 20,
  color = '',
  size = 20,
  ...props
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconColor = color || Colors.BodyText;
  const iconHeight = height || 20;
  const iconWidth = width || 24;

  return (
    <Svg
      width={size || iconWidth}
      height={size || iconHeight}
      viewBox="0 0 22 8"
      fill="none"
      {...props}>
      <Path
        d="M21.354 4.354a.5.5 0 000-.708L18.172.464a.5.5 0 10-.707.708L20.293 4l-2.828 2.828a.5.5 0 10.707.708l3.182-3.182zM0 4.5h21v-1H0v1z"
        fill={iconColor}
      />
    </Svg>
  );
}

export default RightArrowLong;
