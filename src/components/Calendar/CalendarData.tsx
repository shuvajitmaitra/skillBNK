import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {CalendarItems} from './CalendarItem';
import moment from 'moment';
import {ITotalEvents} from '../../types/calendar/event';
import {TColors} from '../../types';
type CalendarDataProps = {
  data: ITotalEvents[];
  monthData: string[];
};
export const CalendarData = ({data, monthData}: CalendarDataProps) => {
  const isDateBetween = (
    targetDate: string,
    startDate: string,
    endDate: string,
    inclusive = '[]',
  ) => {
    const date = new Date(targetDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (inclusive) {
      case '()':
        return date > start && date < end;
      case '[)':
        return date >= start && date < end;
      case '(]':
        return date > start && date <= end;
      default:
        return date >= start && date <= end;
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const getEventsForWeek = (start: number, end: number) => {
    return data?.filter(item =>
      isDateBetween(item.title, monthData[start], monthData[end]),
    );
  };

  const weeks = [
    {label: 'Week 1', start: 0, end: 6},
    {label: 'Week 2', start: 7, end: 13},
    {label: 'Week 3', start: 14, end: 20},
    {label: 'Week 4', start: 21, end: 27},
    {label: 'Week 5', start: 28, end: 34},
    {label: 'Week 6', start: 35, end: 41},
  ];

  return (
    <View style={styles.calenderTopicContainer}>
      <Text style={styles.heading}>My Events</Text>
      {weeks.map(
        ({label, start, end}, index) =>
          monthData[end] && (
            <View key={index}>
              <View style={styles.weekContainer}>
                <Text style={styles.weekText}>{label}</Text>
                <Text style={styles.weekText}>
                  {moment(monthData[start]).format('DD MMM')} -{' '}
                  {moment(monthData[end]).format('DD MMM')}
                </Text>
              </View>
              <View style={{gap: 10}}>
                {getEventsForWeek(start, end).map((item, idx) => (
                  <CalendarItems key={idx} item={item} />
                ))}
              </View>
            </View>
          ),
      )}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    calenderTopicContainer: {
      paddingVertical: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
    },
    heading: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      marginBottom: 10,
    },
    weekContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(6.5),
      marginBottom: responsiveScreenHeight(0.5),
    },
    weekText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
    },
  });
