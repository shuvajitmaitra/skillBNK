import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TChat} from '../../types/chat/chatTypes';
import {
  CalendarStackParamList,
  RootStackParamList,
} from '../../types/navigation';
import {RootState} from '../../types/redux/root';
import {setNotifications} from '../../store/reducer/notificationReducer';
import AvailabilityModal from './Modal/AvailabilityModalV2';
import EventFilterModal from './Modal/EventFilterModal';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageIconLive2 from '../../assets/Icons/MessageIconLive2';
import {
  borderRadius,
  fontSizes,
  gGap,
  gHeight,
  gPadding,
} from '../../constants/Sizes';
import HolidayModalV2 from './Modal/HolidayModalV2';
import moment, {Moment} from 'moment';
import {AntDesignIcon, FontistoIcon, MaterialIcon} from '../../constants/Icons';
import Animated, {SlideInRight, SlideOutRight} from 'react-native-reanimated';
import {updateCalInfo} from '../../store/reducer/calendarReducerV2';
import {TextInput} from 'react-native';
import DotIndicator from '../SharedComponent/DotIndicator';
const EIcon = Entypo as any;
const IIcon = Ionicons as any;

// Create a composite navigation type that can navigate to both root and calendar stacks
type CalendarHeaderNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CalendarStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const CalendarHeaderV2 = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  // Use composite navigation type for combined navigation capabilities
  const navigation = useNavigation<CalendarHeaderNavigationProp>();

  const {filterParameter, pendingInvitationCount, calendarInfo} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const startOfDay: Moment = moment()
    .add(calendarInfo?.dayOffset, 'days')
    .startOf('day');
  const endOfWeek = moment()
    .add(calendarInfo?.weekOffset, 'weeks')
    .endOf('week');
  // States
  // const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isAvailabilityVisible, setIsAvailabilityVisible] =
    useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [isHolidayVisible, setIsHolidayVisible] = useState<boolean>(false);
  const [filterPopupVisible, setFilterPopupVisible] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Selectors
  let {chats} = useSelector((state: RootState) => state.chat);
  let {notificationCount} = useSelector(
    (state: RootState) => state.notification,
  );

  // Calculate unread messages
  const unreadCounts = chats?.filter(
    (chat: TChat) =>
      Boolean(chat?.unreadCount) &&
      chat?.myData?.user !== chat?.latestMessage?.sender?._id &&
      !chat?.isArchived,
  ).length;

  const clearSearch = () => {
    setSearchVisible(!searchVisible);
    dispatch(updateCalInfo({searchText: ''}));
  };
  if (searchVisible || calendarInfo.searchText) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
          },
        ]}>
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutRight}
          style={styles.searchCon}>
          <TextInput
            value={calendarInfo.searchText}
            onChangeText={t => {
              dispatch(updateCalInfo({searchText: t}));
            }}
            style={styles.searchBox}
            placeholder="Search by title, description, host..."
            placeholderTextColor={Colors.BodyText}
            autoFocus={true}
            returnKeyType="search"
          />
          <MaterialIcon
            onPress={clearSearch}
            name="cancel"
            size={30}
            color={Colors.BodyText}
            style={{
              position: 'absolute',
              right: gPadding(5),
            }}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          {/* <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}
            onPress={() => {
              setIsDrawerVisible(!isDrawerVisible);
            }}>
            <EIcon name="menu" size={25} color={Colors.BodyText} />
            {Boolean(pendingInvitationCount) && (
              <View
                style={{
                  position: 'absolute',
                  top: gGap(5),
                  right: gGap(0),
                  height: gGap(10),
                  width: gGap(10),
                  backgroundColor: Colors.Red,
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity> */}
          <AntDesignIcon
            onPress={() => {
              navigation.goBack();
            }}
            style={{padding: gGap(5)}}
            name="arrowleft"
            size={25}
            color={Colors.BodyText}
          />
          <View>
            {calendarInfo.selectedView === 'day' ? (
              <Text style={styles.displayedMonth}>
                {moment(startOfDay).format('MMM YYYY')}
              </Text>
            ) : calendarInfo.selectedView === 'week' ? (
              <Text style={styles.displayedMonth}>
                {moment(endOfWeek).format('MMM YYYY')}
              </Text>
            ) : (
              <Text style={styles.displayedMonth}>
                {moment()
                  .add(calendarInfo.monthOffset, 'months')
                  .format('MMM YYYY')}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.MessageNotificationContainer}>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() => {
              setSearchVisible(!searchVisible);
            }}>
            <MaterialIcon name="search" size={25} color={Colors.BodyText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() => {
              setIsAvailabilityVisible(!isAvailabilityVisible);
            }}>
            <MaterialIcon
              name="event-available"
              size={25}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() => setIsHolidayVisible(!isHolidayVisible)}>
            <FontistoIcon
              name="holiday-village"
              size={18}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() => navigation.navigate('CalendarInvitationsV2')}>
            {Boolean(pendingInvitationCount) && <DotIndicator />}
            <AntDesignIcon
              name="addusergroup"
              size={25}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={event =>
              setFilterPopupVisible({
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
              })
            }>
            <EIcon name="sound-mix" size={20} color={Colors.BodyText} />
            {Object?.values(filterParameter ?? {})[0]?.length > 0 && (
              <DotIndicator />
            )}
          </TouchableOpacity>
          {/* Message Notification Container */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
            }
            style={styles.messageContainer}>
            {Boolean(unreadCounts) && (
              <DotIndicator />
              // <Text style={[styles.badge]}>{chats && unreadCounts}</Text>
            )}

            <MessageIconLive2 size={24} color={Colors.BodyText} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setNotifications([]));
              navigation.navigate('HomeStack', {
                screen: 'NotificationScreen',
              });
            }}
            style={styles.messageContainer}>
            {notificationCount?.totalUnread !== 0 && (
              <DotIndicator />
              // <Text style={[styles.badge]}>
              //   {notificationCount?.totalUnread > 99
              //     ? '99+'
              //     : notificationCount?.totalUnread}
              // </Text>
            )}

            <IIcon
              name="notifications-outline"
              size={25}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        {filterPopupVisible && (
          <EventFilterModal
            visible={filterPopupVisible}
            onCancel={() => setFilterPopupVisible(null)}
          />
        )}
        {/* {isDrawerVisible && (
          <CalendarDrawerContent
            visible={isDrawerVisible}
            onCancel={() => setIsDrawerVisible(!isDrawerVisible)}
            onAvailabilityPress={() => {
              setIsDrawerVisible(!isDrawerVisible);
              setIsAvailabilityVisible(!isAvailabilityVisible);
            }}
            onHolidayPress={() => {
              setIsDrawerVisible(!isDrawerVisible);
              setIsHolidayVisible(!isHolidayVisible);
            }}
          />
        )} */}
        <AvailabilityModal
          isAvailabilityVisible={isAvailabilityVisible}
          setIsAvailabilityVisible={setIsAvailabilityVisible}
          toggleAvailability={() =>
            setIsAvailabilityVisible(!isAvailabilityVisible)
          }
        />
        <HolidayModalV2
          isHolidayVisible={isHolidayVisible}
          toggleHoliday={() => {
            setIsHolidayVisible(!isHolidayVisible);
          }}
        />
      </View>
    </>
  );
};

export default CalendarHeaderV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    searchBox: {
      backgroundColor: Colors.Foreground,
      height: gHeight(40),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.circle,
      paddingHorizontal: gPadding(15),
      paddingRight: gPadding(50),
      position: 'relative',
      color: Colors.BodyText,
    },
    clearButton: {
      position: 'absolute',
      right: gPadding(45),
      height: gHeight(40),
      justifyContent: 'center',
      zIndex: 10,
    },
    searchCon: {
      justifyContent: 'center',
      flex: 1,
      marginTop: Platform.OS === 'android' ? gGap(5) : gGap(-5),
      marginBottom: gGap(5),
    },
    displayedMonth: {
      fontSize: fontSizes.heading,
      fontWeight: '700',
      color: Colors.Heading,
    },
    btnText: {
      color: 'white',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Foreground,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      // backgroundColor: 'red',
      gap: gGap(5),
    },
    btn: {
      // width: responsiveScreenWidth(44),
      height: 40,
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
    messageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'blue',
    },
    messageIcon: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
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
