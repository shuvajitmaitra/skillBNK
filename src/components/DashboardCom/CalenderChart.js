import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import CalendarProgressCart from '../progress/CalendarProgressCart';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import axiosInstance from '../../utility/axiosInstance';

export default function CalenderChart() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [selectedOption, setSelectedOption] = useState('Weekly');
  const option = ['Weekly', 'Monthly'];

  const {calendar} = useSelector(state => state.dashboard);
  const progressData = [
    {
      title: 'Accepted',
      value:
        (calendar?.total ?? 0) -
        (calendar?.upcoming ?? 0) -
        (calendar?.recurrent ?? 0),
      percentage:
        ((calendar?.total -
          (calendar?.upcoming ?? 0) -
          (calendar?.recurrent ?? 0)) /
          calendar?.total) *
          100 || 0,
      color: Colors.Primary,
    },
    {
      title: 'Denied',
      value: calendar?.recurrent ?? 0,
      percentage: (calendar?.recurrent / calendar?.total) * 100 || 0,
      color: Colors.Red,
    },
    {
      title: 'Pending',
      value: calendar?.upcoming ?? 0,
      percentage: (calendar?.upcoming / calendar?.total) * 100 || 0,
      color: '#FFB800',
    },
    {
      title: 'Total Finished',
      value: calendar?.finished ?? 0,
      percentage: (calendar?.finished / calendar?.total) * 100 || 0,
      color: Colors.Primary,
    },
  ];

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View>
        <FlatList
          nestedScrollEnabled
          data={progressData}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between', gap: 10}}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => (
            <CalendarProgressCart
              title={item.title}
              value={item.value.toString()}
              percentage={item.percentage}
              color={item.color}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bottom: {
      marginTop: responsiveScreenHeight(2),
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
