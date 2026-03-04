// components/EventRepeatSectionV2.tsx
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomSmallButton from '../../CustomSmallButton';
import CustomDropDownTwo from '../../SharedComponent/CustomDropDownTwo';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import {
  borderRadius,
  fontSizes,
  gBorderRadius,
  gMargin,
  gPadding,
  padding,
} from '../../../constants/Sizes';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import moment from 'moment';
import {TColors} from '../../../types';

/*========================================================================
  Local Type Declarations
========================================================================*/

// Interface for event recurrence information.
export interface IRecurrence {
  isRecurring: boolean;
  interval: number; // required property
  frequency: string;
  daysOfWeek: string[]; // e.g., ["0", "1", ...]
  endRecurrence: string | null;
}
// Minimal event interface needed by this component.
export interface IEventV2 {
  _id?: string;
  recurrence?: IRecurrence;
  // Other event properties can be added as needed.
}

// Interface for a weekday item.
interface WeekDay {
  day: string;
  checked?: boolean;
}

// Props for the EventRepeatSectionV2 component.
interface EventRepeatSectionProps {
  event: Partial<IEventV2>;
  setEvent: React.Dispatch<React.SetStateAction<Partial<IEventV2>>>;
  weekDays: WeekDay[];
  handleCancelButton: () => void;
  handleDoneButton: () => void;
  handleResetButton: () => void;
}

const EventRepeatSectionV2: React.FC<EventRepeatSectionProps> = ({
  event,
  setEvent,
  weekDays,
  handleCancelButton,
  handleDoneButton,
  handleResetButton,
}) => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  return (
    <>
      <View style={styles.repeatBoxContainer}>
        {/* <Text style={styles.repeatHeading}>Repeat</Text> */}
        {/* <Divider2 /> */}
        <View style={styles.week}>
          <Text style={styles.repeat}>Repeat Every</Text>
          <CustomDropDownTwo
            flex={0.6}
            background={Colors.Foreground}
            data={['Day', 'Week', 'Month']}
            setState={(period: string) => {
              setEvent(pre => {
                const recurrence = pre.recurrence || {
                  isRecurring: true,
                  interval: 1,
                  frequency: 'daily',
                  daysOfWeek: [],
                  endRecurrence: null,
                };

                return {
                  ...pre,
                  recurrence: {
                    ...recurrence,
                    frequency:
                      period === 'Week'
                        ? 'weekly'
                        : period === 'Month'
                        ? 'monthly'
                        : 'daily',
                    isRecurring: true,
                  },
                };
              });
            }}
            state={
              event?.recurrence?.frequency === 'weekly'
                ? 'Week'
                : event?.recurrence?.frequency === 'monthly'
                ? 'Month'
                : 'Day'
            }
          />
        </View>
        <Text style={styles.repeat}>Repeat on Week</Text>
        <View style={styles.weekDayContainer}>
          {weekDays.map((item, index) => {
            const daysOfWeek = event?.recurrence?.daysOfWeek || [];
            const indexExists = daysOfWeek.includes(index.toString());
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setEvent(pre => {
                    const recurrence = pre?.recurrence || {
                      isRecurring: true,
                      interval: 1,
                      frequency: 'daily',
                      daysOfWeek: [],
                      endRecurrence: null,
                    };

                    const currentDaysOfWeek = recurrence.daysOfWeek;
                    const idxExists = currentDaysOfWeek.includes(
                      index.toString(),
                    );

                    return {
                      ...pre,
                      recurrence: {
                        ...recurrence,
                        isRecurring: true,
                        daysOfWeek: idxExists
                          ? currentDaysOfWeek.filter(
                              (day: string) => day !== index.toString(),
                            )
                          : [...currentDaysOfWeek, index.toString()],
                      },
                    };
                  })
                }
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
        <TouchableOpacity
          onPress={() => setIsPickerVisible(!isPickerVisible)}
          style={styles.endRecBtnCon}>
          <Text style={styles.endRecText}>{`End Recurrence${
            event?.recurrence?.endRecurrence ? ':' : ''
          } ${
            event?.recurrence?.endRecurrence
              ? moment(event.recurrence.endRecurrence).format('MMM DD, YYYY')
              : ''
          }`}</Text>
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
      {isPickerVisible && (
        <CustomTimePicker
          mode="date"
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
          initialDate={moment(event.recurrence?.endRecurrence).format(
            'YYYY-MM-DD',
          )}
          setDate={date => {
            setEvent(pre => {
              const recurrence = pre.recurrence || {
                isRecurring: true,
                interval: 1,
                frequency: 'daily',
                daysOfWeek: [],
                endRecurrence: null,
              };

              return {
                ...pre,
                recurrence: {
                  ...recurrence,
                  isRecurring: true,
                  endRecurrence: moment(date).endOf('day').toISOString(),
                },
              };
            });
          }}
        />
      )}
    </>
  );
};

export default EventRepeatSectionV2;

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
  });
