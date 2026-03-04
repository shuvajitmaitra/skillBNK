import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
export function PlayButtonIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      width={props?.size || 20}
      height={props?.size || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M7.5 18.333h5c4.166 0 5.833-1.666 5.833-5.833v-5c0-4.167-1.666-5.833-5.833-5.833h-5c-4.167 0-5.833 1.666-5.833 5.833v5c0 4.166 1.666 5.833 5.833 5.833z"
        stroke={props?.color || Colors.BodyText}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.583 10V8.767c0-1.592 1.125-2.233 2.5-1.442l1.067.617 1.066.617c1.375.791 1.375 2.091 0 2.883l-1.066.617-1.067.616c-1.375.792-2.5.142-2.5-1.441V10z"
        stroke={props?.color || Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
