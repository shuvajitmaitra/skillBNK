import React, {useState, useMemo, useRef, useEffect} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {useTheme} from '../../context/ThemeContext';
import CalendarHeaderV2 from '../../components/CalendarV2/CalendarHeaderV2';
import CalendarV2 from '../../components/CalendarV2/CalendarV2';
import {TColors} from '../../types';
import {CalendarDataV2} from '../../components/CalendarV2/CalendarDataV2';
import EventDetailsModalV2 from '../../components/CalendarV2/Modal/EventDetailsModalV2';
import FloatingActionButtonV2 from '../../components/CalendarV2/FloatingActionButtonV2';
import AddNewEventModalV2 from '../../components/CalendarV2/AddNewEventModalV2';
import {setNewEventData} from '../../store/reducer/calendarReducerV2';
import UpdateEventModalV2 from '../../components/CalendarV2/UpdateEventModalV2';
import {loadInvitationsCount} from '../../actions/apiCall2';
import {theme} from '../../utility/commonFunction';

export function numberToMonth(monthNumber: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return months[monthNumber - 1];
}

const CalendarScreenV2 = () => {
  const {selectedEventV2, newEventData, calendarInfo} = useSelector(
    (state: RootState) => state.calendarV2,
  );

  const dispatch = useDispatch();
  const Colors = useTheme();

  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const timeRef = useRef<ScrollView>(null);
  const handleSeeMore = () => {
    setSeeMoreClicked(!seeMoreClicked);
    if (seeMoreClicked) {
      timeRef?.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    loadInvitationsCount();

    return () => {};
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Foreground,
        position: 'relative',
      }}>
      <FloatingActionButtonV2
        onEventPress={() => {
          dispatch(setNewEventData({isModalVisible: true, eventType: 'event'}));
        }}
        onTaskPress={() => {
          dispatch(setNewEventData({isModalVisible: true, eventType: 'task'}));
        }}
      />
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <CalendarHeaderV2 />
      <ScrollView ref={timeRef} style={styles.container}>
        <View style={styles.viewContainer}>
          <CalendarV2
            toggleModal={() => {}}
            seeMoreClicked={seeMoreClicked}
            handleSeeMore={handleSeeMore}
          />
          <CalendarDataV2 />
        </View>
        {selectedEventV2?._id && !calendarInfo.updateEventVisible && (
          <EventDetailsModalV2 />
        )}
        {newEventData?.isModalVisible && <AddNewEventModalV2 />}
        {selectedEventV2?._id && calendarInfo.updateEventVisible && (
          <UpdateEventModalV2 />
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarScreenV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
    },
    viewContainer: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 4,
    },
  });
