import React, {useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import MessageBar from './MessageBar';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {StyleSheet} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import {useSelector} from 'react-redux';
import {gGap} from '../../constants/Sizes';

export default function MessagesChart() {
  const message = useSelector(
    state => state.dashboard?.dashboardData?.message?.results,
  );
  const [selectedOption, setSelectedOption] = useState('Weekly');
  const option = ['Weekly', 'Monthly'];
  const Colors = useTheme();
  const styles = getStyles(Colors);

  if (!message) {
    return <ActivityIndicator size="large" color={Colors.Primary} />;
  }

  const items = [
    {title: 'Read', count: message.totalReadChat, limit: message.totalChat},
    {
      title: 'Unread',
      count: message.totalUnreadChat,
      limit: message.totalChat,
    },
    {
      title: 'Unread Chat Crowd',
      count: message.totalUnreadCrowd,
      limit: message.totalChat,
    },
    {
      title: 'Unread Direct Message',
      count: message.totalUnreadDirect,
      limit: message.totalChat,
    },
    {
      title: 'Pinned Message',
      count: message.totalPinnedMessages,
      limit: message.totalChat,
    },
  ];

  return (
    <View style={{marginBottom: -20}}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>All Chats</Text>
        <Text style={styles.text}>{message.totalChat}</Text>
      </View>
      <View style={{gap: 10, zIndex: 111, marginBottom: gGap(20)}}>
        {items.map((item, index) => (
          <MessageBar
            key={index}
            title={item.title}
            count={item.count}
            limit={item.limit}
          />
        ))}
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: 10,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(2),
    },
    text: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
  });
