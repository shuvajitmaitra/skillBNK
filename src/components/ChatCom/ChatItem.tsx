import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';

import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {markRead, setSingleChat} from '../../store/reducer/chatReducer';
import CrowdIcon from '../../assets/Icons/CrowedIcon';
import AiBotIcon from '../../assets/Icons/AiBotIcon';
import UserIcon from '../../assets/Icons/UserIcon';
import GlobeIcon from '../../assets/Icons/GlobeIcon';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import BranchIcon from '../../assets/Icons/BranchIcon';
import OrgIcon from '../../assets/Icons/OrgIcon';
import DWordIcon from './DWord';
import LockIcon2 from '../../assets/Icons/LockIcon2';
import {RootState} from '../../types/redux/root';
import {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ILatestMessage, TChat} from '../../types/chat/chatTypes';
import {TColors} from '../../types';
import BellOffIcon from '../../assets/Icons/BellOffIcon';
import PinIcon from '../../assets/Icons/PinIcon';
import {convertToCorrectMarkdown} from './MessageHelper';

function formatTime(dateString: string) {
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const date = moment(dateString);

  if (date.isSame(today, 'd')) {
    return date.format('h:mm a'); // 12-hour format with AM/PM marker, no leading zero for hours
  } else if (date.isSame(yesterday, 'd')) {
    return 'Yesterday';
  } else {
    return date.format('MMM DD, YYYY'); // No leading zeros for days or months
  }
}

