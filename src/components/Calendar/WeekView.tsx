import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventDetails,
  setUpdateEventInfo,
  updatePickedDate,
} from '../../store/reducer/calendarReducer';
import ReactNativeModal from 'react-native-modal';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {IEvent, IEventsMap, ITotalEvents} from '../../types/calendar/event';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';

export const hours = Array.from({length: 24}, (_, i) => {
  const time =
    i === 0
      ? '12 AM'
      : i < 12
      ? `${i} AM`
      : i === 12
      ? '12 PM'
      : `${i - 12} PM`;
  return {label: time, hour: i};
});

type WeekViewProps = {
  markedDates: ITotalEvents[];
  weekOffset: number;
  toggleModal: () => void;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
};

const WeekView = ({
  markedDates,
  weekOffset,
  toggleModal,
  seeMoreClicked,
  handleSeeMore,
}: WeekViewProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Optionally type the events state as IEvent[]
  const [events, setEvents] = useState<IEvent[]>([]);

  const startOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').startOf('week'),
    [weekOffset],
  );
  const endOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').endOf('week'),
    [weekOffset],
  );

  const days = useMemo(() => {
    const daysArray = [];
    let day = startOfWeek;
    while (day <= endOfWeek) {
      daysArray.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    return daysArray;
  }, [startOfWeek, endOfWeek]);

  const eventsByDayAndHour = useMemo(() => {
    const eventsMap: IEventsMap = {};
    markedDates.forEach((dayEvent: ITotalEvents) => {
      const date = moment(dayEvent.title).format('YYYY-MM-DD');
      dayEvent.data.forEach(event => {
        const hour = moment(event.start).hour().toString(); // using string keys
        if (!eventsMap[date]) {
          eventsMap[date] = {};
        }
        if (!eventsMap[date][hour]) {
          eventsMap[date][hour] = [];
        }
        eventsMap[date][hour].push(event);
      });
    });
    return eventsMap;
  }, [markedDates]);

  const getEventsForDayAndHour = (day: string, hour: string) => {
    const dateString = moment(day).format('YYYY-MM-DD');
    return eventsByDayAndHour[dateString]?.[hour] || [];
  };

  // Define a color-lookup function with a new name to avoid conflict.
  const getEventColor = (type: string): string => {
    return (
      (type === 'showNTell' && '#619dcc') ||
      (type === 'mockInterview' && '#f59f9f') ||
      (type === 'orientation' && '#379793') ||
      (type === 'technicalInterview' && '#f8a579') ||
      (type === 'behavioralInterview' && '#0091b9') ||
      (type === 'reviewMeeting' && '#7ccc84') ||
      (type === 'syncUp' && '#ff6502') ||
      (type === 'other' && Colors.OthersColor) ||
      Colors.PrimaryOpacityColor
    );
  };

  const newHours = seeMoreClicked ? hours : hours.slice(0, 7);
  return (
    <ScrollView>
      <Text style={styles.monthHeader}>{`${moment(startOfWeek).format(
        'MMMM DD',
      )} - ${moment(endOfWeek).format('MMMM DD')}`}</Text>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text style={[styles.hourText, styles.timeText]}>Time</Text>
          {newHours?.map((hr, index) => (
            <View
              key={index}
              style={[styles.hourRow, {justifyContent: 'center'}]}>
              <Text style={[styles.hourText]}>{hr.label}</Text>
            </View>
          ))}
        </View>
        <ScrollView horizontal>
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
                <Text style={[styles.weekday]}>{moment(day).format('DD')}</Text>
                <Text style={[styles.weekday, {marginBottom: 8}]}>
                  {moment(day).format('ddd')}
                </Text>
                {newHours?.map((hr, hourIndex) => {
                  const evnt = getEventsForDayAndHour(
                    moment(day).format('YYYY-MM-DD'),
                    hr.hour.toString(),
                  );
                  const newEvents = evnt.length > 2 ? evnt.slice(0, 2) : evnt;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(updatePickedDate({day, hour: hr.hour}));
                        toggleModal();
                      }}
                      key={hourIndex}
                      style={styles.hourRow}>
                      {evnt.length > 0 ? (
                        <>
                          {newEvents.map((item: IEvent, itemIndex: number) => (
                            <TouchableOpacity
                              onPress={() => {
                                user._id === item?.createdBy?._id
                                  ? dispatch(setUpdateEventInfo(item))
                                  : dispatch(setEventDetails(item));
                              }}
                              key={itemIndex}
                              style={[
                                styles.eventTypeContainer,
                                {
                                  backgroundColor: getEventColor(
                                    item?.eventType,
                                  ),
                                },
                              ]}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.eventTitleText}>
                                {item?.title.trim()}
                              </Text>
                            </TouchableOpacity>
                          ))}
                          {events.length > 2 && (
                            <TouchableOpacity
                              onPress={() => {
                                setEvents(events);
                                setIsPopupVisible(true);
                              }}>
                              <Text style={styles.seeMoreText}>
                                {events.length - 2} More
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
        </ScrollView>
      </View>
      {isPopupVisible && (
        <ReactNativeModal
          onBackdropPress={() => setIsPopupVisible(false)}
          isVisible={isPopupVisible}>
          <View style={styles.popupContainer}>
            <Text style={{}}>
              {moment(events[0]?.start).format('dddd D').toString()}
            </Text>
            {events.map((item, itemIndex) => (
              <TouchableOpacity
                onPress={() => {
                  setIsPopupVisible(false);
                  user?._id === item?.createdBy?._id
                    ? dispatch(setUpdateEventInfo(item))
                    : dispatch(setEventDetails(item));
                }}
                key={itemIndex}
                style={{
                  backgroundColor: getEventColor(item.eventType),
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
                <View style={{flexGrow: 1}} />
                <View style={styles.circle} />
              </TouchableOpacity>
            ))}
          </View>
        </ReactNativeModal>
      )}
      {/* <TouchableOpacity
        onPress={handleSeeMore}
        style={styles.moreButtonContainer}>
        {seeMoreClicked ? (
          <>
            <ArrowLeftWhite size={20} color={Colors.Primary} />
            <Text style={styles.moreButtonText}>See Less</Text>
          </>
        ) : (
          <>
            <Text style={styles.moreButtonText}>See More</Text>
            <ArrowRight />
          </>
        )}
      </TouchableOpacity> */}
      <GlobalSeeMoreButton
        onPress={handleSeeMore}
        buttonStatus={seeMoreClicked}
      />
    </ScrollView>
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
      padding: 20,
      borderRadius: 10,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
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

export default WeekView;
