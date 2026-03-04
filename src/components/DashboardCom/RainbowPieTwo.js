import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import {
  Text,
  G,
  Circle,
  Filter,
  FeGaussianBlur,
  FeOffset,
  FeBlend,
  Defs,
} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {Text as SvgText} from 'react-native-svg';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const RainbowPieTwo = ({data}) => {
  const Colors = useTheme();

  const totalValue = data?.reduce((sum, item) => sum + item.value, 0);

  // Create a custom label decorator for showing percentage
  const Labels = ({slices}) => {
    return slices.map((slice, index) => {
      const {pieCentroid, data} = slice;
      const percentage = ((data.value / totalValue) * 100).toFixed(0);

      // Check if pieCentroid contains valid coordinates
      if (!pieCentroid || isNaN(pieCentroid[0]) || isNaN(pieCentroid[1])) {
        console.error('Invalid pieCentroid', pieCentroid); // Debugging output
        return null; // Skip rendering this label if pieCentroid is invalid
      }

      return (
        <G key={index}>
          <SvgText
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={Colors.Foreground}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={responsiveFontSize(1.2)}>
            {`${percentage}%`}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <PieChart
      style={{height: 280}}
      data={data}
      valueAccessor={({item}) => item.value}
      outerRadius="100%"
      innerRadius="78%"
      startAngle={-Math.PI / 2} // Start at the top
      endAngle={Math.PI / 2} // End at the bottom
      padAngle={0.02}
      animate
      labelRadius={90}>
      <Labels />
      <Circle
        filter="url(#shadow)"
        cx={0}
        cy={-20}
        r={50}
        fill={Colors.PrimaryOpacityColor}
        stroke={Colors.ModalBoxColor}
        strokeOpacity={1}
        strokeWidth={10}
      />
      <SvgText
        x="0"
        y={-20}
        fill={Colors.Heading}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={22}
        stroke={Colors.Heading}
        strokeWidth={1}>
        {'100%'}
      </SvgText>
    </PieChart>
  );
};

export default RainbowPieTwo;
