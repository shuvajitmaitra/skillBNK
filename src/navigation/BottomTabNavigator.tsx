// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';

import HomeStackScreen from './HomeStack';
import ProgramStackScreen from './ProgramStack';
import MyCalenderStackScreen from './MyCalenderStack';
import CommunityStackScreen from './CommunityStack';
import CustomTabBar from './CustomTabBar';
import {getFromMMKV} from '../utility/mmkvHelpers';
import {useSelector} from 'react-redux';
import {RootState} from '../types/redux/root';

export type RootTabParamList = {
  HomeStack: undefined;
  ProgramStack: undefined;
  MyCalenderStack: undefined;
  CommunityStack: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const getTabBarVisibility = (
  route: RouteProp<Record<string, object | undefined>, string>,
  hiddenRoutes: string[] = [],
): 'none' | 'flex' => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return hiddenRoutes.includes(routeName) ? 'none' : 'flex';
};

const BottomTabNavigator: React.FC = () => {
  const renderTabBar = (props: any) => <CustomTabBar {...props} />;
  const {accessToken} = useSelector((state: RootState) => state.auth);
  const hasMenu = (menuId: string) => {
    const navigationData = getFromMMKV('navigationData');

    if (!Array.isArray(navigationData)) {
      return false;
    }

    return navigationData.some((menu: any) => menu.id === menuId);
  };

  const hasProgram =
    hasMenu('my-program') ||
    hasMenu('portal-audio-video-sending') ||
    hasMenu('portal-template') ||
    hasMenu('portal-diagram') ||
    hasMenu('leaderboard');

  const hasCalendar = hasMenu('portal-calendar');
  const hasCommunity = hasMenu('portal-community');

  return (
    <Tab.Navigator
      key={accessToken}
      tabBar={renderTabBar}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={({route}) => ({
          tabBarLabel: 'Home',
          tabBarStyle: {
            display: getTabBarVisibility(route, [
              'Details',
              'AnotherHiddenScreen',
            ]),
          },
        })}
      />

      {hasProgram && (
        <Tab.Screen
          name="ProgramStack"
          component={ProgramStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Program',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['ProgramDetails']),
            },
          })}
        />
      )}

      {hasCalendar && (
        <Tab.Screen
          name="MyCalenderStack"
          component={MyCalenderStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Calendar',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['CalendarDetails']),
            },
          })}
        />
      )}

      {hasCommunity && (
        <Tab.Screen
          name="CommunityStack"
          component={CommunityStackScreen}
          options={({route}) => ({
            tabBarLabel: 'Community',
            tabBarStyle: {
              display: getTabBarVisibility(route, ['CommunityDetails']),
            },
          })}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
