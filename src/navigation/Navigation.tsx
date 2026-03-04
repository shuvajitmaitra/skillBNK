import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackScreen from './AuthStackScreen';
import RootStackNavigator from './RootStackNavigator';
import {navigationRef} from './NavigationService';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from '../screens/NoInternetScreen/NoInternetScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../types/redux/root';

const Navigation = () => {
  const [hasInternet, setHasInternet] = useState<boolean>(true);
  const {accessToken} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setHasInternet(!!state.isConnected);
    });

    return unsubscribe;
  }, []);

  if (!hasInternet) {
    return <NoInternetScreen onRetry={() => setHasInternet(true)} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {accessToken ? <RootStackNavigator /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default Navigation;
