import React, {useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {StackedBarChart, YAxis} from 'react-native-svg-charts';
import {Text as SVGText, G, Line} from 'react-native-svg';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useSelector} from 'react-redux';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import Divider from '../SharedComponent/Divider';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {gGap} from '../../constants/Sizes';

// Custom Legend Component
const CustomLegend = ({colors}) => {
  const Colors = useTheme();
  const styles = getLegendStyles(Colors);
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: colors[0]}]} />
        <Text style={styles.legendLabel}>Completed</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: colors[1]}]} />
        <Text style={styles.legendLabel}>Incomplete</Text>
      </View>
    </View>
  );
};

// Main BootCampChart Component
const BootCampChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const bootcamp = useSelector(state => state.dashboard?.bootcamp) || [];

  const [selectedOption, setSelectedOption] = useState('Weekly');
  const options = ['Weekly', 'Monthly'];

  // Early return for loading state
  if (!bootcamp) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  // Early return if bootcamp is not an array or is empty
  if (!Array.isArray(bootcamp) || bootcamp.length === 0) {
    return (
      <View style={styles.container}>
        <NoDataAvailable />
      </View>
    );
  }

  // Transform bootcamp data
  const transformedData = bootcamp.map(item => ({
    category: item?.category?.name || 'Unknown',
    completed:
      item?.totalItems > 0
        ? (item?.completedItems / item?.totalItems) * 100
        : 0,
    incomplete:
      item?.totalItems > 0
        ? (item?.incompletedItems / item?.totalItems) * 100
        : 0,
    label: item?.category?.name?.split(' ')[0] || 'Unknown',
  }));

  const colors = ['#5DB34C', '#FF5454'];
  const keys = ['completed', 'incomplete'];
  const yAxisData = [0, 20, 40, 60, 80, 100];

  // Labels for percentages
  const Labels = ({x, y, bandwidth, data}) =>
    data.map((item, index) => {
      const completedY = y(item.completed) + 10;
      const incompleteY = y(item.completed + item.incomplete) + 10;
      return (
        <G key={index}>
          <SVGText
            x={x(index) + bandwidth / 2.5}
            y={isNaN(completedY) ? 0 : completedY}
            fontFamily={CustomFonts.REGULAR}
            fontSize={responsiveScreenFontSize(1.4)}
            fill={Colors.PureWhite}
            alignmentBaseline="middle"
            textAnchor="middle">
            {`${item.completed.toFixed(0)}%`}
          </SVGText>
          <SVGText
            x={x(index) + bandwidth / 2.5}
            y={isNaN(incompleteY) ? 0 : incompleteY}
            fontFamily={CustomFonts.REGULAR}
            fontSize={responsiveScreenFontSize(1.4)}
            fill={Colors.PureWhite}
            alignmentBaseline="middle"
            textAnchor="middle">
            {`${item.incomplete.toFixed(0)}%`}
          </SVGText>
        </G>
      );
    });

  // Labels for categories
  const TextLabels = ({x, y, bandwidth, data}) =>
    data.map((item, index) => (
      <G key={index}>
        <SVGText
          x={x(index) + bandwidth / 1.8}
          y={y(0) + 30}
          fontFamily={CustomFonts.REGULAR}
          fontSize={responsiveScreenFontSize(1.4)}
          fill={Colors.PureWhite}
          alignmentBaseline="middle"
          textAnchor="middle">
          {item.label}
        </SVGText>
      </G>
    ));

  // Custom grid lines
  const CustomGrid = ({x, y, ticks}) => (
    <G>
      {ticks.map(tick => (
        <Line
          key={tick}
          x1="0%"
          x2="100%"
          y1={y(tick)}
          y2={y(tick)}
          stroke={Colors.ForegroundOpacityColor}
          strokeDasharray={[4, 4]}
          strokeWidth={1}
        />
      ))}
    </G>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.heading}>Bootcamps</Text>
        {/* Uncomment if dropdown is needed */}
        {/* <CustomDropDownTwo
          data={options}
          state={selectedOption}
          setState={setSelectedOption}
        /> */}
      </View>
      <CustomLegend colors={colors} />
      <View style={{height: responsiveScreenHeight(30), flexDirection: 'row'}}>
        <YAxis
          data={yAxisData}
          contentInset={{top: 12, bottom: responsiveScreenHeight(5)}}
          svg={{
            fill: Colors.Heading,
            fontSize: responsiveScreenFontSize(1.6),
            fontFamily: CustomFonts.MEDIUM,
          }}
          formatLabel={value => `${value}%`}
          numberOfTicks={yAxisData.length}
          min={0}
          max={100}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <StackedBarChart
            style={{flex: 1}}
            data={transformedData}
            keys={keys}
            colors={colors}
            showGrid={false}
            contentInset={{top: 10, bottom: responsiveScreenHeight(5)}}
            spacingInner={0.4}
            spacingOuter={0.2}
            horizontal={false}>
            <CustomGrid belowChart={true} ticks={yAxisData} />
            <Labels />
            <TextLabels />
          </StackedBarChart>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          // marginTop: 10,
          gap: gGap(10),
        }}>
        {bootcamp.map((item, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.title}>
              {item?.category?.name || 'Untitled'}
            </Text>
            <Divider marginBottom={1} marginTop={1} />
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Total Items</Text>
              <Text style={styles.text}>{item?.totalItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Completed</Text>
              <Text style={styles.text}>{item?.completedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Incomplete</Text>
              <Text style={styles.text}>{item?.incompletedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Pinned</Text>
              <Text style={styles.text}>{item?.pinnedItems || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
    },
    dataContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 2,
    },
    box: {
      padding: 10,
      backgroundColor: Colors.Background_color, // Fixed to consistent naming
      borderRadius: responsiveScreenWidth(2),
      width: '48%',
      // marginHorizontal: responsiveScreenWidth(1)
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD, // Fixed typo (SEMI_BOTH -> SEMI_BOLD)
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      textAlign: 'center',
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: 10,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD, // Fixed typo (SEMI_BOTH -> SEMI_BOLD)
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });

const getLegendStyles = Colors =>
  StyleSheet.create({
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: responsiveScreenHeight(1),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: responsiveScreenWidth(3),
    },
    legendColor: {
      width: 15,
      height: 15,
      borderRadius: 5,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
  });

export default BootCampChart;
