import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const EditIconTwo = ({color, ...props}: TIcons) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  const iconColor = color || Colors.BodyText;
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.166 1.667H7.499c-4.166 0-5.833 1.666-5.833 5.833v5c0 4.166 1.667 5.833 5.833 5.833h5c4.167 0 5.834-1.666 5.834-5.833v-1.667"
      />
      <Path
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M13.367 2.517 6.801 9.084c-.25.25-.5.741-.55 1.1l-.358 2.508c-.134.908.508 1.541 1.416 1.416l2.509-.358c.35-.05.841-.3 1.1-.55l6.566-6.566c1.133-1.134 1.667-2.45 0-4.117-1.667-1.667-2.983-1.133-4.117 0Z"
      />
      <Path
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M12.426 3.458a5.954 5.954 0 0 0 4.116 4.117"
      />
    </Svg>
  );
};
export default EditIconTwo;
