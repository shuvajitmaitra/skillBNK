// src/navigation/CommunityStackScreen.tsx
import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import CommunityScreen from '../screens/Community/CommunityScreen';
import Header from '../components/SharedComponent/Header';

// Define the param list for the Community stack navigator.
export type CommunityStackParamList = {
  CommunityScreen: undefined;
};

// Create the stack navigator with the defined param list.
const CommunityStack = createStackNavigator<CommunityStackParamList>();

// Define the props for the CommunityStackScreen if needed.
type CommunityStackScreenProps = {
  navigation?: StackNavigationProp<any>;
};

const CommunityStackScreen: React.FC<CommunityStackScreenProps> = () => (
  <CommunityStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <CommunityStack.Screen
      name="CommunityScreen"
      component={CommunityScreen}
      options={({
        navigation,
      }: {
        navigation: StackNavigationProp<
          CommunityStackParamList,
          'CommunityScreen'
        >;
        route: RouteProp<CommunityStackParamList, 'CommunityScreen'>;
      }) => ({
        headerTitle: '',
        header: () => <Header navigation={navigation} />,
      })}
    />
  </CommunityStack.Navigator>
);

export default CommunityStackScreen;
