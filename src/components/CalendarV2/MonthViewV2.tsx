import React, {useMemo, Dispatch, SetStateAction, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {IEventV2, TColors} from '../../types';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import {updatePickedDate} from '../../store/reducer/calendarReducer';
import EventItemV2 from './EventItemV2';
import {RootState} from '../../types/redux/root';
import {getCalendarEvents} from '../../actions/apiCall2';
import {
  setNewEventData,
  setSelectedEventV2,
  TransformedEvents,
} from '../../store/reducer/calendarReducerV2';
import {fontSizes, gGap} from '../../constants/Sizes';

interface MonthCalendar {
  weeks: number[][];
  prevMonth: number;
  nextMonth: number;
  prevYear: number;
  nextYear: number;
}

interface MonthEvents {
  [date: string]: IEventV2[];
}

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

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

const generateMonthCalendar = (month: number, year: number): MonthCalendar => {
  const daysInMonth = monthDays(year);
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days: number[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(daysInMonth[prevMonth] - firstDayOfMonth + i + 1);
  }
  for (let i = 1; i <= daysInMonth[month]; i++) {
    days.push(i);
  }
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

interface MonthViewV2Props {
  toggleModal: () => void;
  holidays: {date: {start: string}}[];
  setNumberOfEvent: Dispatch<SetStateAction<IEventV2[]>>;
  setIsPopupVisible: Dispatch<SetStateAction<boolean>>;
  monthOffset: number;
}

function searchEvents(
  data: TransformedEvents,
  query: string,
): TransformedEvents {
  const lowerQuery = query.toLowerCase();
  const result: TransformedEvents = {};

  for (const [date, events] of Object.entries(data)) {
    const matchedEvents = (events as any).filter((event: any) => {
      const titleMatch = event.title.toLowerCase().includes(lowerQuery);
      const organizerMatch = event.organizer?.fullName
        ?.toLowerCase()
        .includes(lowerQuery);
      return titleMatch || organizerMatch;
    });

    if (matchedEvents.length > 0) {
      result[date] = matchedEvents;
    }
  }

  return result;
}

const MonthViewV2: React.FC<MonthViewV2Props> = ({
  monthOffset,
  holidays,
  setNumberOfEvent,
  setIsPopupVisible,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const {
    monthViewEvents: e = {} as MonthEvents,
    calendarInfo,
    filterParameter,
  } = useSelector((state: RootState) => state.calendarV2);
  const events =
    calendarInfo.searchText && e
      ? searchEvents(e as TransformedEvents, calendarInfo.searchText)
      : e;
  const month = moment().add(monthOffset, 'months').month();
  const year = moment().add(monthOffset, 'month').year();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const {weeks, prevMonth, nextMonth, prevYear, nextYear} = useMemo(
    () => generateMonthCalendar(month, year),
    [month, year],
  );

  useEffect(() => {
    calendarInfo.selectedView === 'month' &&
      getCalendarEvents({
        offset: monthOffset,
        filterParameter,
        view: calendarInfo.selectedView,
      });
  }, [calendarInfo.selectedView, monthOffset, filterParameter]);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  return (
    <>
      {/* <Text style={styles.monthHeader}>
        {moment().add(monthOffset, 'months').format('MMMM YYYY')}
      </Text> */}
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
              holidays.map(item => item.date.start),
            );

            // Ensure data is always an array of IEventV2
            const data: IEventV2[] =
              (events?.[`${displayYear}-${displayMonth + 1}-${day}`] as any) ||
              [];

            const isToday =
              todayString === `${displayYear}-${displayMonth + 1}-${day}`;
            // const notPastDate =
            //   new Date(todayString) <=
            //   new Date(`${displayYear}-${displayMonth + 1}-${day}`);

            return (
              <TouchableOpacity
                onPress={() => {
                  const time = moment({
                    year: displayYear,
                    month: displayMonth,
                    day: day,
                    hour: moment().hour(),
                    minute: moment().minute(),
                  }).toISOString();
                  dispatch(
                    updatePickedDate({
                      day: time,
                      from: 'month',
                    }),
                  );
                  dispatch(
                    setNewEventData({
                      isModalVisible: true,
                      eventType: 'event',
                    }),
                  );
                  // : showToast({
                  //     message: 'Please select present or future date',
                  //     background: Colors.Red,
                  //   });
                }}
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
                      isHoliMarked && {color: Colors.calendarHolidayTextColor},
                      dayIndex === 5 && {color: Colors.Red},
                    ]}>
                    {day}
                  </Text>
                )}
                {data.length > 2 ? (
                  <>
                    {data.slice(0, 2).map(item => (
                      <EventItemV2
                        key={item._id}
                        item={item}
                        onPress={() => dispatch(setSelectedEventV2(item))}
                      />
                    ))}
                    <TouchableOpacity
                      onPress={() => {
                        setIsPopupVisible(true);
                        setNumberOfEvent(data); // data is guaranteed to be IEventV2[]
                      }}>
                      <Text style={styles.seeMoreText}>
                        {data.length - 2} more
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  data.map(item => (
                    <EventItemV2
                      key={item._id}
                      item={item}
                      onPress={() => dispatch(setSelectedEventV2(item))}
                    />
                  ))
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
      marginVertical: gGap(5),
    },
    todayText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: fontSizes.small,
    },
    dateText: {
      height: responsiveScreenHeight(2),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginTop: 5,
      marginBottom: 2,
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
  });

export default MonthViewV2;
