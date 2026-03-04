import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../utility/axiosInstance';
import {useTheme} from '../context/ThemeContext';
import {
  setNotifications,
  updateNotification,
} from '../store/reducer/notificationReducer';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import moment from 'moment';
import NoDataAvailable from '../components/SharedComponent/NoDataAvailable';
import {handleReadAllNotification} from '../actions/apiCall';
import LoadingSmall from '../components/SharedComponent/LoadingSmall';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {loadInitialNotifications} from '../actions/chat-noti';
import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';
import {RegularFonts} from '../constants/Fonts';
import {RootState} from '../types/redux/root';
import {fontSizes} from '../constants/Sizes';
import {setSelectedEventV2} from '../store/reducer/calendarReducerV2';
import {theme} from '../utility/commonFunction';
import {Image} from 'react-native';

// Define a TypeScript interface for notifications based on the properties used.
export interface TNotification {
  _id: string;
  generatedTitle: string;
  generatedText: string;
  opened: boolean;
  createdAt: string;
  notificationType: string;
  entityId?: string;
  userFrom?: {
    profilePicture?: string;
  };
}

const NotificationScreen: React.FC = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {notifications, notificationCount} = useSelector(
    (state: RootState) => state.notification,
  );
  const {programs} = useSelector((state: RootState) => state.program);
  const {showAlert} = useGlobalAlert();
  const navigation = useNavigation<NavigationProp<any>>();
  const [notiAvailable, setNotiAvailable] = useState(true);

  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Use only page as dependency so that the function does not run continuously.
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `/notification/mynotifications?limit=10&page=${page}`,
        );
        const newNotifications: TNotification[] = res.data.notifications;
        if (page === 1) {
          if (newNotifications.length === 0) {
            setNotiAvailable(false);
          }
          dispatch(setNotifications(newNotifications));
        } else {
          dispatch(setNotifications([...notifications, ...newNotifications]));
        }
        if (
          notifications.length + newNotifications.length >=
          notificationCount.totalCount
        ) {
          setHasMore(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Run only when page changes

  const handleNavigation = (notification: TNotification): void => {
    console.log('trrr', JSON.stringify(notification, null, 1));
    switch (notification.notificationType) {
      case 'submitMockInterview': // not handled
      case 'certificateGenerate': // not handled
      case 'createDaytoDay': // not handled
      case 'sendInvoice': // not handled
      case 'newEnrollment': // not handled
      case 'enrollmentStatusChange': // not handled
      case 'organizationApply': // not handled
      case 'organizationStatusChange': // not handled
      case 'branchApply': // not handled
      case 'branchStatusChange': // not handled
        break;
      case 'calendarNoti':
      case 'rescheduleCalendarEvent':
      case 'createCalendarEvent':
      case 'invitationCalendarEvent':
        navigation.navigate('MyCalenderStack', {
          screen: 'CalendarScreen',
          params: {random: Math.random()},
        });
        break;
      case 'calendarReminder':
        // getEventDetails(notification.entityId || '');
        // dispatch(setNotificationClicked(true));
        dispatch(setSelectedEventV2({_id: notification.entityId} as any));
        // dispatch(
        //   setNewEventData({
        //     isModalVisible: true,
        //     eventType: 'event',
        //   }),
        // );
        navigation.navigate('MyCalenderStack', {
          screen: 'CalendarScreen',
          params: {random: Math.random()},
        });
        break;
      case 'changePassword': // profile
      case 'updateProfile': // profile
        navigation.navigate('HomeStack', {
          screen: 'MyProfile',
          params: {random: Math.random()},
        });
        break;
      case 'createMockInterview': // app
        navigation.navigate('ProgramStack', {screen: 'MockInterview'});
        break;
      case 'createShowAndTell':
      case 'changeStatusShowAndTell':
        navigation.navigate('ProgramStack', {screen: 'ShowAndTellScreen'});
        break;
      case 'createContent':
        navigation.navigate('ProgramStack', {screen: 'Presentation'});
        break;
      case 'orderTransactionStatusChange':
      case 'updateTransactionStatus':
      case 'createOrderTransaction':
      case 'createTransaction':
        navigation.navigate('HomeStack', {screen: 'MyPaymentScreen'});
        break;
      case 'newCourseOrder':
      case 'orderStatusChange': // not handled
        navigation.navigate('HomeStack', {screen: 'PurchasedScreen'});
        break;
      case 'newLessonAdd':
        navigation.navigate('ProgramStack', {
          screen: 'ProgramDetails',
          params: {slug: programs?.program?.slug},
        });
        break;
      case 'createSlide': // portal
      case 'createImportantLink': // portal
      case 'createTemplate': // portal
      case 'createDiagram': // portal
      case 'createMyDocument': // portal
      case 'createUserDocument': // portal
        showAlert({
          title: 'Unavailable',
          type: 'warning',
          message:
            'Feature not available in the app. Please visit our website for full access.',
          link: 'portal.bootcampshub.ai',
        });
        break;
      default:
        showAlert({
          title: 'Unavailable',
          type: 'warning',
          message:
            'Feature not available in the app. Please visit our website for full access.',
          link: 'portal.bootcampshub.ai',
        });
        break;
    }
  };

  const notificationMarkRead = (noti: TNotification): void => {
    axios
      .patch(`/notification/markread/${noti._id}`)
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 2));
        if (res.data.notification._id) {
          loadInitialNotifications();
          dispatch(updateNotification(res.data.notification));
          handleNavigation(noti);
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const renderItem = ({item}: ListRenderItemInfo<TNotification>) => (
    <TouchableOpacity
      onPress={() => notificationMarkRead(item)}
      style={styles.list}>
      <Image
        style={{marginRight: 10, height: 50, width: 50, borderRadius: 100}}
        source={{
          uri:
            item?.userFrom?.profilePicture ||
            'https://ts4u.us/placeholder2.jpg',
        }}
      />
      <View style={{flex: 1}}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.generatedTitle}</Text>
          {!item.opened && <View style={styles.unread} />}
        </View>
        <View style={[styles.rowBetween, {alignItems: 'flex-start'}]}>
          <Text style={styles.text}>
            {item.generatedText.length > 60
              ? `${item.generatedText.slice(0, 60)}...`
              : item.generatedText}
          </Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
            <Text style={styles.date}>
              {moment(item.createdAt).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Infinite scroll handler: load next page if more data exists.
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);
  const renderEmptyComponent = () => {
    if (loadInitialNotifications.length === 0 && notiAvailable) {
      return null;
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <NoDataAvailable />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <View style={styles.headingContainer}>
        <Text style={styles.Heading}>Notifications</Text>
        {notificationCount.totalUnread > 0 && (
          <TouchableOpacity
            onPress={() => {
              handleReadAllNotification();
            }}
            disabled={notificationCount.totalUnread === 0}
            style={[
              styles.buttonContainer,
              {
                backgroundColor: notificationCount.totalUnread
                  ? Colors.Primary
                  : Colors.DisablePrimaryBackgroundColor,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: notificationCount.totalUnread
                    ? Colors.PrimaryButtonTextColor
                    : Colors.DisablePrimaryButtonTextColor,
                },
              ]}>
              Read all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={
          <>
            {notificationCount.totalCount !== notifications.length &&
              isLoading && (
                <View style={styles.spinnerContainer}>
                  <LoadingSmall size={20} color={Colors.Primary} />
                </View>
              )}
          </>
        }
      />
    </View>
  );
};

export default NotificationScreen;

const getStyles = (Colors: any) =>
  StyleSheet.create({
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(1.8),
    },
    buttonContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: responsiveScreenFontSize(1),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
    },
    headingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: responsiveScreenWidth(4),
      paddingTop: 0,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
      marginHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.Foreground,
      borderRadius: 15,
    },
    spinnerContainer: {
      paddingBottom: 10,
    },
    unread: {
      backgroundColor: Colors.Primary,
      width: 10,
      height: 10,
      borderRadius: 100,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.subHeading,
    },
    text: {
      color: Colors.BodyText,
      fontSize: fontSizes.small,
      flex: 0.95,
      fontFamily: CustomFonts.MEDIUM,
    },
    time: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
    },
    date: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
    },
    Heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
    },
  });
