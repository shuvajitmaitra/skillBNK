// components/EventRepeatSection.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomSmallButton from '../../CustomSmallButton';
import Divider from '../../SharedComponent/Divider';
import CustomDropDownTwo from '../../SharedComponent/CustomDropDownTwo';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import {TColors} from '../../../types';
import {ITimeRange} from '../../../types/calendar/event';

interface WeekDay {
  day: string;
  checked?: boolean;
}

interface EventRepeatSectionProps {
  // We require that event has a defined timeRange
  event: {timeRange: ITimeRange};
  setEvent: (event: any) => void;
  weekDays: WeekDay[];
  handleCancelButton: () => void;
  handleDoneButton: () => void;
  handleResetButton: () => void;
}

const EventRepeatSection: React.FC<EventRepeatSectionProps> = ({
  event,
  setEvent,
  weekDays,
  handleCancelButton,
  handleDoneButton,
  handleResetButton,
}) => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.repeatBoxContainer}>
      <Text style={styles.repeatHeading}>Repeat</Text>
      <Divider marginBottom={-0.00001} marginTop={0.000001} />
      <View style={styles.week}>
        <Text style={styles.repeat}>Repeat Every</Text>
        <CustomDropDownTwo
          flex={0.6}
          data={['Day', 'Week', 'Month']}
          setState={(period: string) => {
            setEvent((pre: any) => ({
              ...pre,
              timeRange: {
                ...pre.timeRange,
                repeatPeriod: period,
              },
            }));
          }}
          state={event?.timeRange?.repeatPeriod}
        />
      </View>
      <Text style={styles.repeat}>Repeat on Week</Text>
      <View style={styles.weekDayContainer}>
        {weekDays.map((item, index) => {
          const {repeatDays} = event.timeRange;
          const indexExists = repeatDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setEvent((pre: any) => {
                  const {rep} = pre.timeRange;
                  const idxExists = rep.includes(index);
                  return {
                    ...pre,
                    timeRange: {
                      ...pre.timeRange,
                      repeatDays: idxExists
                        ? repeatDays.filter((day: number) => day !== index)
                        : [...repeatDays, index],
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}>
        <CustomSmallButton
          toggleModal={handleResetButton}
          textColor={Colors.SecondaryButtonTextColor}
          backgroundColor={Colors.SecondaryButtonBackgroundColor}
          buttonText="Reset"
        />
        <CustomSmallButton
          toggleModal={handleCancelButton}
          textColor="#27ac1f"
          backgroundColor="rgba(39, 172, 31, 0.1)"
          buttonText="Cancel"
        />
        <CustomSmallButton
          toggleModal={handleDoneButton}
          textColor="white"
          backgroundColor="#27ac1f"
          buttonText="Done"
        />
      </View>
    </View>
  );
};

export default EventRepeatSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    repeatBoxContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      gap: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
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
