import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import RightArrowButtonWithoutTail from '../../assets/Icons/RightArrowButtonWithoutTail';
import LeftArrowButtonWithoutTail from '../../assets/Icons/LeftArrowButtonWithoutTail';
import WeekView from './WeekView';
import moment from 'moment';
import DayView from './DayView';
import {useDispatch, useSelector} from 'react-redux';
import {createIsoTimestamp} from '../HelperFunction';
import {
  setEventDetails,
  setUpdateEventInfo,
  updatePickedDate,
} from '../../store/reducer/calendarReducer';
import ReactNativeModal from 'react-native-modal';
import DayEvent from './DayEvent';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import {RegularFonts} from '../../constants/Fonts';
import {IEvent, ITotalEvents} from '../../types/calendar/event';

//
// Helper Functions & Types
//

const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const monthDays = (year: number): number[] => [
  31,
  isLeapYear(year) ? 29 : 28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

interface MonthCalendar {
  weeks: number[][]; // each week is an array of day numbers
  prevMonth: number;
  nextMonth: number;
  prevYear: number;
  nextYear: number;
}

const generateMonthCalendar = (month: number, year: number): MonthCalendar => {
  const daysInMonth = monthDays(year);
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days: number[] = [];
  // Days from the previous month:
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(daysInMonth[prevMonth] - firstDayOfMonth + i + 1);
  }
  // Days in the current month:
  for (let i = 1; i <= daysInMonth[month]; i++) {
    days.push(i);
  }
  // Fill the remaining cells for the last week:
  for (let i = 1; days.length % 7 !== 0; i++) {
    days.push(i);
  }

  const weeks: number[][] = [];
  while (days.length) {
    weeks.push(days.splice(0, 7));
  }

  return {weeks, prevMonth, nextMonth, prevYear, nextYear};
};

const isHolidayMarked = (
  day: number,
  month: number,
  year: number,
  markedDates: string[],
): {isHoliMarked: boolean} => {
  const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  const value = markedDates.find(item => item === dateString);
  return {isHoliMarked: Boolean(value)};
};

//
// Component Props
//
interface CalendarProps {
  markedDates?: ITotalEvents[]; // e.g. dates in "YYYY-MM-DD" format
  setMonthData: (data: string[]) => void;
  toggleModal: () => void;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
}

