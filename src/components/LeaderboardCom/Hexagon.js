import React from 'react';
import {View} from 'react-native';
import Svg, {Path, Text} from 'react-native-svg';

const Hexagon = ({color = '#000000', number = '0', size = 70}) => {
  // Reduce width by scaling x-coordinates (e.g., 80% of original width)
  const widthScale = 0.8;
  const points = [
    {x: size * 0.5 * widthScale, y: 0}, // Top
    {x: size * widthScale, y: size * 0.25}, // Top-right
    {x: size * widthScale, y: size * 0.75}, // Bottom-right
    {x: size * 0.5 * widthScale, y: size}, // Bottom
    {x: 0, y: size * 0.75}, // Bottom-left
    {x: 0, y: size * 0.25}, // Top-left
  ];

  // Create the SVG path
  const path =
    points
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command}${point.x},${point.y}`;
      })
      .join(' ') + 'Z';

  return (
    <View>
      <Svg
        width={size * widthScale}
        height={size}
        viewBox={`0 0 ${size * widthScale} ${size}`}>
        <Path d={path} fill={color} />
        <Text
          x={size * widthScale * 0.5}
          y={size * 0.55}
          fontSize={size * 0.3}
          fontWeight={700}
          fill="#FFFFFF"
          textAnchor="middle"
          alignmentBaseline="middle">
          {number}
        </Text>
      </Svg>
    </View>
  );
};

export default Hexagon;
