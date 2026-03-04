// components/DateTimeSection.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import moment from 'moment';
import CheckIcon from '../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../assets/Icons/UnCheckIcon';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import {IEvent, ITimeRange} from '../../types/calendar/event';

type DateTimeSectionProps = {
  event: Partial<{
    start: string;
    end: string;
    isAllDay: boolean;
    timeRange: ITimeRange;
  }>;
  setEvent: (event: Partial<any>) => void;
  setPickerState: (state: 'dateTime' | 'date' | 'time') => void;
  setTimeMode: (mode: string) => void;
  setIsPickerVisible: (visible: boolean) => void;
};

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  event,
  setEvent,
  setPickerState,
  setTimeMode,
  setIsPickerVisible,
}) => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  // Use default values if fields are missing
  const start = event?.start || moment().toString();
  const end = event?.end || moment().toString();
  const isAllDay = event?.isAllDay ?? false;
  return (
    <View style={styles.dateTimeContainer}>
      <View style={styles.timeDateContainer}>
        <CalendarIconSmall />
        <Text style={styles.timeDateLabel}>Event Time & Date</Text>
      </View>
      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>Start Date:</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerState('date');
            setTimeMode('startDate');
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}>
          <Text style={styles.timeDateText}>
            {moment(start).format('MMM DD, YYYY')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setPickerState('time');
            setTimeMode('startTime');
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}>
          <Text style={styles.timeDateText}>
            {moment(start).format('hh:mm A')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>End Date:</Text>
        <TouchableOpacity
          onPress={() => {
            setPickerState('date');
            setTimeMode('endDate');
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}>
          <Text style={styles.timeDateText}>
            {moment(end).format('MMM DD, YYYY')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setPickerState('time');
            setTimeMode('endTime');
            setIsPickerVisible(true);
          }}
          style={styles.dateTimePicker}>
          <Text style={styles.timeDateText}>
            {moment(end).format('hh:mm A')}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() =>
          setEvent((pre: IEvent) => ({...pre, isAllDay: !isAllDay}))
        }
        style={styles.allDayContainer}>
        {isAllDay ? <CheckIcon color={Colors.Primary} /> : <UnCheckIcon />}
        <Text style={styles.allDayText}>All Day</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateTimeSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    dateTimeContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      gap: 10,
      marginBottom: 10,
      zIndex: 1,
    },
    timeDateContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1.5),
      paddingBottom: 10,
      alignItems: 'center',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    timeDateLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
      gap: 10,
    },
    dateTimeLabel: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    dateTimePicker: {
      backgroundColor: Colors.Foreground,
      paddingVertical: 3,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    timeDateText: {
      color: Colors.SecondaryButtonTextColor,
      fontFamily: CustomFonts.REGULAR,
    },
    allDayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    allDayText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
  });
