import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function ArrowDownThree(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fill={Colors.PureWhite}
        d="M11.178 19.569a.998.998 0 001.644 0l9-13A.999.999 0 0021 5H3a1.002 1.002 0 00-.822 1.569l9 13z"
      />
    </Svg>
  );
}

export default ArrowDownThree;
