import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {useSelector} from 'react-redux';
import MessageIconLive from '../assets/Icons/MessageIconLive';
import {RootState} from '../types/redux/root';
import {TColors} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {TChat} from '../types/chat/chatTypes';

type NotificationScreenHeaderProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'NotificationScreen'
  >;
};

const NotificationScreenHeader: React.FC<NotificationScreenHeaderProps> = ({
  navigation,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  let {chats} = useSelector((state: RootState) => state.chat);

  // const navigation = useNavigation();
  // console.log("navigation", JSON.stringify(navigation, null, 1));
  const unreadCounts = chats?.filter(
    (chat: TChat) =>
      Boolean(chat?.unreadCount) &&
      chat?.myData?.user !== chat?.latestMessage?.sender?._id &&
      !chat?.isArchived,
  ).length;
  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
            paddingBottom: 10,
          },
        ]}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.Foreground,
            padding: 10,
            borderRadius: 100,
          }}
          onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>

        <View style={styles.MessageNotificationContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
            }
            style={styles.messageContainer}>
            {Boolean(unreadCounts) && (
              <Text style={[styles.badge, {backgroundColor: Colors.Red}]}>
                {unreadCounts}
              </Text>
            )}

            <MessageIconLive />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NotificationScreenHeader;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
    messageContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      backgroundColor: Colors.Foreground,
      marginRight: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
