import React, {useMemo, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {ISchedule} from '../../../types/calendar/event';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {fontSizes, gGap} from '../../../constants/Sizes';
import {FeatherIcon, MaterialIcon} from '../../../constants/Icons';
import {Calendar} from 'react-native-calendars';
import {IAvailability} from '../../../types/calendar/availabilities';
import CustomFonts from '../../../constants/CustomFonts';

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

  const {wdayData, dateData} = useMemo(() => {
    const wdayAvailability =
      availabilityData?.filter(item => item.type === 'wady') || [];

    const dateAvailability =
      availabilityData?.filter(item => item.type === 'date') || [];

    return {
      wdayData: wdayAvailability,
      dateData: dateAvailability,
    };
  }, [availabilityData]);

  const selectedWeekdayName = moment(selectedDate).format('dddd').toLowerCase();

  const selectedWdayAvailability = useMemo(() => {
    return wdayData.filter(
      item =>
        item.wday?.toLowerCase() === selectedWeekdayName &&
        item.intervals &&
        item.intervals.length > 0,
    );
  }, [wdayData, selectedWeekdayName]);

  const selectedDateAvailability = useMemo(() => {
    return dateData.filter(
      item =>
        item.date &&
        moment(item.date).format('YYYY-MM-DD') === selectedDate &&
        item.intervals &&
        item.intervals.length > 0,
    );
  }, [dateData, selectedDate]);

  const hasAnyAvailability =
    selectedWdayAvailability.length > 0 || selectedDateAvailability.length > 0;

  const renderIntervals = (
    sectionData: IAvailability[],
    sectionTitle: string,
    type: 'wday' | 'date',
  ) => {
    if (!sectionData.length) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>

        {sectionData.map(item =>
          item.intervals.map(interval => (
            <View
              style={styles.timeContainer}
              key={`${type}-${item._id}-${interval._id}`}>
              <TouchableOpacity style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>
                  {moment(interval.from, ['HH:mm', 'h:mm A']).format('hh:mm A')}{' '}
                  - {moment(interval.to, ['HH:mm', 'h:mm A']).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          )),
        )}
      </View>
    );
  };

  return (
    <ReactNativeModal isVisible={isModalVisible}>
      <View style={styles.container}>
        <Pressable style={styles.cancelButton}>
          <FeatherIcon
            onPress={() => toggleModal(false)}
            name="x"
            size={32}
            color={Colors.PureWhite}
          />
        </Pressable>

        <Text style={styles.heading}>
          Availability for {moment(selectedDate).format('DD MMM YYYY')}
        </Text>

        <Calendar
          initialDate={selectedDate}
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
          minDate={moment().format('YYYY-MM-DD')}
        />

        {renderIntervals(
          selectedWdayAvailability,
          `Weekday Availability (${moment(selectedDate).format('dddd')})`,
          'wday',
        )}

        {renderIntervals(
          selectedDateAvailability,
          `Date Specific Availability (${moment(selectedDate).format(
            'DD MMM YYYY',
          )})`,
          'date',
        )}

        {!hasAnyAvailability && (
          <Text style={styles.noAvailabilityText}>No availability found</Text>
        )}
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
    </ReactNativeModal>
  );
};

export default FindTimeModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    cancelButton: {
      backgroundColor: Colors.Red,
      height: 40,
      width: 40,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -10,
      right: -10,
    },
    heading: {
      color: Colors.Heading,
      fontSize: fontSizes.subHeading,
      fontWeight: '600',
      textAlign: 'center',
    },
    sectionContainer: {
      gap: gGap(8),
      marginTop: gGap(8),
    },
    sectionTitle: {
      color: Colors.Heading,
      fontSize: fontSizes.body,
      fontFamily: CustomFonts.MEDIUM,
    },

    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeDateText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      fontFamily: CustomFonts.MEDIUM,
    },
    subTimeDateContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      height: gGap(40),
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
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
