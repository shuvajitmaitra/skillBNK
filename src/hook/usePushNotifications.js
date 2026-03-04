// import {useEffect, useState} from 'react';
// import messaging from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
// import axiosInstance from '../utility/axiosInstance';

// import store from '../store';
// import {markRead, setSingleChat} from '../store/reducer/chatReducer';
// import {useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import {navigate} from '../navigation/NavigationService';
// import {Platform} from 'react-native';
// import {removeMarkdown, showToast} from '../components/HelperFunction';
// import {getMessage, getReplies} from '../actions/apiCall';
// import {loadChats} from '../actions/chat-noti';

// const usePushNotifications = () => {
//   const [error, setError] = useState('');
//   const [isTokenSent, setIsTokenSent] = useState(false);
//   const {chatsObj} = useSelector(state => state.chat);

//   const navigation = useNavigation();
//   useEffect(() => {
//     const setupNotifications = async () => {
//       try {
//         await requestNotificationPermission();

//         await registerAppWithFCM();

//         const token = await messaging().getToken();
//         console.log('Device FCM token:', token);
//         // Alert.alert('Device FCM token:', token);

//         if (token && !isTokenSent) {
//           sendTokenToBackend(token);
//           setIsTokenSent(true);
//         }
//         await createNotificationChannel();

//         messaging().onMessage(handleForegroundNotification);
//         messaging().onNotificationOpenedApp(handleNotification);

//         const initialNotification = await messaging().getInitialNotification();
//         if (initialNotification) {
//           handleNotification(initialNotification);
//         } else {
//           console.log('No initial notification found');
//         }

//         messaging().onTokenRefresh(newToken => {
//           console.log('FCM Token refreshed:', newToken);
//           if (newToken) {
//             sendTokenToBackend(newToken);
//           }
//         });
//       } catch (err) {
//         setError(err.message);
//         console.error('Error during setup:', err.message);
//       }
//     };

//     setupNotifications();

//     return () => {
//       console.log('Cleanup for notifications');
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function registerAppWithFCM() {
//     console.log(
//       'registerAppWithFCM status',
//       messaging().isDeviceRegisteredForRemoteMessages,
//     );
//     if (!messaging().isDeviceRegisteredForRemoteMessages) {
//       await messaging()
//         .registerDeviceForRemoteMessages()
//         .then(status => {
//           console.log('registerDeviceForRemoteMessages status', status);
//         })
//         .catch(err => {
//           console.log('registerDeviceForRemoteMessages error ', err);
//         });
//     }
//   }

//   const requestNotificationPermission = async () => {
//     await notifee.requestPermission({
//       sound: false,
//       announcement: true,
//       inAppNotificationSettings: false,
//     });
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (!enabled) {
//       setError('Notification permission denied on iOS');
//       console.log('iOS permission denied');
//     }
//   };

//   const createNotificationChannel = async () => {
//     if (Platform.OS === 'android') {
//       const channelId = 'default';
//       const channelExists = await notifee.getChannels();

//       if (!channelExists.find(channel => channel.id === channelId)) {
//         await notifee.createChannel({
//           id: channelId,
//           name: 'Default Channel',
//           importance: AndroidImportance.HIGH,
//         });
//       }
//     }
//   };

//   const handleForegroundNotification = async remoteMessage => {
//     // console.log(
//     //   'handleNotification for foreground-----------------------',
//     //   JSON.stringify(remoteMessage, null, 2),
//     // );
//     // console.log(
//     //   'store.getState().singleChat',
//     //   JSON.stringify(store.getState()?.chat?.singleChat?._id, null, 2),
//     // );
//     // if (store.getState()?.chat?.singleChat?._id) {
//     //   return;
//     // }
//     try {
//       if (remoteMessage.data) {
//         await notifee.displayNotification({
//           title: remoteMessage.notification.title || 'Default Title',
//           body:
//             removeMarkdown(remoteMessage.notification.body) || 'Default Body',
//           android: {
//             channelId: 'default',
//             pressAction: {
//               id: 'default',
//             },
//           },
//           ios: {
//             sound: 'default',
//             badge: 1,
//           },
//         });

//         notifee.onForegroundEvent(async ({type, detail}) => {
//           if (type === EventType.PRESS) {
//             // const {chatId} = remoteMessage.data;

//             if (remoteMessage?.data?.path) {
//               if (remoteMessage.data.path === 'thread') {
//                 navigation.navigate('ThreadScreen', {
//                   parentMessage: remoteMessage.data.parentMessage,
//                   chat: remoteMessage.data.chatId,
//                 });
//               } else {
//                 store.dispatch(markRead({chatId: remoteMessage.data.chatId}));
//                 store.dispatch(
//                   setSingleChat(chatsObj[remoteMessage.data.chatId]),
//                 );
//                 getMessage(
//                   remoteMessage.data.chatId,
//                   chatsObj[remoteMessage.data.chatId],
//                 );
//                 navigate('MessageScreen');
//               }

//               // const chat = store.getState().chat?.chatsObj[chatId];
//               // if (chat) {
//               //   store.dispatch(setSingleChat(chat));
//               // } else {
//               //   console.warn('Chat not found for ID:', chatId);
//               // }
//               // navigate('MessageScreen');
//               // store.dispatch(
//               //   updateLatestMessage({
//               //     chatId: chat?.chat,
//               //     latestMessage: {text: chat?.text},
//               //     counter: 1,
//               //   }),
//               // );
//             }
//           }

//           if (type === EventType.DISMISSED) {
//             console.log('User dismissed notification');
//             console.log(
//               'Notification Details:',
//               JSON.stringify(detail.notification, null, 2),
//             );
//           }
//         });
//       } else {
//         console.log('No notification content found in the remote message');
//       }
//     } catch (err) {
//       console.error('Error displaying notification:', err);
//     }
//   };
//   const handleNotification = async remoteMessage => {
//     console.log('remoteMessage', JSON.stringify(remoteMessage, null, 1));
//     try {
//       if (remoteMessage.notification) {
//         if (remoteMessage.data.path === 'thread') {
//           navigation.navigate('ThreadScreen', {
//             parentMessage: remoteMessage.data.parentMessage,
//             chat: remoteMessage.data.chatId,
//           });
//           getReplies({
//             page: 1,
//             chat: remoteMessage.data.chatId,
//             parentMessage: remoteMessage.data.parentMessage,
//           });
//         } else {
//           if (!chatsObj[remoteMessage.data.chatId]) {
//             await loadChats();
//           }
//           store.dispatch(markRead({chatId: remoteMessage.data.chatId}));
//           store.dispatch(setSingleChat(chatsObj[remoteMessage.data.chatId]));
//           getMessage(
//             remoteMessage.data.chatId,
//             chatsObj[remoteMessage.data.chatId],
//           );
//           navigate('MessageScreen');
//         }
//       } else {
//         console.log('No notification content found in the remote message');
//       }
//     } catch (err) {
//       console.error('Error displaying notification:', err);
//       setError('Error displaying notification');
//     }
//   };

//   const sendTokenToBackend = async token => {
//     try {
//       const response = await axiosInstance.post('/user/save-device-token/v2', {
//         token,
//         // action: 'remove',
//       });
//       console.log(
//         'Device token sent to backend successfully! success:',
//         response.data.success,
//       );
//     } catch (err) {
//       console.error('Error sending token to backend:', err.response.data);
//       showToast({message: err.response.data.error || 'Token can not be send'});
//       setError('Network error while sending token');
//     }
//   };

//   return {error, isTokenSent};
// };

// export default usePushNotifications;