//
// Calendar Component
//
const Calendar: React.FC<CalendarProps> = ({
  markedDates = [],
  setMonthData,
  toggleModal,
  seeMoreClicked,
  handleSeeMore,
}) => {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  // You can replace `any` with your own RootState type if available.
  const {holidays, monthViewData} = useSelector((state: any) => state.calendar);
  const {user} = useSelector((state: any) => state.auth);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selected, setSelected] = useState<'day' | 'week' | 'month'>('day');
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [DayOffset, setDayOffset] = useState<number>(0);
  const dispatch = useDispatch();
  console.log('year------------', JSON.stringify(year, null, 2));
  console.log('Month------------', JSON.stringify(month, null, 2));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();

  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const {weeks, prevMonth, nextMonth, prevYear, nextYear} = useMemo(
    () => generateMonthCalendar(month, year),
    [month, year],
  );

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
  });

  useEffect(() => {
    const newMonthData: string[] = [];
    weeks.forEach((week, index) => {
      week.forEach(day => {
        const isCurrentMonth =
          (index === 0 && day > 7) || (index >= 4 && day <= 7) ? false : true;
        const displayMonth = isCurrentMonth
          ? month
          : day > 7
          ? prevMonth
          : nextMonth;
        const displayYear = isCurrentMonth
          ? year
          : day > 7
          ? prevYear
          : nextYear;
        newMonthData.push(`${displayYear}-${displayMonth + 1}-${day}`);
      });
    });
    setMonthData(newMonthData);
  }, [
    weeks,
    month,
    year,
    setMonthData,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
  ]);
  // Navigation handlers
  const handlePrevMonth = () => {
    setMonth(prevMonth);
    setYear(prevMonth === 11 ? year - 1 : year);
    setWeekOffset(0);
  };

  const handleNextMonth = () => {
    setMonth(nextMonth);
    setYear(nextMonth === 0 ? year + 1 : year);
    setWeekOffset(0);
  };

  const handlePrevWeek = () => {
    setWeekOffset(pre => pre - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(pre => pre + 1);
  };

  const handlePrevDay = () => {
    setDayOffset(pre => pre - 1);
  };

  const handleNextDay = () => {
    setDayOffset(pre => pre + 1);
  };

  const eventType = (type: string): string => {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'showNTell':
        return '#619dcc';
      case 'mockInterview':
        return '#f59f9f';
      case 'orientation':
        return '#379793';
      case 'technicalInterview':
        return '#f8a579';
      case 'behavioralInterview':
        return '#0091b9';
      case 'reviewMeeting':
        return '#7ccc84';
      case 'syncUp':
        return '#ff6502';
      case 'other':
        return Colors.OthersColor;
      default:
        return Colors.PrimaryOpacityColor;
    }
  };
  const eventStatus = (status: string): string => {
    return (
      (status === 'accepted' && Colors.ThemeSecondaryColor2) ||
      (status === 'pending' && Colors.ThemeSecondaryColor) ||
      (status === 'rejected' && Colors.ThemeWarningColor) ||
      (status === 'denied' && '#daee8d') ||
      (status === 'finished' && Colors.ThemeAnotherButtonColor) ||
      '#e702d0'
    );
  }; // Render WeekView
  const renderWeekView = () => {
    // const startOfWeek = new Date(year, month, today.getDate() - today.getDay());
    // const weekDays = Array.from({length: 7}).map((_, i) => {
    //   const date = new Date(startOfWeek);
    //   date.setDate(startOfWeek.getDate() + i);
    //   return date;
    // });

    return (
      <WeekView
        // eventStatus={eventStatus}
        weekOffset={weekOffset}
        // weekDays={weekDays}
        markedDates={markedDates}
        toggleModal={toggleModal}
        seeMoreClicked={seeMoreClicked}
        handleSeeMore={handleSeeMore}
      />
    );
  };

  // Render DayView
  const renderDayView = () => {
    return (
      <DayView
        eventType={eventType}
        eventStatus={eventStatus}
        DayOffset={DayOffset}
        markedDates={markedDates}
        toggleModal={toggleModal}
        seeMoreClicked={seeMoreClicked}
        handleSeeMore={handleSeeMore}
      />
    );
  };

  // State to hold events for the popup (assumed to be an array of IEvent)
  const [numberOfEvent, setNumberOfEvent] = useState<IEvent[]>([]);

  return (
    <View style={styles.container}>
      {selected === 'day' && (
        <DayEvent DayOffset={DayOffset} user={user} eventType={eventType} />
      )}
      <View style={styles.navigation}>
        <View style={styles.navigationButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              selected === 'week'
                ? handlePrevWeek
                : selected === 'day'
                ? handlePrevDay
                : handlePrevMonth
            }>
            <LeftArrowButtonWithoutTail />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              selected === 'week'
                ? handleNextWeek
                : selected === 'day'
                ? handleNextDay
                : handleNextMonth
            }>
            <RightArrowButtonWithoutTail />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'month' && styles.clickedStyle,
            ]}
            onPress={() => setSelected('month')}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'month' && styles.clickedStyle,
              ]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'week' && styles.clickedStyle,
            ]}
            onPress={() => setSelected('week')}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'week' && styles.clickedStyle,
              ]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'day' && styles.clickedStyle,
            ]}
            onPress={() => setSelected('day')}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'day' && styles.clickedStyle,
              ]}>
              Day
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {selected === 'month' && (
        <>
          <Text style={styles.monthHeader}>
            {monthName} {year}
          </Text>
          <View style={styles.weekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text
                key={index}
                style={[styles.weekday, day === 'Fri' && {color: Colors.Red}]}>
                {day}
              </Text>
            ))}
          </View>
          {weeks.map((week, index) => (
            <View key={index} style={styles.weekContainer}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth =
                  (index === 0 && day > 7) || (index >= 4 && day <= 7)
                    ? false
                    : true;
                const displayMonth = isCurrentMonth
                  ? month
                  : day > 7
                  ? prevMonth
                  : nextMonth;
                const displayYear = isCurrentMonth
                  ? year
                  : day > 7
                  ? prevYear
                  : nextYear;
                const {isHoliMarked} = isHolidayMarked(
                  day,
                  displayMonth,
                  displayYear,
                  holidays.map((item: any) => item.date.start),
                );

                const data =
                  monthViewData[
                    moment(
                      `${displayYear}-${displayMonth + 1}-${day}`,
                      'YYYY-MM-DD',
                    ).format('YYYY-M-D')
                  ];
                const isToday =
                  todayString === `${displayYear}-${displayMonth + 1}-${day}`;
                const notPastDate =
                  new Date(todayString) <=
                  new Date(`${displayYear}-${displayMonth + 1}-${day}`);

                return (
                  <TouchableOpacity
                    onPress={() =>
                      notPastDate
                        ? (dispatch(
                            updatePickedDate({
                              day: createIsoTimestamp(
                                day,
                                displayMonth + 1,
                                displayYear,
                              ),
                              hour:
                                new Date().getMinutes() >= 45
                                  ? new Date().getUTCHours() + 1
                                  : new Date().getUTCHours(),
                              minutes: new Date().getMinutes() + 15,
                              from: 'month',
                            }),
                          ),
                          toggleModal())
                        : showAlert({
                            title: 'Invalid Date Selection',
                            type: 'warning',
                            message: 'Please select present or future date',
                          })
                    }
                    key={dayIndex}
                    style={[
                      styles.day,
                      !isCurrentMonth && styles.nonCurrentMonthDay,
                      isHoliMarked && {
                        backgroundColor: Colors.calendarHolidayBackgroundColor,
                      },
                    ]}>
                    {isToday ? (
                      <View style={styles.todayHighlight}>
                        <Text style={styles.todayText}>{day}</Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.dateText,
                          isHoliMarked && {
                            color: Colors.calendarHolidayTextColor,
                          },
                          dayIndex === 5 && {color: Colors.Red},
                        ]}>
                        {day}
                      </Text>
                    )}
                    {data?.data?.length > 2 ? (
                      <>
                        {data?.data
                          ?.slice(0, 2)
                          .map((item: IEvent, itemIndex: number) => (
                            <TouchableOpacity
                              onPress={() => {
                                user._id === item?.createdBy?._id
                                  ? dispatch(setUpdateEventInfo(item))
                                  : dispatch(setEventDetails(item));
                              }}
                              key={itemIndex}
                              style={[
                                styles.eventTypeContainer,
                                {backgroundColor: eventType(item?.eventType)},
                              ]}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.eventTitleText}>
                                {item?.title?.trim()}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        <TouchableOpacity
                          onPress={() => {
                            setIsPopupVisible(true);
                            setNumberOfEvent(data?.data);
                          }}>
                          <Text style={styles.seeMoreText}>
                            {data?.data?.length - 2} more
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      data?.data?.map((item: IEvent, itemIndex: number) => (
                        <TouchableOpacity
                          onPress={() => {
                            user._id === item?.createdBy?._id
                              ? dispatch(setUpdateEventInfo(item))
                              : dispatch(setEventDetails(item));
                          }}
                          key={itemIndex}
                          style={[
                            styles.eventTypeContainer,
                            {backgroundColor: eventType(item?.eventType)},
                          ]}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.eventTitleText}>
                            {item?.title.trim()}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </>
      )}
      {selected === 'week' && renderWeekView()}
      {selected === 'day' && renderDayView()}
      {isPopupVisible && (
        <ReactNativeModal
          onBackdropPress={() => setIsPopupVisible(false)}
          isVisible={isPopupVisible}>
          <View style={styles.popupContainer}>
            <Text style={styles.eventDateDay}>
              {moment(numberOfEvent[0]?.start).format('dddd D')}
            </Text>
            {numberOfEvent.map((item, itemIndex) => (
              <TouchableOpacity
                onPress={() => {
                  setIsPopupVisible(false);
                  user?._id === item?.createdBy._id
                    ? dispatch(setUpdateEventInfo(item))
                    : dispatch(setEventDetails(item));
                }}
                key={itemIndex}
                style={{
                  backgroundColor: eventType(item?.eventType),
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: 100,
                  marginBottom: 5,
                  alignItems: 'center',
                  paddingHorizontal: responsiveScreenWidth(4),
                }}>
                <View
                  style={{
                    width: '95%',
                    paddingVertical: responsiveScreenHeight(0.2),
                  }}>
                  <Text numberOfLines={1} style={styles.itemText}>
                    {item?.title.slice(0, 20)}
                  </Text>
                </View>
                <View style={styles.circle} />
              </TouchableOpacity>
            ))}
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
};

//
// Styles
//
const getStyles = (Colors: any) =>
  StyleSheet.create({
    eventDateDay: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(0.5),
    },
    popupContent: {
      padding: 16,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      borderRadius: 8,
      top: responsiveScreenHeight(10),
      zIndex: 1,
    },
    popupArrow: {
      borderTopColor: 'transparent',
    },
    popupContainer: {
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderRadius: 10,
    },
    clickedStyle: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
    },
    holidayButtonContainer: {
      alignItems: 'center',
      borderRadius: 5,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenHeight(1),
    },
    holidayButton: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: Colors.Foreground,
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 10,
      borderRadius: 7,
    },
    navigationButtonContainer: {
      flexDirection: 'row',
      gap: 5,
    },
    dateText: {
      height: responsiveScreenHeight(2),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginTop: 5,
      marginBottom: 2,
    },
    todayText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    eventTitleText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: RegularFonts.BT,
      paddingLeft: 2,
    },
    eventTypeContainer: {
      width: '95%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      minHeight: 10,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    circle: {
      marginVertical: 2,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    container: {
      // paddingVertical: 10,
      backgroundColor: Colors.Background_color,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      paddingHorizontal: 5,
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Foreground,
    },
    weekday: {
      width: '14.28%',
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      paddingVertical: 5,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      textTransform: 'uppercase',
      fontSize: responsiveScreenFontSize(1.5),
      height: 30,
    },
    day: {
      width: '14.28%',
      height: responsiveScreenHeight(10),
      textAlign: 'center',
      borderWidth: 0.5,
      borderColor: Colors.BorderColor,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    nonCurrentMonthDay: {
      backgroundColor: Colors.Background_color,
    },
    todayHighlight: {
      width: 20,
      height: 20,
      backgroundColor: Colors.Primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: responsiveScreenHeight(1),
    },
  });

export default React.memo(Calendar);
