import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

const CrossCircle: React.FC<TIcons> = ({color, size, ...props}) => {
  const Colors = useTheme();
  const iconSize = size || 24;

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 28 28"
      fill="none"
      {...props}>
      <G filter="url(#filter0_b_3125_7899)">
        <Circle
          cx={14}
          cy={14}
          r={14}
          fill={color || Colors.BodyText}
          fillOpacity={0.1}
        />
      </G>
      <Path
        d="M17.92 10.64l-7.28 7.28M17.922 17.92l-7.28-7.28"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Defs />
    </Svg>
  );
};

export default CrossCircle;
