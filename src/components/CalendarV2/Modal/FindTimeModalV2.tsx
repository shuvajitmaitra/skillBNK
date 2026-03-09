import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {ISchedule, Interval} from '../../../types/calendar/event';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {fontSizes, gGap} from '../../../constants/Sizes';
import {MaterialIcon} from '../../../constants/Icons';
import {Calendar} from 'react-native-calendars';
import {IAvailability} from '../../../types/calendar/availabilities';

type FindTimeProps = {
  isModalVisible: boolean;
  toggleModal: (value: boolean) => void;
  schedule?: ISchedule;
  handleCheckboxToggle: (userId: string, action?: string) => void;
  availabilityData: IAvailability[] | null;
};

const FindTimeModalV2: React.FC<FindTimeProps> = ({
  isModalVisible,
  toggleModal,
  schedule,
  handleCheckboxToggle,
  availabilityData,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const selectedAvailability = useMemo(() => {
    if (!selectedDate || !availabilityData?.length) {
      return null;
    }

    const exactDateMatch = availabilityData.find(item => {
      if (item.type !== 'date' || !item.date) {
        return false;
      }

      return moment(item.date).format('YYYY-MM-DD') === selectedDate;
    });

    if (exactDateMatch) {
      return exactDateMatch;
    }

    const selectedWeekDay = moment(selectedDate).format('dddd').toLowerCase();

    const weekDayMatch = availabilityData.find(item => {
      return (
        item.type === 'wady' && item.wday?.toLowerCase() === selectedWeekDay
      );
    });

    return weekDayMatch || null;
  }, [selectedDate, availabilityData]);

  const intervals = selectedAvailability?.intervals || [];

  return (
    <ReactNativeModal isVisible={isModalVisible}>
      <View style={styles.container}>
        <MaterialIcon
          onPress={() => toggleModal(false)}
          name="cancel"
          style={{position: 'absolute', top: gGap(-10), right: gGap(-10)}}
          size={32}
          color={Colors.BodyText}
        />

        <Text
          style={{
            color: Colors.Heading,
            fontSize: fontSizes.subHeading,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {selectedDate
            ? `Availability for ${moment(selectedDate).format('DD MMM YYYY')}`
            : 'Select a date'}
        </Text>

        <Calendar
          initialDate={moment().format('YYYY-MM-DD')}
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
          enableSwipeMonths={true}
          disableMonthChange={true}
          onDayPress={(day: {dateString: string}) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
          minDate={new Date().toISOString().split('T')[0]}
        />

        {!selectedDate ? (
          <Text style={styles.noAvailabilityText}>Please select a date</Text>
        ) : intervals.length > 0 ? (
          intervals.map((item: Interval) => (
            <View style={styles.timeContainer} key={item._id}>
              <TouchableOpacity style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>
                  {moment(item.from, ['HH:mm', 'h:mm A']).format('hh:mm A')} -{' '}
                  {moment(item.to, ['HH:mm', 'h:mm A']).format('hh:mm A')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleCheckboxToggle(schedule?.userId || '');
                  toggleModal(false);
                }}
                style={[
                  styles.subTimeDateContainer,
                  {
                    backgroundColor: Colors.Primary,
                    borderColor: Colors.Primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.timeDateText,
                    {color: Colors.PrimaryButtonTextColor},
                  ]}>
                  Invite
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noAvailabilityText}>No availability found</Text>
        )}
      </View>
    </ReactNativeModal>
  );
};

export default FindTimeModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeDateText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
    },
    subTimeDateContainer: {
      backgroundColor: Colors.ModalBoxColor,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      maxHeight: responsiveScreenHeight(80),
      padding: gGap(20),
      gap: gGap(10),
    },
    noAvailabilityText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: fontSizes.body,
      marginTop: 10,
    },
  });
