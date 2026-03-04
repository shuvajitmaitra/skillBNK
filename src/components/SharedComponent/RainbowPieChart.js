import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import {Text, Circle} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

const RainbowPieChart = ({total, count}) => {
  const Colors = useTheme();
  const remaining = Math.max(total - count, 0);

  if (count > total) {
    console.warn(
      `Count (${count}) exceeds total (${total}). Adjusting remaining to 0.`,
    );
  }

  const data = [
    {
      key: 1,
      value: remaining,
      svg: {fill: Colors.Primary},
    },
    {
      key: 2,
      value: count,
      svg: {fill: Colors.Red},
    },
  ];

  return (
    <PieChart
      style={{height: 280}}
      data={data}
      valueAccessor={({item}) => item.value}
      outerRadius="100%"
      innerRadius="78%"
      startAngle={-Math.PI / 2} // Start at the top
      endAngle={Math.PI / 2} // End at the bottom
      padAngle={0.02}>
      <Circle
        // Ensure the filter is defined if you plan to use it
        // Otherwise, remove the filter prop
        // filter="url(#shadow)"
        cx={0}
        cy={-20}
        r={50}
        fill={Colors.PrimaryOpacityColor}
        stroke={Colors.ModalBoxColor}
        strokeOpacity={1}
        strokeWidth={10}
      />
      <Text
        x="0"
        y={-20}
        fill={Colors.Heading}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={22}
        stroke={Colors.Heading}
        strokeWidth={1}>
        {'100%'}
      </Text>
    </PieChart>
  );
};

export default RainbowPieChart;
