import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Program from '../screens/Main/Program';
import ProgramDetails from '../screens/Main/ProgramDetails';
import Progress from '../screens/Main/Progress';
import {useTheme} from '../context/ThemeContext';
import TechnicalTestScreen from '../screens/TechnicalTest/TechnicalTestScreen';
import TestNow from '../components/TechnicalTestCom/TestNow';
import ViewStatus from '../components/TechnicalTestCom/ViewStatus';
import LeaderBoardScreen from '../screens/Leaderboard/LeaderBoardScreen';
import DayToDayActivities from '../screens/DayToDayActivities/DayToDayActivities';
import ActivitiesDetails from '../screens/DayToDayActivities/ActivitiesDetails';
import ShowAndTellScreen from '../screens/ShowNTell/ShowAndTellScreen';
import ShowNTellDetails from '../screens/ShowNTell/ShowNTellDetails';
import AudioVideoScreen from '../screens/AudioVideo/AudioVideoScreen';
import Header from '../components/SharedComponent/Header';
import DocumentsLabsDetailsScreen from '../screens/Documents/DocumentsLabsDetailsScreen';
import AudioVideoDetails from '../screens/AudioVideo/AudioVideoDetails';
import GlobalBackButton from '../components/SharedComponent/GlobalBackButton';
import {ProgramStackParamList} from '../types/navigation';
import MockInterviewDetails from '../screens/MockInterview/MockInterviewDetails';
import DocumentsLabsScreen from '../screens/Documents/DocumentsLabsScreen';
import MyDocumentsScreen from '../screens/Documents/MyDocumentsScreen';
import MyDocumentsDetailsScreen from '../screens/Documents/MyDocumentsDetailsScreen';
import UploadedDocumentsScreens from '../screens/Documents/UploadedDocumentsScreens';
import UploadedDocumentsDetailsScreen from '../screens/Documents/UploadedDocumentsDetailsScreen';

const ProgramStack = createStackNavigator<ProgramStackParamList>();
const renderHeader = (navigation: any) => <Header navigation={navigation} />;
const renderGlobalBackButton = () => (
  <GlobalBackButton containerStyle={{marginLeft: 10}} />
);

const ProgramStackScreen = () => {
  const Colors = useTheme();

  return (
    <ProgramStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.Foreground,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Program">
      <ProgramStack.Screen
        name="Program"
        component={Program}
        options={{headerShown: false}}
      />
      <ProgramStack.Screen
        name="AudioVideoScreen"
        component={AudioVideoScreen}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="AudioVideoDetails"
        component={AudioVideoDetails}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
          headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: Colors.BorderColor,
            backgroundColor: Colors.Foreground,
          },
        })}
      />
      <ProgramStack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={() => ({
          headerTitle: '',
          animation: 'fade',
          headerShown: false,
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="TechnicalTestScreen"
        component={TechnicalTestScreen}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
          headerShown: false,
        })}
      />
      <ProgramStack.Screen
        name="ShowAndTellScreen"
        component={ShowAndTellScreen}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="ShowNTellDetails"
        component={ShowNTellDetails}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="TestNow"
        component={TestNow}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="ViewStatus"
        component={ViewStatus}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
          headerShown: false,
        })}
      />

      <ProgramStack.Screen
        name="LeaderBoardScreen"
        component={LeaderBoardScreen}
        options={({navigation}) => ({
          headerTitle: '',
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="DayToDayActivities"
        component={DayToDayActivities}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="ActivitiesDetails"
        component={ActivitiesDetails}
        options={() => ({
          headerTitle: '',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="Progress"
        component={Progress}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />

      <ProgramStack.Screen
        name="InterviewDetails"
        component={MockInterviewDetails}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />

      <ProgramStack.Screen
        name="DocumentsLabsScreen"
        component={DocumentsLabsScreen}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="DocumentsLabsDetailsScreen"
        component={DocumentsLabsDetailsScreen}
        options={() => ({
          headerTitle: '',
          animation: 'fade',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="MyDocumentsDetailsScreen"
        component={MyDocumentsDetailsScreen}
        options={() => ({
          headerTitle: '',
          animation: 'fade',
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="UploadedDocumentsDetailsScreen"
        component={UploadedDocumentsDetailsScreen}
        options={() => ({
          headerTitle: '',
          animation: 'fade',
          headerShown: false,
          headerLeft: () => renderGlobalBackButton(),
        })}
      />
      <ProgramStack.Screen
        name="MyDocumentsScreen"
        component={MyDocumentsScreen}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
      <ProgramStack.Screen
        name="UploadedDocumentsScreen"
        component={UploadedDocumentsScreens}
        options={({navigation}) => ({
          header: () => renderHeader(navigation),
        })}
      />
    </ProgramStack.Navigator>
  );
};

export default ProgramStackScreen;
