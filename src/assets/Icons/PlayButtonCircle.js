import React from 'react';
import Svg, { Circle, Polygon } from 'react-native-svg';

const PlayButtonCircle = ({ size = 50, color = 'green' }) => {
  return (
    <Svg height={size} width={size} viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke={color}
        strokeWidth="8"
        fill="none"
      />
      <Polygon
        points="40,30 70,50 40,70"
        fill={color}
      />
    </Svg>
  );
};

export default PlayButtonCircle;