import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
  setEventDetails,
  setUpdateEventInfo,
} from '../../store/reducer/calendarReducer';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {IEvent} from '../../types/calendar/event';
import {TUserData} from '../../types/auth/user';

interface DayEventProps {
  DayOffset: number;
  user: TUserData;
  eventType: (type: string) => string;
}

const DayEvent = ({DayOffset, user, eventType}: DayEventProps) => {
  const dispatch = useDispatch();
  const {monthViewData} = useSelector((state: RootState) => state.calendar);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  var startOfDay = moment().add(DayOffset, 'days').startOf('day');
  const dayEvent = monthViewData[moment(startOfDay).format('YYYY-M-D')];
  if (!dayEvent?.data?.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      {dayEvent?.data?.length > 0 ? (
        dayEvent?.data?.map((item: IEvent) => (
          <TouchableOpacity
            onPress={() => {
              user._id === item?.createdBy?._id
                ? dispatch(setUpdateEventInfo(item))
                : dispatch(setEventDetails(item));
            }}
            key={item._id}
            style={[
              {
                backgroundColor: eventType(
                  item?.eventType ? item.eventType : 'other',
                ),
                // width: "70%",
                flexDirection: 'row',
                borderRadius: 100,
                alignItems: 'center',
                paddingHorizontal: responsiveScreenWidth(2),
              },
            ]}>
            <View
              style={{
                paddingVertical: responsiveScreenHeight(0.2),
                marginRight: 5,
              }}>
              <Text numberOfLines={1} style={styles.itemText}>
                {item?.title.slice(0, 10)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{
            width: '100%',
          }}>
          <Text style={styles.notAvailable}>No Event Available</Text>
        </View>
      )}
    </View>
  );
};

export default DayEvent;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    container: {
      backgroundColor: Colors.Foreground,
      marginBottom: 10,
      paddingVertical: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    notAvailable: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      textAlign: 'center',
    },
  });
