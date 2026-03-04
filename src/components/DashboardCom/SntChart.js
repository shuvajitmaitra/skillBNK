import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomPieChart from '../SharedComponent/CustomPieChart';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

const convertDataToPercentage = data => {
  const total = data?.acceptedItems + data?.rejectedItems + data?.pendingItems;
  const Colors = useTheme();

  if (!total || total === 0) {
    return [
      {
        key: 1,
        value: 100,
        svg: {fill: Colors.Gray2},
      },
    ];
  }

  const fields = [
    {key: 'rejectedItems', color: '#F34141'},
    {key: 'acceptedItems', color: '#5DB34C'},
    {key: 'pendingItems', color: '#F90'},
  ];

  return fields
    .map((field, index) => ({
      key: index + 1,
      value: (data[field.key] / total) * 100,
      svg: {fill: field.color},
    }))
    ?.filter(item => item.value > 0);
};

const SntChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const showTell = useSelector(
    state => state.dashboard?.dashboardData?.showTell?.results,
  );

  const pieData = convertDataToPercentage(showTell);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Show N Tell</Text>
      </View>

      <CustomPieChart pieData={pieData} />

      <View style={styles.legendContainer}>
        <LegendItem
          color={Colors.Primary}
          label="Accepted"
          value={showTell?.acceptedItems}
          styles={styles}
        />
        <LegendItem
          color="#F90"
          label="Pending"
          value={showTell?.pendingItems}
          styles={styles}
        />
        <LegendItem
          color="#F34141"
          label="Rejected"
          value={showTell?.rejectedItems}
          styles={styles}
        />
      </View>
    </View>
  );
};

const LegendItem = ({color, label, value, styles}) => (
  <View style={styles.itemContainer}>
    <View style={styles.legendContent}>
      <View style={[styles.colorBox, {backgroundColor: color}]} />
      <Text style={styles.legendName}>{label}</Text>
    </View>
    <Text style={styles.legendValue}>{value}</Text>
  </View>
);

export default SntChart;

const getStyles = Colors =>
  StyleSheet.create({
    legendValue: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
    },
    legendName: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      gap: 5,
      minWidth: responsiveScreenWidth(35),
      marginBottom: responsiveScreenHeight(1),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    colorBox: {
      width: 15,
      height: 15,
      borderRadius: 4,
    },
    legendContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
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
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });
