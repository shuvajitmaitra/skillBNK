import {useEffect} from 'react';
import {LogLevel, OneSignal} from 'react-native-onesignal';

import store from '../store';
import {navigate} from '../navigation/NavigationService';

const SCREEN_NAME = 'NewChatScreen';
export const ONESIGNAL_APP_ID = '7dbf61d4-22ee-4318-9113-3b576b78361f';
export const usePushNotification = () => {
  const {user, accessToken} = store.getState().auth;
  const userId = user?._id || '';

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
    accessToken ? OneSignal.login(userId) : OneSignal.logout();

    const setupListener = async () => {
      try {
        if (
          OneSignal.Notifications &&
          typeof OneSignal.Notifications.addEventListener === 'function'
        ) {
          const clickListener = OneSignal.Notifications.addEventListener(
            'click',
            (event: any) => {
              //@ts-ignore
              const targetScreen = event.notification.additionalData?.screen;

              if (targetScreen === SCREEN_NAME) {
                navigate(targetScreen as never);
              } else {
                navigate(SCREEN_NAME);
              }
            },
          );

          return clickListener;
        } else if (
          OneSignal.Notifications &&
          //@ts-ignore
          typeof OneSignal.Notifications.addClickListener === 'function'
        ) {
          //@ts-ignore
          const clickListener = OneSignal.Notifications.addClickListener(
            (event: any) => {
              const targetScreen = event.notification.additionalData?.screen;

              if (targetScreen === SCREEN_NAME) {
                navigate(targetScreen as never);
              } else {
                navigate(SCREEN_NAME);
              }
            },
          );

          return clickListener;
        }
      } catch (error) {
        console.error('Error setting up OneSignal listener:', error);
      }
    };

    let listener: any;

    // Setup with a slight delay
    setTimeout(async () => {
      listener = await setupListener();
    }, 500);

    return () => {
      listener?.remove?.();
    };
  }, [accessToken, userId]);
};
