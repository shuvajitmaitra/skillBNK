// App.tsx
import React, {useEffect} from 'react';
import {
  StatusBar,
  LogBox,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import store, {persistor} from './src/store/index';
// import SplashScreen from 'react-native-splash-screen';
import {AlertProvider} from './src/components/SharedComponent/GlobalAlertContext';
import {MainProvider} from './src/context/MainContext';
import Navigation from './src/navigation/Navigation';

import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {toastConfig} from './src/constants/ToastConfig';
import {theme} from './src/utility/commonFunction';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {ONESIGNAL_APP_ID} from './src/hook/usePushNotification';
import BootSplash from 'react-native-bootsplash';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['fontFamily']);

const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  try {
    if (!args || args.length === 0) {
      return;
    }
    const [errorMessage] = args;
    if (typeof errorMessage !== 'string') {
      return;
    }
    if (errorMessage.includes('defaultProps')) {
      return;
    }
    originalConsoleError(...args);
  } catch (e) {
    originalConsoleError('Error in custom console.error:', e);
  }
};

const AppWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<ReduxLoading />} persistor={persistor}>
        <ThemeProvider>
          <AlertProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <MainProvider>
                <App />
                <Toast config={toastConfig} />
              </MainProvider>
            </GestureHandlerRootView>
          </AlertProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const App: React.FC = () => {
  const Colors = useTheme();
  useEffect(() => {
    // SplashScreen.hide();
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);

    const t = setTimeout(() => {
      OneSignal.Notifications.requestPermission(true);
    }, 1000);
    BootSplash.hide({fade: true});

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <View style={{backgroundColor: Colors.Foreground, flex: 1}}>
        <Navigation />
      </View>
    </>
  );
};

const ReduxLoading: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default AppWrapper;
