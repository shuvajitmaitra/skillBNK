import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function AddUsers({size, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 10a4.167 4.167 0 100-8.333A4.167 4.167 0 0010 10zM2.842 18.333C2.842 15.108 6.05 12.5 10 12.5c.8 0 1.575.108 2.3.308"
        stroke={Colors.BodyText}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.334 15c0 .267-.034.525-.1.775a3.112 3.112 0 01-.384.942A3.308 3.308 0 0115 18.333a3.267 3.267 0 01-2.216-.858 3.07 3.07 0 01-.634-.758A3.267 3.267 0 0111.667 15 3.332 3.332 0 0115 11.667c.984 0 1.875.425 2.475 1.108A3.32 3.32 0 0118.334 15zM16.242 14.983H13.76M15 13.767v2.491"
        stroke={Colors.BodyText}
        strokeWidth={1.2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default AddUsers;
