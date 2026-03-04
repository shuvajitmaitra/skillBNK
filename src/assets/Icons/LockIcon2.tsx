import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function LockIcon2({color, size, ...props}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 10.055V8a6.75 6.75 0 0113.5 0v2.055c1.115.083 1.84.293 2.371.824C22 11.757 22 13.172 22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16c0-2.828 0-4.243.879-5.121.53-.531 1.256-.741 2.371-.824zM6.75 8a5.25 5.25 0 0110.5 0v2.004C16.867 10 16.451 10 16 10H8c-.452 0-.867 0-1.25.004V8zM8 17a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0z"
        fill={color || Colors.Heading}
      />
    </Svg>
  );
}

export default LockIcon2;
