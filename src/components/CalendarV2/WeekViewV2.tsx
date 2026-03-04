import React, {Dispatch, SetStateAction, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment, {Moment} from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {updatePickedDate} from '../../store/reducer/calendarReducer';
import {RegularFonts} from '../../constants/Fonts';
import {IEventV2, TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {gMargin} from '../../constants/Sizes';
import {getCalendarEvents} from '../../actions/apiCall2';
import EventItemV2 from './EventItemV2';
import {
  setNewEventData,
  setSelectedEventV2,
} from '../../store/reducer/calendarReducerV2';
// import {showToast} from '../HelperFunction';
function searchEvents(data: any, searchText: string) {
  const result: {[key: string]: {[key: string]: any[]}} = {};
  const lowerSearch = searchText.toLowerCase();

  for (const date in data) {
    const hours = data[date];

    for (const hour in hours) {
      const matchedEvents = hours[hour].filter((event: any) => {
        const titleMatch = event.title?.toLowerCase().includes(lowerSearch);
        const organizerMatch = event.organizer?.fullName
          ?.toLowerCase()
          .includes(lowerSearch);
        const attendeeMatch = event.attendees?.some((a: any) =>
          a.fullName?.toLowerCase().includes(lowerSearch),
        );
        return titleMatch || organizerMatch || attendeeMatch;
      });

      if (matchedEvents.length > 0) {
        if (!result[date]) result[date] = {};
        result[date][hour] = matchedEvents;
      }
    }
  }

  return result;
}
export const hours = Array.from({length: 24}, (_, i) => ({
  label:
    i === 0
      ? '12 AM'
      : i < 12
      ? `${i} AM`
      : i === 12
      ? '12 PM'
      : `${i - 12} PM`,
  hour: i,
}));

interface WeekViewProps {
  weekOffset: number;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
  setIsPopupVisible: () => void;
  setNumberOfEvent: Dispatch<SetStateAction<IEventV2[]>>;
}

const WeekViewV2 = ({
  weekOffset,
  seeMoreClicked,
  handleSeeMore,
  setIsPopupVisible,
  setNumberOfEvent,
}: WeekViewProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {weekEventsObj: e, calendarInfo} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const weekEventsObj = calendarInfo.searchText
    ? searchEvents(e, calendarInfo.searchText)
    : e;
  const {filterParameter} = useSelector((state: RootState) => state.calendarV2);

  useEffect(() => {
    calendarInfo.selectedView === 'week' &&
      getCalendarEvents({
        offset: weekOffset,
        filterParameter,
        view: calendarInfo.selectedView,
      });
  }, [calendarInfo.selectedView, weekOffset, filterParameter]);

  const startOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').startOf('week'),
    [weekOffset],
  );
  const endOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').endOf('week'),
    [weekOffset],
  );

  const days = useMemo(() => {
    const daysArray: Date[] = [];
    let day: Moment = startOfWeek.clone();
    while (day.isSameOrBefore(endOfWeek)) {
      daysArray.push(day.toDate());
      day = day.clone().add(1, 'day');
    }
    return daysArray;
  }, [startOfWeek, endOfWeek]);

  const newHours = seeMoreClicked ? hours : hours?.slice(0, 7);
  return (
    <>
      {/* <Text style={styles.monthHeader}>
        {`${moment(startOfWeek).format('MMMM DD')} - ${moment(endOfWeek).format(
          'MMMM DD',
        )}`}
      </Text> */}
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text style={[styles.hourText, styles.timeText]}>Time</Text>
          {newHours.map((hr, index) => (
            <View
              key={index}
              style={[styles.hourRow, {justifyContent: 'center'}]}>
              <Text style={styles.hourText}>{hr.label}</Text>
            </View>
          ))}
        </View>
        <>
          <View style={styles.weekHeader}>
            {days.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={{
                  width: responsiveScreenWidth(12.5),
                  borderTopWidth: 1,
                  borderTopColor: Colors.BorderColor,
                  borderRightWidth: 1,
                  borderRightColor: Colors.BorderColor,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.BorderColor,
                }}>
                <Text style={styles.weekday}>{moment(day).format('DD')}</Text>
                <Text style={[styles.weekday, {marginBottom: 8}]}>
                  {moment(day).format('ddd')}
                </Text>
                {newHours.map((hr, hourIndex) => {
                  const evnt =
                    weekEventsObj?.[moment(day).format('YYYY-MM-DD')]?.[
                      hr.hour.toString()
                    ];
                  const newEvents =
                    evnt?.length! > 2 ? evnt?.slice(0, 2) : evnt;
                  // const isPastDate =
                  //   moment(day).format('DD') >= moment().format('DD');
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        // isPastDate && weekOffset >= 0
                        //   ?
                        dispatch(updatePickedDate({day, hour: hr.hour}));
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
                      key={hourIndex}
                      style={styles.hourRow}>
                      {evnt?.length ? (
                        <>
                          {newEvents?.map((item: IEventV2) => (
                            <EventItemV2
                              key={item._id}
                              item={item}
                              onPress={() => dispatch(setSelectedEventV2(item))}
                            />
                          ))}
                          {evnt.length > 2 && (
                            <TouchableOpacity
                              onPress={() => {
                                setNumberOfEvent(evnt);
                                setIsPopupVisible();
                              }}>
                              <Text style={styles.seeMoreText}>
                                {evnt.length - 2} More
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <Text style={styles.noMarker} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </>
      </View>
      <GlobalSeeMoreButton
        onPress={handleSeeMore}
        buttonStatus={seeMoreClicked}
      />
    </>
  );
};
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    moreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
    },
    moreButtonContainer: {
      alignSelf: 'flex-start',
      padding: 5,
      flexDirection: 'row',
      gap: 5,
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
      padding: 10,
      borderRadius: 10,
      gap: 5,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginVertical: gMargin(3),
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    eventTitleText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: RegularFonts.BT,
      // paddingLeft: 1,
    },
    eventTypeContainer: {
      width: '95%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      minHeight: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
    },
    circle: {
      marginVertical: 2,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      // backgroundColor: 'red',
    },
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.Foreground,
      marginBottom: 10,
    },
    leftColumn: {
      width: responsiveScreenWidth(10),
      backgroundColor: Colors.Background_color,
      borderLeftColor: Colors.BorderColor,
      borderLeftWidth: 1,
    },
    hourRow: {
      paddingTop: 5,
      height: 60,
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderColor: Colors.BorderColor,
      borderTopWidth: 1,
    },
    hourText: {
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
    },
    timeText: {
      paddingVertical: 5,
      paddingTop: responsiveScreenHeight(1.5),
      height: 49,
      color: Colors.Heading,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    rightColumn: {
      flexDirection: 'column',
    },
    weekHeader: {
      flexDirection: 'row',
    },
    weekday: {
      textAlign: 'center',
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      textTransform: 'uppercase',
      height: 20,
    },
    marker: {
      width: 10,
      height: 10,
      backgroundColor: Colors.ThemeSecondaryColor2,
      borderRadius: 5,
    },
    noMarker: {
      width: 10,
      height: 10,
      backgroundColor: 'transparent',
    },
  });

export default WeekViewV2;
