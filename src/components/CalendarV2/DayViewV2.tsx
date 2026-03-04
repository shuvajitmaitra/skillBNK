import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import moment, {Moment} from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {updatePickedDate} from '../../store/reducer/calendarReducer';
import {IEventV2, TColors} from '../../types';
// import {RootState} from '../../types/redux/root';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import CalendarIcon from '../../assets/Icons/CalendarIcon';
import TaskIcon from '../../assets/Icons/TaskIcon';
import {
  borderRadius,
  gGap,
  gHeight,
  gPadding,
  gWidth,
} from '../../constants/Sizes';
import {hours} from './WeekViewV2';
import {
  setNewEventData,
  setSelectedEventV2,
} from '../../store/reducer/calendarReducerV2';
import {RootState} from '../../types/redux/root';
import {getCalendarEvents} from '../../actions/apiCall2';
// import {showToast} from '../HelperFunction';

interface DayViewProps {
  dayOffset: number;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
}
function searchEventsFlat(events: IEventV2[], query: string): IEventV2[] {
  const lowerQuery = query.toLowerCase();

  return events.filter(event => {
    const titleMatch = event.title.toLowerCase().includes(lowerQuery);
    const organizerMatch = event.organizer?.fullName
      ?.toLowerCase()
      .includes(lowerQuery);
    return titleMatch || organizerMatch;
  });
}
const DayViewV2 = ({
  dayOffset,
  seeMoreClicked,
  handleSeeMore,
}: DayViewProps) => {
  // const {user} = useSelector((state: RootState) => state.auth);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const {
    filterParameter,
    calendarInfo,
    dayViewEvents: e,
  } = useSelector((state: RootState) => state.calendarV2);
  const events = calendarInfo.searchText
    ? searchEventsFlat(e, calendarInfo.searchText)
    : e;
  useEffect(() => {
    calendarInfo.selectedView === 'day' &&
      getCalendarEvents({
        offset: dayOffset,
        filterParameter,
        view: calendarInfo.selectedView,
      });
  }, [calendarInfo.selectedView, dayOffset, filterParameter]);

  const getEventsForDayAndHour = (day: string, hour: string): IEventV2[] => {
    return events?.filter(r => moment(r.startTime).hour().toString() === hour);
  };

  const startOfDay: Moment = moment().add(dayOffset, 'days').startOf('day');
  const newHours = seeMoreClicked ? hours : hours.slice(0, 7);

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            overflow: 'hidden',
            borderColor: Colors.BorderColor,
          },
        ]}>
        <Text style={styles.headerText}>Time</Text>
        <Text style={styles.monthHeader}>
          {moment(startOfDay).format('MMMM DD, YYYY (dddd)')}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {newHours.map((hour, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.hourText}>{hour.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.weekHeader}>
          {newHours.map((hour, hourIndex) => {
            const dayEvents = getEventsForDayAndHour(
              startOfDay.format('YYYY-MM-DD'),
              hour.hour.toString(),
            );
            // const isPastDate =
            //   moment(startOfDay).format('DD') >= moment().format('DD');
            return (
              <TouchableOpacity
                key={hourIndex}
                onPress={() => {
                  // isPastDate && dayOffset >= 0
                  //   ?
                  dispatch(
                    updatePickedDate({
                      hour: hour.hour,
                      day: moment()
                        .add(dayOffset, 'days')
                        .startOf('day')
                        .toDate(),
                      from: 'day',
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
                }}>
                <View style={styles.hourRow}>
                  {dayEvents?.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled
                      contentContainerStyle={{
                        flexDirection: 'row',
                        gap: gGap(10),
                        alignItems: 'center',
                      }}>
                      {dayEvents?.map((item: IEventV2, itemIndex: number) => (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(setSelectedEventV2(item));
                          }}
                          key={itemIndex}
                          style={{
                            backgroundColor: Colors.PrimaryOpacityColor,
                            flexDirection: 'row',
                            borderRadius: borderRadius.small,
                            alignItems: 'center',
                            paddingHorizontal: responsiveScreenWidth(2),
                            gap: gWidth(10),
                            paddingVertical: gPadding(3),
                            height: gHeight(25),
                          }}>
                          {item.type === 'event' ? (
                            <CalendarIcon />
                          ) : (
                            <TaskIcon color={Colors.Primary} />
                          )}

                          <Text numberOfLines={1} style={styles.itemText}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.noMarker} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <GlobalSeeMoreButton
        onPress={handleSeeMore}
        buttonStatus={seeMoreClicked}
        buttonContainerStyle={{marginTop: 10}}
      />
    </View>
  );
};

export default DayViewV2;

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
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    eventTypeContainer: {
      width: '60%',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
    },
    circle: {
      width: 10,
      height: 10,
      marginVertical: 2,
      borderRadius: 5,
    },
    headerText: {
      paddingVertical: 5,
      height: 40,
      width: responsiveScreenWidth(15),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      fontFamily: CustomFonts.REGULAR,
      borderWidth: 1,
      overflow: 'hidden',
      textAlign: 'center',
      backgroundColor: Colors.Background_color,
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      flex: 1,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.Foreground,
    },
    leftColumn: {
      width: responsiveScreenWidth(15),
      backgroundColor: Colors.Background_color,
      borderLeftColor: Colors.LineColor,
      borderLeftWidth: 0.4,
      borderBottomColor: Colors.LineColor,
      borderBottomWidth: 0.4,
      overflow: 'hidden',
    },
    hourRow: {
      minHeight: responsiveScreenHeight(4),
      borderWidth: 0.5,
      borderColor: Colors.BorderColor,
    },
    hourText: {
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      paddingTop: responsiveScreenHeight(1),
    },
    weekHeader: {
      flexDirection: 'column',
      flex: 1,
    },
    noMarker: {
      width: 1,
      height: 1,
    },
  });
