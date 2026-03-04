import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const CopyIcon = ({color, size, ...props}: TIcons) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg width={size || 20} height={size || 20} fill="none" {...props}>
      <Path
        stroke={color || Colors.BodyText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.335 10.75v3.5c0 2.917-1.167 4.084-4.084 4.084h-3.5c-2.916 0-4.083-1.167-4.083-4.084v-3.5c0-2.916 1.167-4.083 4.083-4.083h3.5c2.917 0 4.084 1.167 4.084 4.083Z"
      />
      <Path
        stroke={color || Colors.BodyText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.335 5.75v3.5c0 2.917-1.167 4.084-4.084 4.084h-.916V10.75c0-2.916-1.167-4.083-4.084-4.083H6.668V5.75c0-2.916 1.167-4.083 4.083-4.083h3.5c2.917 0 4.084 1.167 4.084 4.083Z"
      />
    </Svg>
  );
};
export default CopyIcon;
