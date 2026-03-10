import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, Platform, AppStateStatus} from 'react-native';
import MessageScreen from '../screens/Chat/MessageScreen';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import ChatProfile from '../screens/Chat/ChatProfile';
import store from '../store';
import {
  loadChats,
  loadNotifications,
  loadProgramInfo,
} from '../actions/chat-noti';
import {connectSocket, disconnectSocket} from '../utility/socketManager';
import {
  fetchOnlineUsers,
  getMyNavigation,
  userOrganizationInfo,
} from '../actions/apiCall';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import {storage} from '../utility/mmkvInstance';
import CommentScreen from '../screens/Comment/CommentScreen';
import DefaultRoute from '../components/SharedComponent/DefaultRoute';
import OtaScreen from '../screens/OTA/OtaScreen';
import environment from '../constants/environment';
import {navigate} from './NavigationService';
import {setUpdateInfo} from '../store/reducer/otaReducer';
import {RootStackParamList} from '../types/navigation';
import ChatSheet from '../components/ChatCom/Sheet/ChatSheet';
import ConfirmationModal2 from '../components/SharedComponent/ConfirmationModal2';
import {loadMyNotes} from '../actions/myNoteApiCall';
import NoteDetails from '../screens/Notes/NoteDetails';
import {
  clearFilterParameters,
  setCalInfo,
} from '../store/reducer/calendarReducerV2';
import NoteCreateScreen from '../screens/Notes/NoteCreateScreen';
import MyProfileEdit from '../screens/Main/MyProfileEdit';
import {handleSignOut, loadComPostNewly} from '../utility/commonFunction';
import {setChatFooterInfo} from '../store/reducer/chatFooterReducer';
import {setNavigation} from '../store/reducer/authReducer';
import {usePushNotification} from '../hook/usePushNotification';
import BottomTabNavigator from './BottomTabNavigator';
import MockInterview from '../screens/MockInterview/MockInterview';
import ArchitectureDiagramScreen from '../screens/ArchitectureDiagram/ArchitectureDiagramScreen';
import PresentationSlidesScreen from '../screens/PresentationSlides/PresentationSlidesScreen';

const RootStack = createStackNavigator<RootStackParamList>();

const checkUpdate = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(
      `/app/mobile/check/${Platform.OS}/${environment.version}`,
    );
    if (!response.data.isLatest) {
      store.dispatch(setUpdateInfo(response?.data?.app));
      store.dispatch(
        setCalInfo({
          selectedView: 'day',
          monthOffset: 0,
          dayOffset: 0,
          weekOffset: 0,
        }),
      );
      navigate('OtaScreen');
    }
  } catch (error: any) {
    console.log(
      'checking app version',
      JSON.stringify(error.response.data.error, null, 2),
    );
  }
};

const RootStackNavigator: React.FC = () => {
  const appState = useRef(AppState.currentState);

  const hasInitialized = useRef(false);

  // const organization = storage.getString('organization');
  const activeEnrolment = storage?.getString('active_enrolment');
  const enrollmentId = activeEnrolment && JSON.parse(activeEnrolment)._id;

  // Initialize push notifications
  usePushNotification();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('App state changed:', nextAppState);

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        if (!enrollmentId) return;
        console.log('App resumed - reconnecting socket');
        const promises = [
          checkUpdate(),
          getMyNavigation(),
          connectSocket(),
          loadChats(),
          loadProgramInfo(),
          fetchOnlineUsers(),
          loadNotifications(),
          userOrganizationInfo(),
          loadComPostNewly(),
        ];
        store.dispatch(clearFilterParameters());
        Promise.all(promises).catch(console.error);
      } else if (nextAppState === 'background') {
        // App went to background
        store.dispatch(setChatFooterInfo({}));

        console.log('App backgrounded - disconnecting socket');
        disconnectSocket();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      disconnectSocket();
      store.dispatch(setNavigation(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const initialize = async () => {
      await configureAxiosHeader();

      try {
        const response = await axiosInstance.post('/user/verify', {
          version: environment.version,
        });
        if (response.data.success && response.status === 200) {
          const isEnrolled = response.data.enrollments.length > 0;
          getMyNavigation();
          store.dispatch(clearFilterParameters());
          const promises: Promise<any>[] = [
            loadMyNotes({
              page: 1,
              limit: 50,
              sort: 'newest',
              query: 'math',
            }),
            checkUpdate(),
            connectSocket(),
            loadChats(),
            loadNotifications(),
            userOrganizationInfo(),
          ];

          if (isEnrolled) {
            promises.push(loadProgramInfo(), fetchOnlineUsers());
          }
          if (!isEnrolled) {
            hasInitialized.current = true;

            return;
          }
          await Promise.all(promises);
          hasInitialized.current = true;
        }
      } catch (error: any) {
        // console.error('Initialization failed:', error);
        console.log(
          'To verify user in root stack navigator',
          JSON.stringify(error.response.data, null, 2),
        );
        handleSignOut();
      }
    };

    if (!hasInitialized.current) {
      initialize();
    }

    return () => {
      hasInitialized.current = false;
    };
  }, [enrollmentId]);

  return (
    <>
      <RootStack.Navigator screenOptions={{animation: 'fade'}}>
        <RootStack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={{headerShown: false, title: 'Messages'}}
        />
        <RootStack.Screen
          name="ThreadScreen"
          component={ThreadScreen}
          options={{headerShown: false, title: 'Thread'}}
        />
        <RootStack.Screen
          name="ChatProfile"
          component={ChatProfile}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="MockInterview"
          component={MockInterview}
          options={{headerShown: false}}
        />

        <RootStack.Screen
          name="ArchitectureDiagram"
          component={ArchitectureDiagramScreen}
          options={() => ({
            headerTitle: '',
            headerShown: false,
            animation: 'fade',
          })}
        />
        <RootStack.Screen
          name="DefaultRoute"
          component={DefaultRoute}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="OtaScreen"
          component={OtaScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="ChatSheet"
          component={ChatSheet}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="NoteDetails"
          component={NoteDetails}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="NoteCreateScreen"
          component={NoteCreateScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="MyProfileEdit"
          component={MyProfileEdit}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="PresentationSlides"
          component={PresentationSlidesScreen}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
      <ConfirmationModal2 />
    </>
  );
};

export default RootStackNavigator;
