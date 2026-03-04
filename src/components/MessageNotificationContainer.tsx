import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {useTheme} from '../context/ThemeContext';
import MessageIconLive from '../assets/Icons/MessageIconLive';
import NotificationIconLive from '../assets/Icons/NotificationIconLive';
import {RootState} from '../types/redux/root';
import {TColors} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {TChat} from '../types/chat/chatTypes';
import {getFromMMKV} from '../utility/mmkvHelpers';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function MessageNotificationContainer() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {chats} = useSelector((state: RootState) => state.chat);
  const {notificationCount} = useSelector(
    (state: RootState) => state.notification,
  );

  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const unreadCounts = useMemo(() => {
    return (
      chats?.filter(
        (chat: TChat) =>
          Boolean(chat?.unreadCount) &&
          chat?.myData?.user !== chat?.latestMessage?.sender?._id &&
          !chat?.isArchived,
      ).length || 0
    );
  }, [chats]);

  const hasMenu = useCallback((menuId: string) => {
    const navigationData = getFromMMKV('navigationData');
    if (!Array.isArray(navigationData)) return false;
    return !!navigationData.find((menu: any) => menu.id === menuId);
  }, []);

  const hasChat = hasMenu('portal-my-chats');
  const hasNotification =
    hasMenu('notifications') || hasMenu('notification-preferences');

  // ---------- Reanimated: badge pulse / bounce ----------
  const badgePulse = useSharedValue(0);

  const badgeAnimStyle = useAnimatedStyle(() => {
    // subtle bounce + tiny scale
    const scale = 1 + badgePulse.value * 0.12; // 1 -> 1.12
    const translateY = -badgePulse.value * 2; // 0 -> -2
    return {
      transform: [{translateY}, {scale}],
    };
  }, []);

  const startLoop = useCallback(() => {
    // repeats every few seconds: quick double-bounce then wait
    cancelAnimation(badgePulse);
    badgePulse.value = 0;

    badgePulse.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 160, easing: Easing.out(Easing.quad)}),
        withTiming(0, {duration: 180, easing: Easing.out(Easing.quad)}),
        withDelay(
          2400, // wait before next pulse
          withSequence(
            withTiming(1, {duration: 160, easing: Easing.out(Easing.quad)}),
            withTiming(0, {duration: 180, easing: Easing.out(Easing.quad)}),
          ),
        ),
      ),
      -1,
      false,
    );
  }, [badgePulse]);

  const triggerOnce = useCallback(() => {
    // pulse once (for focus)
    cancelAnimation(badgePulse);
    badgePulse.value = 0;
    badgePulse.value = withSequence(
      withTiming(1, {duration: 180, easing: Easing.out(Easing.quad)}),
      withTiming(0, {duration: 220, easing: Easing.out(Easing.quad)}),
    );
  }, [badgePulse]);

  // Start/refresh when this screen gets focus
  useFocusEffect(
    useCallback(() => {
      triggerOnce();
      startLoop();
      return () => cancelAnimation(badgePulse);
    }, [startLoop, triggerOnce, badgePulse]),
  );

  const showChatBadge = hasChat && unreadCounts > 0;
  const notifUnread = notificationCount?.totalUnread || 0;
  const showNotifBadge = hasNotification && notifUnread !== 0;

  return (
    <>
      {hasChat && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
          }
          style={styles.messageContainer}>
          {showChatBadge && (
            <AnimatedText
              style={[
                styles.badge,
                {backgroundColor: Colors.Red},
                badgeAnimStyle,
              ]}>
              {unreadCounts}
            </AnimatedText>
          )}
          <MessageIconLive />
        </TouchableOpacity>
      )}

      {hasNotification && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('HomeStack', {screen: 'NotificationScreen'})
          }
          style={styles.notificationContainer}>
          {showNotifBadge && (
            <AnimatedText style={[styles.badge, badgeAnimStyle]}>
              {notifUnread > 99 ? '99+' : notifUnread}
            </AnimatedText>
          )}
          <NotificationIconLive />
        </TouchableOpacity>
      )}
    </>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    messageContainer: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: Colors.Foreground,
      marginRight: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    notificationContainer: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: Colors.Foreground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    badge: {
      backgroundColor: Colors.Red,
      color: Colors.PureWhite,
      position: 'absolute',
      zIndex: 10,
      top: 0,
      right: 0,
      padding: 1,
      paddingHorizontal: 5,
      borderRadius: 5,
      overflow: 'hidden',
      minWidth: 15,
      textAlign: 'center',
    },
  });
