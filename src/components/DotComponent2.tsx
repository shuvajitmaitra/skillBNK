import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import GreenDotSvgComponent from '../assets/Icons/GreenDotSvgComponent';
import OrangeDotSvgComponent from '../assets/Icons/OrangeDotSvgComponent';
import RedDotSvgComponent from '../assets/Icons/RedDotSvgComponent';
import BlueDotSvgComponent from '../assets/Icons/BlueDotSvgComponent';
import PurpleLightSvgComponent from '../assets/Icons/PurpleLightSvgComponent';
import {useTheme} from '../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventStatus,
  setMonthViewData,
  updateCalendar,
} from '../store/reducer/calendarReducer';
import moment from 'moment';
import CustomFonts from '../constants/CustomFonts';
import {RegularFonts} from '../constants/Fonts';
import {RootState} from '../types/redux/root';
import {TColors} from '../types';
import {IEvent} from '../types/calendar/event';

// 1. Define a union type for event statuses.
type EventStatus =
  | 'all'
  | 'accepted'
  | 'myEvents'
  | 'pending'
  | 'denied'
  | 'proposedNewTime';

// 2. Define types for the objects we'll create.
interface FormattedEvent {
  title: string;
  data: IEvent;
}

interface GroupedEvent {
  title: string;
  data: IEvent[];
}

const DotComponent2: React.FC = () => {
  const {events, eventStatus} = useSelector(
    (state: RootState) => state.calendar,
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // 3. Annotate the function parameter with the union type.
  const handleButtonPress = (status: EventStatus) => {
    console.log('status', JSON.stringify(status, null, 2));
    if (status === eventStatus) {
      return;
    }
    dispatch(setEventStatus(status));

    // Filter events based on the selected status.
    const filteredEvents: IEvent[] =
      status === 'all'
        ? events
        : status === 'myEvents'
        ? events.filter((item: IEvent) => item.createdBy?._id === user._id)
        : events.filter(
            (item: IEvent) => item.myParticipantData?.status === status,
          );

    // Map filtered events into an array of FormattedEvent.
    const formattedEvents: FormattedEvent[] = filteredEvents.map(
      (e: IEvent) => ({
        title: moment(e.start).format('YYYY-M-D'),
        data: e,
      }),
    );

    // Use a Map to group events by date.
    const groupedEvents: GroupedEvent[] = [
      ...formattedEvents
        .reduce<Map<string, GroupedEvent>>((map, {title, data}) => {
          if (!map.has(title)) {
            map.set(title, {title, data: []});
          }
          // We can use the non-null assertion (!) because we just created the entry if it didn't exist.
          map.get(title)!.data.push(data);
          return map;
        }, new Map<string, GroupedEvent>())
        .values(),
    ];

    // Build an object where the keys are the event dates.
    const monthViewData: Record<string, GroupedEvent> = groupedEvents.reduce(
      (acc, item) => {
        acc[item.title] = item;
        return acc;
      },
      {} as Record<string, GroupedEvent>,
    );

    // Dispatch the new month view data and calendar updates.
    dispatch(setMonthViewData(monthViewData));
    dispatch(updateCalendar(groupedEvents));
  };

  return (
    <View style={styles.dotContainer}>
      <TouchableOpacity
        onPress={() => handleButtonPress('all')}
        style={styles.dot}>
        <Text
          style={[
            styles.text,
            eventStatus === 'all' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          All Events
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('accepted')}
        style={styles.dot}>
        <GreenDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'accepted' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Accepted
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('myEvents')}
        style={styles.dot}>
        <PurpleLightSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'myEvents' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          My Events
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('pending')}
        style={styles.dot}>
        <OrangeDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'pending' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('denied')}
        style={styles.dot}>
        <RedDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'denied' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Denied
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('proposedNewTime')}
        style={styles.dot}>
        <BlueDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'proposedNewTime' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Proposed New Time
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DotComponent2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    text: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BS,
    },
    dotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: responsiveScreenWidth(4),
      flexWrap: 'wrap',
      paddingTop: 10,
    },
    dotCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(11),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dot: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingBottom: 5,
      marginRight: 12,
    },
  });
