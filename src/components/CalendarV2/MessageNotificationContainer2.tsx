import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../../context/ThemeContext';
import MessageIconLive from '../../assets/Icons/MessageIconLive';
import {setNotifications} from '../../store/reducer/notificationReducer';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TChat} from '../../types/chat/chatTypes';
import {RootStackParamList} from '../../types/navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
const IIcon = Ionicons as any;

export default function MessageNotificationContainer2() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let {chats} = useSelector((state: RootState) => state.chat);
  let {notificationCount} = useSelector(
    (state: RootState) => state.notification,
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const unreadCounts = chats?.filter(
    (chat: TChat) =>
      Boolean(chat?.unreadCount) &&
      chat?.myData?.user !== chat?.latestMessage?.sender?._id &&
      !chat?.isArchived,
  ).length;
  return (
    <View style={{backgroundColor: 'red', flexDirection: 'row'}}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
        }
        style={styles.messageContainer}>
        {Boolean(unreadCounts) && (
          <Text style={[styles.badge, {backgroundColor: Colors.Red}]}>
            {chats && unreadCounts}
          </Text>
        )}

        <MessageIconLive />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setNotifications([]));
          navigation.navigate('HomeStack', {screen: 'NotificationScreen'});
        }}
        style={styles.notificationContainer}>
        {/* {notificationCount?.totalUnread && ( */}
        {notificationCount?.totalUnread !== 0 && (
          <Text style={[styles.badge]}>
            {notificationCount?.totalUnread > 99
              ? '99+'
              : notificationCount?.totalUnread}
          </Text>
        )}

        <IIcon name="notifications-outline" size={25} color={Colors.BodyText} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    messageContainer: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: Colors.Red,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    notificationContainer: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: Colors.Foreground,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    messageIcon: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
    },
    badge: {
      backgroundColor: Colors.Foreground,
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
