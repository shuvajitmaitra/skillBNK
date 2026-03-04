import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function FilterIcon2({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fill={color || Colors.BodyText}
        d="M12 25l6.67 6.67a1 1 0 00.7.29.91.91 0 00.39-.08 1 1 0 00.61-.92V13.08L31.71 1.71a1 1 0 00.21-1.09A1 1 0 0031 0H1a1 1 0 00-.92.62 1 1 0 00.21 1.09l11.38 11.37v11.25A1 1 0 0012 25zM3.41 2h25.18l-10 10a1 1 0 00-.3.71v15.88l-4.66-4.67V12.67a1 1 0 00-.3-.71z"
      />
    </Svg>
  );
}

export default FilterIcon2;