const generateActivityText = (message: ILatestMessage, senderName: string) => {
  let activity = message.activity;
  if (activity?.type === 'add') {
    return (
      <>
        {senderName} added {message?.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'remove') {
    return (
      <>
        {senderName} removed {message?.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'join') {
    return <>{message.activity?.user?.fullName} joined in this channel </>;
  } else if (activity?.type === 'leave') {
    return <>{message.activity?.user?.fullName} left this channel </>;
  } else {
    return <>N/A</>;
  }
};

function getText(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

function replaceMentionToName(str: string) {
  return str.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
}

type TProps = {
  chat: TChat;
  setChecked: (value: string) => void;
  active: boolean;
};
const ChatItem = ({chat, setChecked, active}: TProps) => {
  // console.log('active', JSON.stringify(active, null, 2));
  const {draftMessages} = useSelector((state: RootState) => state.chatSlice);
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const senderName =
    (chat?.latestMessage?.sender?._id === user?._id
      ? 'You'
      : chat?.latestMessage?.sender?.firstName?.split(' ')[0]) || 'User';
  const Colors = useTheme();
  const styles = getStyles(Colors);

  function removeMarkdown(text: string) {
    if (!text) {
      return '';
    }

    return text
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Italics
      .replace(/~~(.*?)~~/g, '$1') // Strikethrough
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/!\[.*?\]\(.*?\)/g, '') // Images
      .replace(/^\s*#{1,6}\s*/gm, '') // Headers
      .replace(/>\s?/g, '') // Blockquotes
      .replace(/^-{3,}\s*$/gm, '') // Horizontal rules
      .replace(/(?:^|\n)\s*-\s+/g, '\n') // Unordered lists
      .replace(/(?:^|\n)\s*\d+\.\s+/g, '\n') // Ordered lists
      .replace(/&#x20;/g, ' ') // Replace HTML space entity
      .replace(/\n{2,}/g, '\n') // Collapse newlines
      .trim();
  }
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => {
        setChecked('chats');
        dispatch(setSingleChat(chat));
        dispatch(setCurrentRoute('MessageScreen'));

        navigation.navigate('MessageScreen', {animationEnabled: true});
        dispatch(markRead({chatId: chat?._id}));
      }}>
      <View>
        {chat?.isChannel && chat?.avatar ? (
          <Image style={styles.profileImage} source={{uri: chat?.avatar}} />
        ) : chat?.isChannel && !chat?.avatar ? (
          <View style={styles.profileImage}>
            <CrowdIcon color={Colors.BodyText} size={30} />
          </View>
        ) : chat?.otherUser?.type === 'bot' ? (
          <View style={styles.profileImage}>
            <AiBotIcon color={Colors.BodyText} />
          </View>
        ) : !chat?.isChannel && chat?.otherUser?.profilePicture ? (
          <Image
            style={styles.profileImage}
            source={
              chat?.otherUser?.profilePicture
                ? {
                    uri: chat?.otherUser.profilePicture,
                  }
                : require('../../assets/Images/user.png')
            }
          />
        ) : (
          <View style={styles.profileImage}>
            <UserIcon color={Colors.BodyText} size={30} />
          </View>
        )}
        {!chat?.isChannel && (
          <View
            style={[
              styles.activeDot,
              {
                backgroundColor: active ? Colors.SuccessColor : Colors.Gray2,
              },
            ]}
          />
        )}
      </View>

      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: responsiveScreenWidth(50),
              gap: 5,
              // justifyContent: 'center',
            }}>
            {chat?.isChannel && chat?.memberScope === 'branch' && (
              <BranchIcon />
            )}
            {chat?.isChannel && chat?.memberScope === 'organization' && (
              <OrgIcon />
            )}
            {chat?.isChannel && chat?.memberScope === 'dynamic' && (
              <DWordIcon />
            )}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileName}>
              {chat?.isChannel
                ? chat?.name
                : chat?.otherUser?.fullName || 'Bootcampshub User'}
            </Text>

            {chat?.isChannel && (
              <>
                {chat?.isPublic ? (
                  <GlobeIcon color={Colors.Heading} />
                ) : (
                  <LockIcon2 />
                )}
              </>
            )}
          </View>
          <Text style={styles.messageTime}>
            {formatTime(chat?.latestMessage?.createdAt)}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          {draftMessages[chat._id] ? (
            <Text
              style={{
                fontFamily: CustomFonts.REGULAR,
                fontWeight:
                  (chat.unreadCount ?? 0) > 0 &&
                  chat?.myData?.user !== chat?.latestMessage?.sender?._id
                    ? 'bold'
                    : '400',
                color:
                  (chat.unreadCount ?? 0) > 0 &&
                  chat?.myData?.user !== chat?.latestMessage?.sender?._id
                    ? Colors.Heading
                    : Colors.BodyText,
                flexBasis: '75%',
                // backgroundColor: 'blue',
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              <Text style={{color: Colors.Red}}>Draft:</Text>{' '}
              {draftMessages[chat._id]}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: CustomFonts.REGULAR,
                fontWeight:
                  (chat.unreadCount ?? 0) > 0 &&
                  chat?.myData?.user !== chat?.latestMessage?.sender?._id
                    ? 'bold'
                    : '400',
                color:
                  (chat.unreadCount ?? 0) > 0 &&
                  chat?.myData?.user !== chat?.latestMessage?.sender?._id
                    ? Colors.Heading
                    : Colors.BodyText,
                flexBasis: '75%',
                // backgroundColor: 'blue',
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {chat?.latestMessage?.files?.length > 0 ? (
                <Text style={{color: Colors.BodyText}}>
                  {`${
                    chat?.latestMessage?.sender?.profilePicture ===
                    user?.profilePicture
                      ? 'You'
                      : chat?.latestMessage?.sender?.firstName
                  }: ${
                    (chat?.latestMessage?.files[0].type?.startsWith('image/') &&
                      'Sent a photo') ||
                    (chat?.latestMessage?.files[0].type?.startsWith('audio/') &&
                      'Sent a voice message') ||
                    (chat?.latestMessage?.files[0].type?.startsWith('video/') &&
                      'Sent a video') ||
                    'Sent a attachment'
                  }`}
                </Text>
              ) : chat?.latestMessage?.emoji?.length > 0 ? (
                <Text
                  style={{
                    color: Colors.BodyText,
                  }}>{`${senderName}: Sent a ${chat?.latestMessage?.emoji[0].symbol} reaction`}</Text>
              ) : chat?.myData?.isBlocked ? (
                <Text style={{color: 'red'}}>Blocked</Text>
              ) : chat?.typingData?.isTyping ? (
                <Text style={{color: 'green'}}>
                  {chat?.typingData?.user?.firstName} is typing...
                </Text>
              ) : !chat?.latestMessage?._id ? (
                <Text style={{color: Colors.BodyText}}>New chat</Text>
              ) : chat?.latestMessage?.type === 'activity' ? (
                <Text style={{color: Colors.BodyText}}>
                  {generateActivityText(chat?.latestMessage, senderName)}
                </Text>
              ) : (
                <Text style={{color: Colors.BodyText}}>
                  {`${senderName}: ${getText(
                    replaceMentionToName(
                      removeMarkdown(
                        convertToCorrectMarkdown(chat?.latestMessage?.text),
                      ) || 'Deleted the message',
                    ),
                  )}`}
                </Text>
              )}
            </Text>
          )}

          <View style={styles.messageNumberContainer}>
            {chat?.myData?.isFavourite && <PinIcon />}
            {!chat?.myData?.notification?.isOn && (
              <Text>
                <BellOffIcon size={15} />
              </Text>
            )}
            {Boolean(chat.unreadCount) &&
              chat?.myData?.user !== chat?.latestMessage?.sender?._id && (
                <View
                  style={{
                    backgroundColor: Colors.Red,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  <Text style={styles.messageNumber}>{chat?.unreadCount}</Text>
                </View>
              )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.8),
      // backgroundColor: 'blue',
      gap: 10,
    },
    subContainer: {
      backgroundColor: 'red',
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    sortName: {
      color: Colors.Foreground,
      fontSize: responsiveScreenFontSize(1.8),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: 50,
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.PrimaryOpacityColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors?.BorderColor,
    },
    activeDot: {
      width: responsiveScreenWidth(2.8),
      height: responsiveScreenWidth(2.8),
      borderRadius: responsiveScreenWidth(100),
      position: 'absolute',
      bottom: responsiveScreenWidth(0.9),
      right: -2,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Foreground,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      // width: responsiveScreenWidth(50),
    },
    messageTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: responsiveScreenHeight(1),
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    messageNumberContainer: {
      alignItems: 'center',
      // backgroundColor: 'blue',

      // backgroundColor: Colors.Red,
      // borderRadius: 100,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      gap: 5,
      flex: 1,
    },
    messageNumber: {
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(1.3),
    },
  });

export default memo(ChatItem);
