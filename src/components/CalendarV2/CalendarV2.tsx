import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import WeekView from './WeekViewV2';
import moment from 'moment';
import DayViewV2 from './DayViewV2';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeModal from 'react-native-modal';
import {RegularFonts} from '../../constants/Fonts';
import MonthViewV2 from './MonthViewV2';
import {IEventV2, TColors} from '../../types';
import {borderRadius, fontSizes, gGap, gPadding} from '../../constants/Sizes';
import {
  setSelectedEventV2,
  updateCalInfo,
} from '../../store/reducer/calendarReducerV2';
import {previousState} from '../../utility/reduxPreState';
import {RootState} from '../../types/redux/root';
import CalendarIcon from '../../assets/Icons/CalendarIcon';
import TaskIcon from '../../assets/Icons/TaskIcon';
import {MaterialIcon} from '../../constants/Icons';

interface CalendarProps {
  toggleModal: () => void;
  seeMoreClicked: boolean;
  handleSeeMore: () => void;
}

const CalendarV2: React.FC<CalendarProps> = ({
  toggleModal,
  seeMoreClicked,
  handleSeeMore,
}) => {
  const {holidays} = useSelector((state: any) => state.calendar);
  const {calendarInfo} = useSelector((state: RootState) => state.calendarV2);
  const dispatch = useDispatch();

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [numberOfEvent, setNumberOfEvent] = useState<IEventV2[]>([]);

  // Navigation handlers
  const handlePrevMonth = () => {
    const preMonthOffset = previousState('calendarV2.calendarInfo.monthOffset');
    dispatch(updateCalInfo({monthOffset: preMonthOffset - 1}));
  };

  const handlePrevWeek = () => {
    const preWeekOffset = previousState('calendarV2.calendarInfo.weekOffset');
    dispatch(updateCalInfo({weekOffset: preWeekOffset - 1}));
  };
  const handlePrevDay = () => {
    const preDayOffset = previousState('calendarV2.calendarInfo.dayOffset');
    dispatch(updateCalInfo({dayOffset: preDayOffset - 1}));
  };
  const handleNextMonth = () => {
    const nextMonthOffset = previousState(
      'calendarV2.calendarInfo.monthOffset',
    );
    dispatch(updateCalInfo({monthOffset: nextMonthOffset + 1}));
  };

  const handleNextWeek = () => {
    const nextWeekOffset = previousState('calendarV2.calendarInfo.weekOffset');
    dispatch(updateCalInfo({weekOffset: nextWeekOffset + 1}));
  };

  const handleNextDay = () => {
    const nextDayOffset = previousState('calendarV2.calendarInfo.dayOffset');
    dispatch(updateCalInfo({dayOffset: nextDayOffset + 1}));
  };

  const renderDayView = () => (
    <DayViewV2
      dayOffset={calendarInfo.dayOffset}
      seeMoreClicked={seeMoreClicked}
      handleSeeMore={handleSeeMore}
    />
  );
  const renderWeekView = () => (
    <WeekView
      weekOffset={calendarInfo.weekOffset}
      seeMoreClicked={seeMoreClicked}
      handleSeeMore={handleSeeMore}
      setIsPopupVisible={() => setIsPopupVisible(!isPopupVisible)}
      setNumberOfEvent={setNumberOfEvent}
    />
  );

  // Pass the needed props to MonthViewV2
  const renderMonthView = () => (
    <MonthViewV2
      monthOffset={calendarInfo.monthOffset}
      toggleModal={toggleModal}
      holidays={holidays}
      setNumberOfEvent={setNumberOfEvent}
      setIsPopupVisible={setIsPopupVisible}
    />
  );

  const handleScroll = (event: any) => {
    if (event.nativeEvent.locationY > event.nativeEvent.locationX) {
      console.log('scroll right');
      if (calendarInfo.selectedView === 'month') {
        handleNextMonth();
      } else if (calendarInfo.selectedView === 'week') {
        handleNextWeek();
      } else if (calendarInfo.selectedView === 'day') {
        handleNextDay();
      }
    } else if (event.nativeEvent.locationY < event.nativeEvent.locationX) {
      if (calendarInfo.selectedView === 'month') {
        handlePrevMonth();
      } else if (calendarInfo.selectedView === 'week') {
        handlePrevWeek();
      } else if (calendarInfo.selectedView === 'day') {
        handlePrevDay();
      }

      console.log('scroll left');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <View style={styles.navigationButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              calendarInfo?.selectedView === 'week'
                ? handlePrevWeek
                : calendarInfo?.selectedView === 'day'
                ? handlePrevDay
                : handlePrevMonth
            }
            style={{
              backgroundColor: Colors.Background_color,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
              borderRadius: borderRadius.default,
            }}>
            <MaterialIcon
              name="chevron-left"
              size={30}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              calendarInfo?.selectedView === 'week'
                ? handleNextWeek
                : calendarInfo?.selectedView === 'day'
                ? handleNextDay
                : handleNextMonth
            }
            style={{
              backgroundColor: Colors.Background_color,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
              borderRadius: borderRadius.default,
            }}>
            <MaterialIcon
              name="chevron-right"
              size={30}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', gap: gGap(10)}}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.SecondaryButtonBackgroundColor,
              paddingHorizontal: gPadding(10),
              paddingVertical: gPadding(5),
              borderRadius: borderRadius.small,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
            }}
            onPress={() => {
              dispatch(updateCalInfo({selectedView: 'day'}));
              dispatch(updateCalInfo({dayOffset: 0}));
            }}>
            <Text style={{color: Colors.SecondaryButtonTextColor}}>Today</Text>
          </TouchableOpacity>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                calendarInfo?.selectedView === 'month' && styles.clickedStyle,
              ]}
              onPress={() => dispatch(updateCalInfo({selectedView: 'month'}))}>
              <Text
                style={[
                  styles.holidayButton,
                  calendarInfo?.selectedView === 'month' && styles.clickedStyle,
                ]}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                calendarInfo?.selectedView === 'week' && styles.clickedStyle,
              ]}
              onPress={() => dispatch(updateCalInfo({selectedView: 'week'}))}>
              <Text
                style={[
                  styles.holidayButton,
                  calendarInfo?.selectedView === 'week' && styles.clickedStyle,
                ]}>
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                calendarInfo?.selectedView === 'day' && styles.clickedStyle,
              ]}
              onPress={() => dispatch(updateCalInfo({selectedView: 'day'}))}>
              <Text
                style={[
                  styles.holidayButton,
                  calendarInfo?.selectedView === 'day' && styles.clickedStyle,
                ]}>
                Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        onResponderEnd={handleScroll}
        scrollEventThrottle={10}
        horizontal={true}>
        <View style={{width: responsiveScreenWidth(98)}}>
          {calendarInfo?.selectedView === 'month' && renderMonthView()}
          {calendarInfo?.selectedView === 'week' && renderWeekView()}
          {calendarInfo?.selectedView === 'day' && renderDayView()}
        </View>
      </ScrollView>
      {isPopupVisible && (
        <ReactNativeModal
          onBackdropPress={() => setIsPopupVisible(false)}
          isVisible={isPopupVisible}>
          <View style={styles.popupContainer}>
            <Text style={styles.eventDateDay}>
              {moment(numberOfEvent[0]?.startTime).format('LL')}
            </Text>
            {numberOfEvent.map((item, itemIndex) => (
              <TouchableOpacity
                onPress={() => {
                  setIsPopupVisible(false);
                  setTimeout(() => {
                    dispatch(setSelectedEventV2(item));
                  }, 1);
                }}
                key={itemIndex}
                style={{
                  backgroundColor: Colors.PrimaryOpacityColor,
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: borderRadius.small,
                  alignItems: 'center',
                  marginBottom: gPadding(7),
                  gap: gPadding(10),
                  paddingHorizontal: gPadding(10),
                  paddingVertical: gPadding(7),
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                }}>
                {item.type === 'event' ? (
                  <CalendarIcon color={Colors.BodyText} />
                ) : (
                  <TaskIcon color={Colors.BodyText} />
                )}

                <Text numberOfLines={1} style={styles.itemText}>
                  {item?.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    eventDateDay: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.BodyText,
      marginBottom: gGap(10),
      fontSize: fontSizes.subHeading,
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
      borderRadius: 10,
      padding: gPadding(10),
      paddingBottom: gPadding(5),
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
      backgroundColor: Colors.Background_color,
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
      color: Colors.BodyText,
      textTransform: 'capitalize',
      flex: 1,
      // backgroundColor: 'red',
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
      backgroundColor: Colors.Foreground,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      paddingHorizontal: 5,
    },
  });

export default React.memo(CalendarV2);
