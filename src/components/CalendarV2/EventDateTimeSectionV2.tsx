// components/EventDateTimeSectionV2.tsx
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import moment from 'moment';
import CheckIcon from '../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../assets/Icons/UnCheckIcon';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import {IoniconsIcon} from '../../constants/Icons';
import {
  borderRadius,
  fontSizes,
  gBorderRadius,
  gGap,
  gMargin,
  gPadding,
  padding,
} from '../../constants/Sizes';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import CustomTimePicker from '../SharedComponent/CustomTimePicker';
import CustomSmallButton from '../CustomSmallButton';
import store from '../../store';
import {RootState} from '../../types/redux/root';
import {useSelector} from 'react-redux';
import {showToast} from '../HelperFunction';
import {PressableScale} from '../SharedComponent/PressableScale';
import RNText from '../SharedComponent/RNText';
import CrossIcon from '../../assets/Icons/CrossIcon';

type EventDateTimeSectionProps = {
  data: any;
  additionalData: any;
  setState: (arg0: any) => void;
};
const EventDateTimeSectionV2: React.FC<EventDateTimeSectionProps> = ({
  data,
  additionalData,
  setState,
}) => {
  const {selectedEventV2} = useSelector((state: RootState) => state.calendarV2);
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);

  const [isRepeatVisible, setIsRepeatVisible] = useState(false);
  const [from, setFrom] = useState('recurrence');

  const weekDays = [
    {day: 'Su'},
    {day: 'Mo'},
    {day: 'Tu'},
    {day: 'We'},
    {day: 'Th'},
    {day: 'Fr'},
    {day: 'Sa'},
  ];
  const weekDaysV2 = [
    {day: 'Sunday'},
    {day: 'Monday'},
    {day: 'Tuesday'},
    {day: 'Wednesday'},
    {day: 'Thursday'},
    {day: 'Friday'},
    {day: 'Saturday'},
  ];
  const [pickerState, setPickerState] = useState<'dateTime' | 'date' | 'time'>(
    'date',
  );
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const initialRecurrence = store.getState().calendarV2.selectedEventV2
    ?.recurrence || {
    isRecurring: false,
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [],
    endRecurrence: null,
  };
  const handleResetButton = () => {
    setState({
      recurrence: initialRecurrence,
    });
  };
  const handleCancelButton = () => {
    setIsRepeatVisible(!isRepeatVisible);
    setState({
      recurrence: initialRecurrence,
    });
  };
  const handleDoneButton = () => {
    setIsRepeatVisible(!isRepeatVisible);
  };
  const selectedDate = weekDaysV2
    .map((w, index) => ({
      ...w,
      index,
    }))
    .filter(item => data?.daysOfWeek?.includes(item.index));
  return (
    <>
      <View style={styles.dateTimeContainer}>
        <View style={styles.timeDateContainer}>
          <CalendarIconSmall />
          <Text style={styles.timeDateLabel}>
            {additionalData.e ? 'Event Time & Date' : 'Task Time & Date'}
          </Text>
        </View>
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateTimeLabel}>Start Time:</Text>
          <TouchableOpacity
            onPress={() => {
              if (
                data.from === 'update' &&
                selectedEventV2?.recurrence?.isRecurring
              ) {
                return showToast({message: 'Recurring Time cannot update'});
              }
              setPickerState('dateTime');
              setFrom('startDate');
              setIsPickerVisible(true);
            }}
            style={styles.dateTimePicker}>
            <Text style={styles.timeDateText}>
              {moment(data.startTime).format('LLL')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateTimeLabel}>End Date:</Text>
          <TouchableOpacity
            onPress={() => {
              if (
                data.from === 'update' &&
                selectedEventV2?.recurrence?.isRecurring
              ) {
                return showToast({message: 'Recurring Time cannot update'});
              }
              setPickerState('dateTime');
              setFrom('endDate');
              setIsPickerVisible(true);
            }}
            style={styles.dateTimePicker}>
            <Text style={styles.timeDateText}>
              {moment(data?.endTime).format('LLL')}
            </Text>
          </TouchableOpacity>
        </View>
        {data.from !== 'update' &&
          !selectedEventV2?.recurrence?.isRecurring && (
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                onPress={() =>
                  data.from === 'update' &&
                  !selectedEventV2?.recurrence?.isRecurring
                    ? showToast({
                        message: 'Single Event/Task can not be recurrence',
                      })
                    : setIsRepeatVisible(!isRepeatVisible)
                }
                style={styles.allDayContainer}>
                <IoniconsIcon name="repeat" size={30} color={'#546A7E'} />
                <Text style={styles.allDayText}>Repeat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setState({isAllDay: !data.isAllDay});
                }}
                style={styles.allDayContainer}>
                {data.isAllDay ? (
                  <CheckIcon color={Colors.Primary} />
                ) : (
                  <UnCheckIcon color={Colors.BodyText} />
                )}
                <Text style={styles.allDayText}>All Day</Text>
              </TouchableOpacity>
            </View>
          )}
        {selectedDate && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: gGap(10),
              flexWrap: 'wrap',
              flex: 1,
            }}>
            {selectedDate.map(i => (
              <PressableScale
                onPress={() => {
                  const currentDaysOfWeek = data.daysOfWeek;

                  const idxExists = currentDaysOfWeek?.includes?.(i.index)
                    ? true
                    : false;
                  const ruc =
                    data.daysOfWeek.length === 0
                      ? true
                      : currentDaysOfWeek.filter(
                          (day: number) => day !== i.index,
                        ).length === 0
                      ? false
                      : true;
                  setState({
                    recurrence: {
                      frequency: data.frequency,
                      isRecurring: ruc,
                      interval: data.interval,
                      endRecurrence: data.endRecurrence
                        ? data.endRecurrence
                        : ruc
                        ? moment(data.startTime).add(9, 'months').toISOString()
                        : null,
                      daysOfWeek: idxExists
                        ? currentDaysOfWeek.filter(
                            (day: number) => day !== i.index,
                          )
                        : [...currentDaysOfWeek, i.index],
                    },
                  });
                }}
                style={{
                  backgroundColor: Colors.Primary,
                  paddingHorizontal: gGap(5),
                  paddingVertical: gGap(3),
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RNText style={{color: Colors.PureWhite}}>{i.day}</RNText>
                <CrossIcon color={Colors.Red} />
              </PressableScale>
            ))}
          </View>
        )}
      </View>
      {isRepeatVisible && (
        <View style={styles.repeatBoxContainer}>
          {/* <Text style={styles.repeatHeading}>Repeat</Text> */}
          {/* <Divider2 /> */}
          <View style={styles.week}>
            <Text style={styles.repeat}>Repeat Every</Text>
            <CustomDropDownTwo
              flex={0.6}
              background={Colors.Foreground}
              data={['Daily', 'Weekly', 'Monthly']}
              setState={(period: string) => {
                console.log('period', JSON.stringify(period, null, 2));
                setState({
                  recurrence: {
                    frequency: period.toLowerCase(),
                    isRecurring: data.isRecurring,
                    interval: data.interval,
                    daysOfWeek: data.daysOfWeek,
                    endRecurrence:
                      data.endRecurrence ||
                      moment(data.startTime).add(9, 'months').toISOString(),
                  },
                });
              }}
              state={data.frequency}
              containerStyle={{zIndex: 10}}
            />
          </View>
          {data.frequency !== 'weekly' && (
            <Text style={[styles.repeat, {marginVertical: gGap(5)}]}>
              This {additionalData.e ? 'event' : 'to-do'} will repeat{' '}
              {data?.frequency}
            </Text>
          )}
          {data?.frequency === 'weekly' && (
            <>
              <Text style={styles.repeat}>Repeat on Week</Text>
              <View style={styles.weekDayContainer}>
                {weekDays.map((item, index) => {
                  const daysOfWeek = data.daysOfWeek;
                  const indexExists = daysOfWeek.includes(index);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const currentDaysOfWeek = data.daysOfWeek;

                        const idxExists = currentDaysOfWeek?.includes?.(index)
                          ? true
                          : false;
                        const ruc =
                          data.daysOfWeek.length === 0
                            ? true
                            : currentDaysOfWeek.filter(
                                (day: number) => day !== index,
                              ).length === 0
                            ? false
                            : true;
                        setState({
                          recurrence: {
                            frequency: data.frequency,
                            isRecurring: ruc,
                            interval: data.interval,
                            endRecurrence: data.endRecurrence
                              ? data.endRecurrence
                              : ruc
                              ? moment(data.startTime)
                                  .add(9, 'months')
                                  .toISOString()
                              : null,
                            daysOfWeek: idxExists
                              ? currentDaysOfWeek.filter(
                                  (day: number) => day !== index,
                                )
                              : [...currentDaysOfWeek, index],
                          },
                        });
                      }}
                      style={[styles.weekDay, indexExists && styles.toggled]}>
                      <Text
                        style={
                          indexExists
                            ? styles.toggledColor
                            : styles.unSelectedWeekDayColor
                        }>
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              setPickerState('date');
              setIsPickerVisible(!isPickerVisible);
              setFrom('recurrence');
            }}
            style={styles.endRecBtnCon}>
            {data.endRecurrence ? (
              <Text style={styles.endRecText}>{`End Recurrence${
                data.endRecurrence && ':'
              } ${
                data.endRecurrence
                  ? moment(data.endRecurrence).format('MMM DD, YYYY')
                  : ''
              }`}</Text>
            ) : (
              <Text style={styles.endRecText}>Select Recurrence</Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: gPadding(10),
            }}>
            <CustomSmallButton
              toggleModal={handleResetButton}
              textColor={Colors.SecondaryButtonTextColor}
              backgroundColor={Colors.SecondaryButtonBackgroundColor}
              buttonText="Reset"
              containerStyle={{
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                borderRadius: gBorderRadius(5),
              }}
            />
            <CustomSmallButton
              toggleModal={handleCancelButton}
              textColor={Colors.Primary}
              backgroundColor={Colors.PrimaryOpacityColor}
              buttonText="Cancel"
              containerStyle={{
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                borderRadius: gBorderRadius(5),
              }}
            />
            <CustomSmallButton
              toggleModal={handleDoneButton}
              textColor="white"
              backgroundColor={Colors.Primary}
              buttonText="Done"
              containerStyle={{
                borderWidth: 0,
                borderColor: Colors.BorderColor,
                borderRadius: gBorderRadius(5),
              }}
            />
          </View>
        </View>
      )}
      <CustomTimePicker
        mode={pickerState}
        isPickerVisible={isPickerVisible}
        setIsPickerVisible={setIsPickerVisible}
        showPreviousDate={true}
        initialDate={
          from === 'recurrence'
            ? data.endRecurrence
              ? moment(data.endRecurrence).format('YYYY-MM-DD')
              : moment(data.startTime).add(9, 'months').format('YYYY-MM-DD')
            : moment(data.startTime).format('YYYY-MM-DD')
        }
        setDate={date => {
          if (from === 'recurrence') {
            setState({
              recurrence: {
                frequency: data.frequency,
                isRecurring: data.isRecurring,
                interval: data.interval,
                endRecurrence: moment(date).toISOString(),
                daysOfWeek: data.daysOfWeek,
              },
            });
          }

          if (from === 'startDate') {
            setState({
              startTime: date,
              endTime: moment(date).add(30, 'minutes').toISOString(),
            });
          }
          if (from === 'endDate') {
            setState({
              endTime: date,
            });
          }
        }}
        time={
          from === 'startDate'
            ? moment(data?.startTime).format('hh:mm A')
            : from === 'endDate'
            ? moment(data?.endTime).format('hh:mm A')
            : from === 'recurrence'
            ? moment(data?.endRecurrence).format('hh:mm A')
            : moment().format('hh:mm A')
        }
      />
    </>
  );
};

