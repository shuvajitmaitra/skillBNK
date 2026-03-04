import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CalendarProgressCart from './CalendarProgressCart';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import Divider from '../SharedComponent/Divider';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';

function transformCalendarDataDynamic(calendar) {
  // Define a mapping of keys to their descriptions
  const keyDescriptions = {
    total: 'Total Event',
    totalAccepted: 'Accepted',
    totalPending: 'Pending',
    totalDenied: 'Denied',
    totalFinished: 'Total Finished',
    totalProposedTime: 'Proposed Times',
  };

  const keys = Object.keys(calendar).slice(1, -1);

  return keys.map(key => ({
    name: keyDescriptions[key] || key, // Default to the key name if no description is found
    key: key,
    value: calendar[key],
  }));
}
function isValidObject(obj) {
  return Object.values(obj).some(value => value !== 0);
}

const CalendarProgress = () => {
  const {calendar} = useSelector(state => state.dashboard);

  const navigation = useNavigation();
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const data = ['Day', 'Week', 'Month', 'Year'];
  // console.log("calendar.results", JSON.stringify(calendar.results, null, 1));
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <Text style={styles.HeadingText}>Calendar</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MyCalenderStack', {screen: 'MyCalender'})
            }>
            <ArrowTopRight />
          </TouchableOpacity>
        </View>
        {/* <CustomDropDownTwo data={data} state={value} setState={setValue} /> */}
      </View>

      <Divider marginTop={1} marginBottom={1} />
      <View>
        {isValidObject(
          calendar || {
            total: 0,
            finished: 0,
            current: 0,
            upcoming: 0,
            recurrent: 0,
          },
        ) ? (
          <FlatList
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
        ) : (
          <NoDataAvailable />
        )}
      </View>
    </View>
  );
};

export default CalendarProgress;

const getStyles = Colors =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 10,
      // zIndex: -10,
      width: '100%',
    },
    container2: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenHeight(2),
    },
    bottom: {
      marginTop: responsiveScreenHeight(2),
    },
  });
