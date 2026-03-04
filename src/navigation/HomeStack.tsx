// src/navigation/HomeStack.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import DisplaySettingsScreen from '../screens/DisplaySettings/DisplaySettingsScreen';
import {useTheme} from '../context/ThemeContext';
import Dashboard from '../screens/Main/Dashboard';
import MyProfile from '../screens/Main/MyProfile';
import ChangePasswordScreen from '../screens/Main/ChangePasswordScreen';
import NewChatScreen from '../screens/Chat/NewChatScreen';
import CreateNewUser from '../components/ChatCom/CreateNewUser';
import NotificationScreen from '../screens/NotificationScreen';
import Header from '../components/SharedComponent/Header';
import PurchasedScreen from '../screens/Main/PurchasedScreen';
import LandingScreenMain from '../screens/LandingScreen/LandingScreenMain';
// import BootCampsDetails from '../screens/LandingScreen/BootCampsDetails';
import UserDashboard from '../screens/Dashboard/UserDashboard';
// import CourseDetails from '../components/PurchasedCom/CourseDetails';
import NotificationScreenHeader from '../components/NotificationScreenHeader';
import MyPaymentScreen from '../screens/MyPaymentScreen';
import GlobalBackButton from '../components/SharedComponent/GlobalBackButton';
import {HomeStackParamList} from '../types/navigation';
import CourseDetails from '../components/PurchasedCom/CourseDetails';
import NotesScreen from '../screens/Notes/NotesScreen';

const HomeStack = createStackNavigator<HomeStackParamList>();
const renderHeader = (navigation: any) => <Header navigation={navigation} />;
const renderGlobalBackButton = () => (
  <GlobalBackButton containerStyle={{marginLeft: 10}} />
);
const renderNotificationContainer = (navigation: any) => (
  <NotificationScreenHeader navigation={navigation} />
);
const HomeStackScreen: React.FC = () => {
  const Colors = useTheme(); // Assume this returns an object with color properties

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.Foreground,
        },
        headerTintColor: Colors.BodyText, // Use appropriate color from theme
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.BodyText,
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false, // Hide header for Dashboard
        }}
      />
      <HomeStack.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={({navigation}) => ({
          headerTitle: '',
          animation: 'fade',
          header: () => renderHeader(navigation),
        })}
      />
      <HomeStack.Screen
        name="DisplaySettingsScreen"
        component={DisplaySettingsScreen}
        options={{
          headerShown: false, // Hide header for DisplaySettingsScreen
          title: 'Display Settings', // Customize header title
        }}
      />
      <HomeStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{headerShown: false}}
      />
      {/* <HomeStack.Screen
        name="MyProfileEdit"
        component={MyProfileEdit}
        options={{headerShown: false}}
      /> */}
      <HomeStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={({navigation}) => ({
          headerTitle: '',
          header: () => renderHeader(navigation),
        })}
      />
      <HomeStack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={({navigation}) => ({
          headerTitle: '',
          header: () => renderHeader(navigation),
        })}
      />

      <HomeStack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={() => ({
          headerShown: false,
          animation: 'fade',
        })}
      />
      <HomeStack.Screen
        name="CreateNewUser"
        component={CreateNewUser}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={({navigation}) => ({
          headerTitle: '',
          animation: 'fade',
          header: () => renderNotificationContainer(navigation),
        })}
      />
      <HomeStack.Screen
        name="PurchasedScreen"
        component={PurchasedScreen}
        options={({navigation}) => ({
          headerTitle: '',
          header: () => renderHeader(navigation),
        })}
      />
      <HomeStack.Screen
        name="CourseDetails"
        component={CourseDetails}
        options={() => ({
          headerTitle: '',
          headerShown: false,
          headerLeft: () => renderGlobalBackButton(),
          cardStyle: {backgroundColor: Colors.Background_color},
        })}
      />
      <HomeStack.Screen
        name="LandingPage"
        component={LandingScreenMain}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="MyPaymentScreen"
        component={MyPaymentScreen}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      {/* <HomeStack.Screen
        name="BootCampsDetails"
        component={BootCampsDetails}
        options={{headerShown: false}}
      /> */}
    </HomeStack.Navigator>
  );
};

export type HomeStackProps = NativeStackScreenProps<HomeStackParamList>;
export default HomeStackScreen;
