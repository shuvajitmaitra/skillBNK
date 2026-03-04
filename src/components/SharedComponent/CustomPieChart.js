import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import {Circle, G, Text} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

const CustomPieChart = ({pieData, showPercentage = true}) => {
  const Colors = useTheme();

  const Labels = ({slices}) => {
    return slices
      .filter(slice => slice.data.value > 0) // Filter out 0% slices
      .map((slice, index) => {
        const {pieCentroid, data} = slice;
        return (
          <G key={index} x={pieCentroid[0]} y={pieCentroid[1]}>
            <Text
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={10}
              stroke="white"
              strokeWidth={0.1}>
              {Math.round(data.value) + '%'}
            </Text>
          </G>
        );
      });
  };

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <PieChart
      style={{height: 200}}
      data={pieData}
      valueAccessor={({item}) => item.value}
      outerRadius="100%"
      innerRadius="60%"
      padAngle={0.02}>
      <Labels />
      {showPercentage && totalValue > 0 && (
        <Circle
          cx={0}
          cy={0}
          r={45}
          fill="none"
          stroke={Colors.Primary}
          strokeOpacity={0.1}
          strokeWidth={7}
        />
      )}
      {showPercentage && totalValue > 0 && (
        <Text
          x="0"
          y="0"
          fill={Colors.Heading}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={22}
          stroke={Colors.Heading}
          strokeWidth={1}>
          {Math.round(totalValue) + '%'}
        </Text>
      )}
    </PieChart>
  );
};

export default React.memo(CustomPieChart);
