import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import CalendarScreenV2 from '../screens/NewCalendar/CalendarScreenV2';
import CalendarInvitationsV2 from '../screens/NewCalendar/CalendarInvitationsV2';
import {CalendarStackParamList} from '../types/navigation';
import EventDetailsScreen from '../screens/NewCalendar/EventDetailsScreen';

const MyCalenderStack = createStackNavigator<CalendarStackParamList>();

const MyCalenderStackScreen = () => (
  <MyCalenderStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    {/* <MyCalenderStack.Screen
      name="CalendarScreen"
      component={CalendarScreen}
      options={() => ({
        headerTitle: '',
        headerShown: false,
      })}
    /> */}
    <MyCalenderStack.Screen
      name="CalendarScreenV2"
      component={CalendarScreenV2}
      options={() => ({
        headerTitle: '',
        headerShown: false,
      })}
    />
    <MyCalenderStack.Screen
      name="CalendarInvitationsV2"
      component={CalendarInvitationsV2}
      options={() => ({
        headerTitle: '',
        headerShown: false,
      })}
    />
    <MyCalenderStack.Screen
      name="EventDetailsScreen"
      component={EventDetailsScreen}
      options={() => ({
        headerTitle: '',
        headerShown: false,
      })}
    />
  </MyCalenderStack.Navigator>
);

export default MyCalenderStackScreen;
