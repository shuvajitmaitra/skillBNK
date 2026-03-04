import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const MessageIcon = ({color}: TIcons) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg width={20} height={20} fill="none">
      <G
        stroke={color || Colors.BodyText}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#a)">
        <Path
          strokeMiterlimit={10}
          strokeWidth={1.5}
          d="M7.085 15.834h-.417c-3.333 0-5-.834-5-5V6.667c0-3.333 1.667-5 5-5h6.667c3.333 0 5 1.667 5 5v4.167c0 3.333-1.667 5-5 5h-.417a.845.845 0 0 0-.667.333l-1.25 1.667c-.55.733-1.45.733-2 0l-1.25-1.667c-.133-.183-.441-.333-.666-.333Z"
        />
        <Path
          strokeWidth={2}
          d="M13.328 9.167h.008m-3.343 0h.009m-3.342 0h.007"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default MessageIcon;
