import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import Divider from '../SharedComponent/Divider';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import ActivityProgressBar from './ActivityProgressBar';
import {useNavigation} from '@react-navigation/native';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

const OtherActivitiesProgress = ({
  showNTell,
  community,
  mockInterview,
  myUploadedDocuments,
}) => {
  const [value, setValue] = useState('This Year');

  const navigation = useNavigation();
  const {showAlert} = useGlobalAlert();

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dropDownData = ['This Day', 'This Month', 'This Year'];
  const data = [
    {
      title: 'Show N Tell',
      value: 50,
      count: showNTell?.count,
      limit: showNTell?.limit,
      func: () => {
        navigation.navigate('ProgramStack', {
          screen: 'ShowAndTellScreen',
        });
      },
    },
    {
      title: 'Mock Interview',
      value: 50,
      count: mockInterview?.results?.submitted || 0,
      limit: 10,
      func: () => {
        navigation.navigate('ProgramStack', {screen: 'MockInterview'});
      },
    },
    {
      title: 'My Uploaded Documents',
      value: 50,
      count: myUploadedDocuments?.count,
      limit: myUploadedDocuments?.limit,
      func: () => {
        showAlert({
          title: 'Coming Soon...',
          type: 'warning',
          message: 'This feature is coming soon.',
        });
      },
    },
    {
      title: 'Community',
      value: 50,
      count: community?.results?.totalCommintyPost || 0,
      limit: 100,
      func: () => {
        navigation.navigate('CommunityStack', {
          screen: 'CommunityScreen',
        });
      },
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Others Activity</Text>
        {/* <CustomDropDownTwo
          data={dropDownData}
          state={value}
          setState={setValue}
        /> */}
      </View>

      <Divider marginTop={1} marginBottom={1} />
      <View style={styles.cartContainer}>
        {data?.map((item, index) => (
          <ActivityProgressBar key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default OtherActivitiesProgress;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      zIndex: 2,
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 10,
      paddingBottom: 0,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 2,
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: '100%',
      alignItems: 'center',
      // backgroundColor: 'red',
    },
  });
