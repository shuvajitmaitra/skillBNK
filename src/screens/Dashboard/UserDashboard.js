import React from 'react';
import {View, Text, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import AllProgress from '../../components/DashboardCom/AllProgress';
import BootCampChart from '../../components/DashboardCom/BootCampChart';
import CoursesChart from '../../components/DashboardCom/CoursesChart';
import CalenderChart from '../../components/DashboardCom/CalenderChart';
import SntChart from '../../components/DashboardCom/SntChart';
import MockChart from '../../components/DashboardCom/MockChart';
import TechnicalChart from '../../components/DashboardCom/TechnicalChart';
import MessagesChart from '../../components/DashboardCom/MessagesChart';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import useFetchDashboardData from '../../hook/useFetchDashboardData';
import ChartSection from '../../components/DashboardCom/ChartSection';
import CustomFonts from '../../constants/CustomFonts';
import DayToDayChart from '../../components/DashboardCom/DayToDayChart';
import {useSelector} from 'react-redux';
import {gGap} from '../../constants/Sizes';
import {ProfileCart} from '../../components/DashboardCom/ProfileCart';
import {theme} from '../../utility/commonFunction';

export default function UserDashboard() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const {navigation: navigationData} = useSelector(state => state.auth);

  const {isLoading} = useFetchDashboardData('');
  // console.log("technical test data", JSON.stringify(assignmentData, null, 2));

  // if (isLoading) {
  //   return (
  //     <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
  //       <Loading backgroundColor={'transparent'} />
  //     </View>
  //   );
  // }

  const handleNavigation = (screen, stack) => () => {
    navigation.navigate(stack, {screen});
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Insightful Overview of Your Progress and Activities
          </Text>
          {/* <Divider
            marginBottom={1}
            marginTop={1}
            style={{marginHorizontal: responsiveScreenWidth(2)}}
          /> */}
          <View style={{gap: 15}}>
            <ChartSection
              onPress={handleNavigation('Progress', 'ProgramStack')}
              Colors={Colors}
              Component={AllProgress}
              title={'View More'}
              width={responsiveScreenWidth(25)}
              height={30}
              fontSize={responsiveScreenFontSize(1.6)}
            />
            {navigationData.myProgram && (
              <ChartSection
                onPress={handleNavigation('Program', 'ProgramStack')}
                Colors={Colors}
                Component={BootCampChart}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )}
            {/* <ChartSection
              onPress={handleNavigation('PurchasedScreen', 'HomeStack')}
              Colors={Colors}
              Component={CoursesChart}
              title={'View More'}
              width={responsiveScreenWidth(25)}
              height={30}
              fontSize={responsiveScreenFontSize(1.6)}
            /> */}
            <ChartSection
              onPress={null}
              Colors={Colors}
              Component={ProfileCart}
              title={'View More'}
              width={responsiveScreenWidth(25)}
              height={30}
              fontSize={responsiveScreenFontSize(1.6)}
            />
            <ChartSection
              onPress={handleNavigation('CalendarScreen', 'MyCalenderStack')}
              Colors={Colors}
              Component={CalenderChart}
              title={'View More'}
              width={responsiveScreenWidth(25)}
              height={30}
              fontSize={responsiveScreenFontSize(1.6)}
            />
            {navigationData.technicalTest && (
              <ChartSection
                onPress={handleNavigation(
                  'TechnicalTestScreen',
                  'ProgramStack',
                )}
                Colors={Colors}
                Component={TechnicalChart}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )}
            {navigationData.showTell && (
              <ChartSection
                onPress={handleNavigation('ShowAndTellScreen', 'ProgramStack')}
                Colors={Colors}
                Component={SntChart}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )}
            {/* {enrolled && (
              <ChartSection
                onPress={handleNavigation('DocumentsLabsScreen', 'PresentationStack')}
                Colors={Colors}
                Component={Document}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )} */}
            {navigationData.myMockInterview && (
              <ChartSection
                onPress={handleNavigation('MockInterview', 'ProgramStack')}
                Colors={Colors}
                Component={MockChart}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )}
            <ChartSection
              onPress={handleNavigation('NewChatScreen', 'HomeStack')}
              Colors={Colors}
              Component={MessagesChart}
              title={'View More'}
              width={responsiveScreenWidth(25)}
              height={30}
              fontSize={responsiveScreenFontSize(1.6)}
            />
            {navigationData.myDayToDayActivity && (
              <ChartSection
                onPress={handleNavigation('DayToDayActivities', 'ProgramStack')}
                Colors={Colors}
                Component={DayToDayChart}
                title={'View More'}
                width={responsiveScreenWidth(25)}
                height={30}
                fontSize={responsiveScreenFontSize(1.6)}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Background_color,
      paddingBottom: responsiveScreenHeight(1.5),
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(2),
    },
    subtitle: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      // paddingTop: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      marginBottom: gGap(10),
    },
  });
