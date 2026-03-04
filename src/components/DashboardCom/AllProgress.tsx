import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CustomPieChart from '../SharedComponent/CustomPieChart';
import {useSelector} from 'react-redux';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';

const getColorForId = (id: string): string => {
  const colorMap: {[key: string]: string} = {
    showAndTell: '#1E90FF', // Blue
    messages: '#FFA500', // Orange
    uploadedDocuments: '#32CD32', // Green
    events: '#00CED1', // Cyan
    technicalTestAnswers: '#FF4500', // Red
    day2day: '#4169E1', // Dark Blue
  };
  if (!colorMap[id]) {
    const hash =
      Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    return `hsl(${hash}, 70%, 50%)`;
  }
  return colorMap[id] || '#d3d3d3';
};

const AllProgress: React.FC = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {progressData = []} = useSelector(
    (state: RootState) => state.dashboard,
  );

  const legendData = progressData.map(
    (item: {id: string; limit: number; count: number; title: any}) => ({
      key: item.id,
      value:
        item.limit > 0
          ? Number(((item.count / item.limit) * 100).toFixed(0)) > 100
            ? 100
            : Number(((item.count / item.limit) * 100).toFixed(0))
          : 0,
      svg: {fill: getColorForId(item.id)},
      label: item.title,
    }),
  );
  const total = legendData.reduce((sum, item) => sum + item.value, 0);

  const pieData = legendData.map(item => ({
    ...item,
    value: Math.round((item.value / total) * 100 * 100) / 100, // Round to 2 decimal places
  }));

  const isDataAvailable = total > 0;

  // eslint-disable-next-line react/no-unstable-nested-components
  const Legend: React.FC = () => {
    return (
      <View style={styles.legendContainer}>
        {legendData.map(item => (
          <View key={item.key} style={styles.legendItem}>
            <View
              style={[styles.legendColor, {backgroundColor: item.svg.fill}]}
            />
            <View style={styles.legendData}>
              <Text style={styles.legendLabel}>
                {item.label}:{' '}
                <Text style={styles.legendValue}>{item.value}%</Text>
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overall Progress</Text>
        <Text style={styles.subtitle}>
          Your activity distribution across categories
        </Text>
      </View>
      {isDataAvailable ? (
        <>
          {pieData.length === 0 || total === 0 ? (
            <CustomPieChart
              pieData={[{key: 'empty', value: 100, svg: {fill: '#d3d3d3'}}]}
              showPercentage={false}
            />
          ) : (
            <>
              <CustomPieChart pieData={pieData} showPercentage={true} />
              <Legend />
            </>
          )}
        </>
      ) : (
        <NoDataAvailable />
      )}
    </View>
  );
};

export default React.memo(AllProgress);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {},
    titleContainer: {
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: 10,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    subtitle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    legendContainer: {
      marginTop: 10,
      gap: 5,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendData: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    legendColor: {
      width: responsiveScreenWidth(5),
      height: responsiveScreenHeight(2.5),
      marginRight: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(1),
    },
    legendLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    legendValue: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
  });
