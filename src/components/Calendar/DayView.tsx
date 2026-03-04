import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {hours} from './WeekView';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventDetails,
  setUpdateEventInfo,
  updatePickedDate,
} from '../../store/reducer/calendarReducer';
import {IEvent, ITotalEvents} from '../../types/calendar/event';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';

type DayViewProps = {
  markedDates: ITotalEvents[];
  DayOffset: number;
  eventStatus: (status: string) => void;
  eventType: (type: string) => void;
  toggleModal: () => void;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
};

const DayView = ({
  markedDates,
  DayOffset,
  eventStatus,
  eventType,
  toggleModal,
  seeMoreClicked,
  handleSeeMore,
}: DayViewProps) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const getEventsForDayAndHour = (day: string, hour: string) => {
    const dateString = moment(day).format('YYYY-MM-DD');
    const dayEvents = markedDates.find(
      item => moment(item.title).format('YYYY-MM-DD') === dateString,
    );
    return dayEvents
      ? dayEvents.data?.filter(
          event => moment(event.start).hour().toString() === hour,
        )
      : [];
  };
  const dispatch = useDispatch();
  var startOfDay = moment().add(DayOffset, 'days').startOf('day');
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
        <Text style={styles.monthHeader}>{`${moment(startOfDay).format(
          'MMMM DD, YYYY (dddd)',
        )}`}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {newHours.map((hour, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.hourText}>{hour.label}</Text>
            </View>
          ))}
        </View>
        <ScrollView>
          <View style={styles.weekHeader}>
            {newHours.map((hour, hourIndex) => {
              const events = getEventsForDayAndHour(
                moment(startOfDay).format('YYYY-M-D'),
                hour.hour.toString(),
              );
              return (
                <TouchableOpacity
                  key={hourIndex}
                  onPress={() => {
                    dispatch(
                      updatePickedDate({
                        hour: hour.hour,
                        day: moment().add(DayOffset, 'days').startOf('day'),
                        from: 'day',
                      }),
                    );

                    toggleModal();
                  }}>
                  <ScrollView
                    horizontal
                    key={hourIndex}
                    contentContainerStyle={styles.scrollViewRow}
                    style={[styles.hourRow]}>
                    {events?.length > 0 ? (
                      <View style={{backgroundColor: 'yellow'}}>
                        {events?.map((item: IEvent, itemIndex: number) => (
                          <Text>Hello</Text>
                          // <TouchableOpacity
                          //   onPress={() => {
                          //     user._id === item?.createdBy?._id
                          //       ? dispatch(setUpdateEventInfo(item))
                          //       : dispatch(setEventDetails(item));
                          //   }}
                          //   key={itemIndex}
                          //   style={
                          //     {
                          //       backgroundColor: eventType(item?.eventType),
                          //       // width: "70%",
                          //       flexDirection: 'row',
                          //       borderRadius: 100,
                          //       alignItems: 'center',
                          //       paddingHorizontal: responsiveScreenWidth(2),
                          //       marginRight: 10,
                          //     } as any
                          //   }>
                          //   <View
                          //     style={{
                          //       // width: "95%",
                          //       paddingVertical: responsiveScreenHeight(0.2),
                          //       marginRight: 5,
                          //     }}>
                          //     <Text numberOfLines={1} style={styles.itemText}>
                          //       {item?.title.slice(0, 10)}
                          //     </Text>
                          //   </View>
                          //   {/* <View style={{ flexGrow: 1 }}></View> */}

                          //   <View
                          //     style={[
                          //       styles?.circle,
                          //       {
                          //         backgroundColor: eventStatus(
                          //           item?.status || '',
                          //         ),
                          //       } as any,
                          //     ]}
                          //   />
                          // </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noMarker} />
                    )}
                  </ScrollView>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <GlobalSeeMoreButton
        onPress={handleSeeMore}
        buttonStatus={seeMoreClicked}
        buttonContainerStyle={{marginTop: 10}}
      />
    </View>
  );
};

export default DayView;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    moreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
    },
    moreButtonContainer: {
      alignSelf: 'flex-start',
      // backgroundColor: Colors.Primary,
      padding: 5,
      flexDirection: 'row',
      gap: 5,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    scrollViewRow: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: 'red',
      // width: "100%",
      flexDirection: 'row',
      paddingLeft: 10,
    },
    eventTypeContainer: {
      width: '60%',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
    },
    circle: {
      marginVertical: 2,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    headerText: {
      paddingVertical: 5,
      height: 40,
      width: responsiveScreenWidth(15),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1),
      // paddingHorizontal: responsiveScreenWidth(3.5),
      borderColor: Colors.BorderColor,
      fontFamily: CustomFonts.REGULAR,

      borderWidth: 1,
      overflow: 'hidden',
      textAlign: 'center',
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      //   marginBottom: responsiveScreenHeight(1),
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
      backgroundColor: 'blue',
    },
    hourText: {
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      paddingTop: responsiveScreenHeight(1),
    },

    weekHeader: {
      //   flexDirection: "row",
      backgroundColor: 'red',
    },
    noMarker: {
      width: 10,
      height: 10,
      backgroundColor: 'transparent',
    },
  });
