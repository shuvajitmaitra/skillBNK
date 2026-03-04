import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function MenuIcon({size, ...props}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <Svg
      width={size || 16}
      height={size || 14}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M.5 1.167c0-.46.373-.834.833-.834h13.334a.833.833 0 010 1.667H1.333A.833.833 0 01.5 1.167zM.5 7c0-.46.373-.833.833-.833h8.334a.833.833 0 010 1.666H1.333A.833.833 0 01.5 7zm0 5.833c0-.46.373-.833.833-.833h13.334a.833.833 0 010 1.667H1.333a.833.833 0 01-.833-.834z"
        fill={Colors.BodyText}
      />
    </Svg>
  );
}

export default MenuIcon;
