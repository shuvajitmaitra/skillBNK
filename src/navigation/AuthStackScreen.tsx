import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../screens/AuthScreen/SignInScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy/PrivacyPolicyScreen';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="SignInScreen" component={SignInScreen} />
      <AuthStack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
