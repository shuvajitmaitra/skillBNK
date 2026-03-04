import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {Calendar} from 'react-native-calendars';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import UpArrowIcon from '../../assets/Icons/UpArrowIcon';
import DownArrowIcon from '../../assets/Icons/DownArrowIcon';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import moment from 'moment';
import {TColors} from '../../types';
import {showToast} from '../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../constants/ToastConfig';
import {MaterialIcon} from '../../constants/Icons';

const convertToISOString = (
  dateStr: string,
  hour: string,
  minute: string,
  period: string,
): string => {
  // Validate inputs
  if (!dateStr || !hour || !minute || !period) {
    throw new Error(
      'All parameters (dateStr, hour, minute, period) are required',
    );
  }

  // Ensure hour and minute are properly formatted
  const hourNum = parseInt(hour, 10);
  const minuteNum = parseInt(minute, 10);

  if (
    isNaN(hourNum) ||
    isNaN(minuteNum) ||
    hourNum < 0 ||
    hourNum > 12 ||
    minuteNum < 0 ||
    minuteNum > 59
  ) {
    throw new Error('Invalid hour or minute value');
  }

  if (period !== 'AM' && period !== 'PM') {
    throw new Error('Period must be either "AM" or "PM"');
  }

  // Construct the time string in 12-hour format
  const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(
    2,
    '0',
  )} ${period}`;

  // Combine date and time, then parse with moment
  const dateTimeStr = `${dateStr} ${timeStr}`;
  const momentDate = moment(dateTimeStr, 'YYYY-MM-DD hh:mm A');

  // Check if the date is valid
  if (!momentDate.isValid()) {
    throw new Error('Invalid date or time format');
  }

  // Convert to ISO string (UTC)
  return momentDate.toISOString();
};
interface CustomTimePickerProps {
  mode?: 'date' | 'time' | 'dateTime'; // You can extend with more modes if needed.
  setDate?: (date: string) => void;
  setTime?: (time: string) => void;
  time?: string;
  setIsPickerVisible?: (visible: boolean) => void;
  isPickerVisible?: boolean;
  showPreviousDate?: boolean;
  initialDate?: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  mode = 'date',
  setDate = () => {},
  setTime = () => {},
  time = moment().format('hh:mm A'),
  setIsPickerVisible = () => {},
  isPickerVisible = false,
  showPreviousDate = false,
  initialDate = moment().format('YYYY-MM-DD'),
}) => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);

  // Format the provided time
  const formattedTime: string = moment(time, ['h:mm A']).format('hh:mm A');

  // Calculate initial values
  const initialHour: string = moment(formattedTime, 'hh:mm A').format('h');
  const initialMinute: number =
    (Math.ceil(moment(formattedTime, 'hh:mm A').minute() / 15) * 15) % 60;
  const initialPeriod: string = moment(formattedTime, 'hh:mm A').format('A');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [hourIndex, setHourIndex] = useState<number>(
    parseInt(initialHour, 10) - 1,
  );
  const [minuteIndex, setMinuteIndex] = useState<number>(initialMinute / 15);
  const [periodIndex, setPeriodIndex] = useState<number>(
    initialPeriod === 'AM' ? 0 : 1,
  );

  const today: string = new Date().toISOString().split('T')[0];
  const hours: number[] = Array.from({length: 12}, (_, i) => i + 1);
  const minutes: string[] = ['00', '15', '30', '45'];
  const periods: string[] = ['AM', 'PM'];

  const incrementIndex = useCallback(
    (index: number, length: number) => (index + 1) % length,
    [],
  );
  const decrementIndex = useCallback(
    (index: number, length: number) => (index - 1 + length) % length,
    [],
  );

  const handleHourUp = useCallback(() => {
    setHourIndex(prevIndex => incrementIndex(prevIndex, hours.length));
  }, [incrementIndex, hours.length]);

  const handleHourDown = useCallback(() => {
    setHourIndex(prevIndex => decrementIndex(prevIndex, hours.length));
  }, [decrementIndex, hours.length]);

  const handleMinuteUp = useCallback(() => {
    setMinuteIndex(prevIndex => incrementIndex(prevIndex, minutes.length));
  }, [incrementIndex, minutes.length]);

  const handleMinuteDown = useCallback(() => {
    setMinuteIndex(prevIndex => decrementIndex(prevIndex, minutes.length));
  }, [decrementIndex, minutes.length]);

  const handlePeriodUp = useCallback(() => {
    setPeriodIndex(prevIndex => incrementIndex(prevIndex, periods.length));
  }, [incrementIndex, periods.length]);

  const handlePeriodDown = useCallback(() => {
    setPeriodIndex(prevIndex => decrementIndex(prevIndex, periods.length));
  }, [decrementIndex, periods.length]);

  useEffect(() => {
    // Update indices when time or picker visibility changes.
    const format = moment(time, ['h:mm A']).format('hh:mm A');
    const initHour = moment(format, 'hh:mm A').format('h');
    const initMinute =
      (Math.ceil(moment(format, 'hh:mm A').minute() / 15) * 15) % 60;
    const initPeriod = moment(format, 'hh:mm A').format('A');

    setHourIndex(parseInt(initHour, 10) - 1);
    setMinuteIndex(initMinute / 15);
    setPeriodIndex(initPeriod === 'AM' ? 0 : 1);
  }, [time, isPickerVisible]);
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  return (
    <ReactNativeModal isVisible={isPickerVisible}>
      <View style={styles.modalContainer}>
        <ModalBackAndCrossButton
          toggleModal={() => {
            setIsPickerVisible(false);
            setHourIndex(0);
            setMinuteIndex(0);
            setPeriodIndex(0);
          }}
        />
        {mode !== 'time' && (
          <Calendar
            initialDate={
              initialDate ? initialDate : moment().format('YYYY-MM-DD')
            }
            renderArrow={(direction: 'left' | 'right') =>
              direction === 'left' ? (
                <MaterialIcon
                  name="chevron-left"
                  size={30}
                  color={Colors.BodyText}
                />
              ) : (
                <MaterialIcon
                  name="chevron-right"
                  size={30}
                  color={Colors.BodyText}
                />
              )
            }
            theme={{
              calendarBackground: Colors.Background_color,
              selectedDayBackgroundColor: Colors.Primary,
              selectedDayTextColor: Colors.PureWhite,
              todayTextColor: Colors.Primary,
              todayBackgroundColor: Colors.PrimaryOpacityColor,
              dayTextColor: Colors.Heading,
              textDisabledColor: Colors.datePickerDisableTextColor,
              arrowColor: 'red',
              monthTextColor: Colors.Heading,
              textSectionTitleColor: Colors.Heading,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
            }}
            arrowVisibility={true}
            enableSwipeMonths={true}
            disableMonthChange={true}
            onDayPress={(day: {dateString: string}) => {
              setSelectedDate(day.dateString);

              // if (setDate) {
              //   setDate(day.dateString);
              // }
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
              },
            }}
            minDate={showPreviousDate ? undefined : today}
          />
        )}
        {mode !== 'date' && (
          <View
            style={[
              styles.timePickerContainer,
              {marginTop: responsiveScreenHeight(2)},
            ]}>
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handleHourUp}
                style={styles.arrowButton}>
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{hours[hourIndex]}</Text>
              <TouchableOpacity
                onPress={handleHourDown}
                style={styles.arrowButton}>
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handleMinuteUp}
                style={styles.arrowButton}>
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{minutes[minuteIndex]}</Text>
              <TouchableOpacity
                onPress={handleMinuteDown}
                style={styles.arrowButton}>
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
            <View style={styles.hourContainer}>
              <TouchableOpacity
                onPress={handlePeriodUp}
                style={styles.arrowButton}>
                <UpArrowIcon size={13} />
              </TouchableOpacity>
              <Text style={styles.time}>{periods[periodIndex]}</Text>
              <TouchableOpacity
                onPress={handlePeriodDown}
                style={styles.arrowButton}>
                <DownArrowIcon size={20} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.buttonTopContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setIsPickerVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: Colors.Primary}]}
            onPress={() => {
              if (!selectedDate && mode === 'dateTime') {
                return showToast({
                  message: 'Please select date',
                });
              }
              setIsPickerVisible(false);
              if (setDate && mode !== 'time') {
                setDate(selectedDate);
              }
              if (setTime && mode !== 'date') {
                setTime(
                  `${hours[hourIndex]}:${minutes[minuteIndex]} ${periods[periodIndex]}`,
                );
              }

              if (mode === 'dateTime') {
                setTime(
                  convertToISOString(
                    selectedDate,
                    `${hours[hourIndex]}`,
                    minutes[minuteIndex],
                    periods[periodIndex],
                  ),
                );
                setDate(
                  convertToISOString(
                    selectedDate,
                    `${hours[hourIndex]}`,
                    minutes[minuteIndex],
                    periods[periodIndex],
                  ),
                );
              }

              setHourIndex(0);
              setMinuteIndex(0);
              setPeriodIndex(0);
            }}>
            <Text style={[styles.buttonText, {color: Colors.PureWhite}]}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    time: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      margin: 10,
      textAlign: 'center',
    },
    timePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      borderRadius: 7,
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(1),
    },
    buttonTopContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 15,
    },
    arrowButton: {
      padding: 10,
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      width: '50%',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.3),
      borderRadius: 7,
    },
    timeText: {
      color: Colors.BodyText,
      textAlign: 'justify',
    },
    hourContainer: {
      backgroundColor: Colors.ModalBoxColor,
      maxHeight: responsiveScreenHeight(38),
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    modalContainer: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 20,
    },
  });

export default CustomTimePicker;
