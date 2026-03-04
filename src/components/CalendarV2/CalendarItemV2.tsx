import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import RightArrowLong from '../../assets/Icons/RightArrowLong';
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
} from '../../store/reducer/calendarReducer';
import {RootState} from '../../types/redux/root';
import {IEvent, ITotalEvents} from '../../types/calendar/event';
import {TColors} from '../../types';
type CalendarItemsProps = {
  item: ITotalEvents;
};
export const CalendarItemsV2 = (item: CalendarItemsProps) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const Colors = useTheme();
  const styles = getStyles(Colors);

  function getDayOfWeek(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {weekday: 'short'});
  }
  return (
    <View style={styles.eventTopicContainer}>
      <View style={styles.eventDateContainer}>
        <View>
          <Text style={styles.eventDay}>{getDayOfWeek(item.item.title)}</Text>
          <Text style={styles.eventDateNumber}>
            {moment(item.item.title).format('DD')}
          </Text>
        </View>
        <RightArrowLong />
      </View>
      {/* <View style={{width: '70%'}} /> */}
      <View style={{gap: 10}}>
        {item?.item?.data?.map((singleItem: IEvent) => {
          return (
            <View key={singleItem?._id} style={styles.viewWidth}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  user._id === singleItem?.createdBy?._id
                    ? dispatch(setUpdateEventInfo(singleItem))
                    : dispatch(setEventDetails(singleItem));
                }}
                style={[
                  styles.eventTitleAndDateContainer,
                  {
                    backgroundColor:
                      (singleItem?.eventType === 'showNTell' && '#619dcc') ||
                      (singleItem?.eventType === 'mockInterview' &&
                        '#f59f9f') ||
                      (singleItem?.eventType === 'orientation' && '#379793') ||
                      (singleItem?.eventType === 'technicalInterview' &&
                        '#f8a579') ||
                      (singleItem?.eventType === 'behavioralInterview' &&
                        '#0091b9') ||
                      (singleItem?.eventType === 'reviewMeeting' &&
                        '#7ccc84') ||
                      (singleItem?.eventType === 'syncUp' && '#ff6502') ||
                      (singleItem?.eventType === 'other' && Colors.OthersColor),
                  } as any,
                ]}>
                <Text
                  style={{
                    color: Colors.PureWhite,
                    fontFamily: CustomFonts.MEDIUM,
                  }}>
                  {singleItem?.title}
                </Text>
                <Text
                  style={{
                    color: Colors.PureWhite,
                    fontFamily: CustomFonts.REGULAR,
                    fontSize: responsiveScreenFontSize(1.5),
                  }}>
                  {moment(singleItem?.start).format('h:mm A') +
                    ' - ' +
                    moment(singleItem?.end).format('h:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    EditorNameDate: {
      fontSize: responsiveScreenFontSize(1.4),
      paddingTop: responsiveScreenHeight(0.5),
      color: '#546A7E',
      width: '100%',
    },
    eventTitleAndDateContainer: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(0.5),
      // marginBottom: 8,
      borderRadius: 10,
      width: '100%',
    },
    viewWidth: {
      // backgroundColor: 'salmon',
      width: responsiveScreenWidth(65),
      flex: 1,
      flexDirection: 'column',
    },
    eventDateNumber: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      color: Colors.Heading,
    },
    eventDay: {
      color: Colors.BodyText,
    },
    eventTopicContainer: {
      flexDirection: 'row',
      // gap: responsiveScreenWidth(4),
      // justifyContent: "space-between",
    },
    eventDateContainer: {
      width: '15%',
      flexDirection: 'row',
      // alignItems: "center",
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(1),
      // width: "100%",
      marginRight: 10,
    },
  });