export default EventDateTimeSectionV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    overlay: {
      backgroundColor: 'transparent',
      position: 'absolute',
      width: responsiveScreenWidth(100),
      height: responsiveScreenHeight(100),
      zIndex: 1,
    },
    endRecText: {
      color: Colors.Primary,
      fontSize: fontSizes.body,
    },
    endRecBtnCon: {
      backgroundColor: Colors.PrimaryOpacityColor,
      width: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.small,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingVertical: padding.small,
    },
    repeatBoxContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: gPadding(10),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      gap: gPadding(5),
      marginBottom: gMargin(10),
      zIndex: 2,
    },
    repeatHeading: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
    },
    repeat: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 1,
      marginBottom: gPadding(-5),
    },
    weekDayContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    weekDay: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.Foreground,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: responsiveScreenWidth(50),
    },
    toggled: {
      backgroundColor: Colors.Primary,
    },
    unSelectedWeekDayColor: {
      color: Colors.Heading,
    },
    toggledColor: {
      color: Colors.PureWhite,
    },
    bottomButtonContainer: {
      flexDirection: 'row',
      gap: gPadding(15),
    },
    dateTimeContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      gap: 10,
      marginBottom: 10,
      zIndex: 1,
    },
    timeDateContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1.5),
      paddingBottom: 10,
      alignItems: 'center',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    timeDateLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1,
      gap: 10,
    },
    dateTimeLabel: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    dateTimePicker: {
      backgroundColor: Colors.Foreground,
      paddingVertical: 3,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    timeDateText: {
      color: Colors.SecondaryButtonTextColor,
      fontFamily: CustomFonts.REGULAR,
    },
    allDayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      // backgroundColor: 'red',
      paddingHorizontal: gPadding(5),
      borderWidth: 2,
      borderColor: Colors.LineColor,
      borderRadius: gBorderRadius(5),
    },
    allDayText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
  });
