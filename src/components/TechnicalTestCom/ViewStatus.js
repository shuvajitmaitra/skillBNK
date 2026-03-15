import {StyleSheet, Text, View, StatusBar, ScrollView} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import GlobalHeaderBackButton from '../SharedComponent/GlobalHeaderBackButton';
import {theme} from '../../utility/commonFunction';
import {SafeAreaView} from 'react-native-safe-area-context';
import GlobalStatusBar from '../SharedComponent/GlobalStatusBar';

export default function ViewStatus(route) {
  const totalAssignment = route?.route?.params?.assignments?.length;
  const totalAnswer = route?.route?.params?.assignments?.filter(
    item => item.submission,
  );
  const notAnswered = route?.route?.params?.assignments?.filter(
    item => !item?.submission?.status,
  );
  const accepted = route?.route?.params?.assignments?.filter(
    item => item?.submission?.status === 'accepted',
  );
  const rejected = route?.route?.params?.assignments?.filter(
    item => item?.submission?.status === 'rejected',
  );
  const pending = route?.route?.params?.assignments?.filter(
    item => item?.submission?.status === 'pending',
  );
  const technicalTask = route?.route?.params?.assignments?.filter(
    item => item?.category === 'task',
  );
  const technicalQuestion = route?.route?.params?.assignments?.filter(
    item => item?.category === 'question',
  );

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeaderBackButton HText="Overall Status" />
      <GlobalStatusBar />

      <ScrollView style={styles.statusContainer}>
        <View style={styles.assessmentContainer}>
          <Text style={styles.heading}>Total Assessments</Text>
          <Text style={styles.text}>
            This is the statistics of technical assignments
          </Text>

          <View>
            <View style={styles.statisticsContainer}>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Total Assignments</Text>
                <Text style={[styles.number, {color: '#27AC1F'}]}>
                  {totalAssignment}
                </Text>
              </View>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Not Answered</Text>
                <Text style={[styles.number, {color: '#097EF2'}]}>
                  {notAnswered?.length}
                </Text>
              </View>
            </View>
            <View style={styles.statisticsContainer}>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Technical Task</Text>
                <Text style={[styles.number, {color: '#F37004'}]}>
                  {technicalTask?.length}
                </Text>
              </View>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Technical Question</Text>
                <Text style={[styles.number, {color: '#0CA9B2'}]}>
                  {technicalQuestion?.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* ---------
                    ---------Assessments Statistics-------
                    --------------------------- */}
        <View style={[styles.assessmentContainer, {marginTop: 15}]}>
          <Text style={styles.heading}>Assessments Statistics</Text>
          <Text style={styles.text}>
            This is the statistics of all answered assignments you made
          </Text>

          <View>
            <View style={styles.statisticsContainer}>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Total Answers</Text>
                <Text style={[styles.number, {color: '#27AC1F'}]}>
                  {totalAnswer?.length}
                </Text>
              </View>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Accepted</Text>
                <Text style={[styles.number, {color: '#00D7C4'}]}>
                  {accepted?.length}
                </Text>
              </View>
            </View>
            <View style={styles.statisticsContainer}>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Pending</Text>
                <Text style={[styles.number, {color: '#FF9900'}]}>
                  {pending?.length}
                </Text>
              </View>
              <View style={styles.stateBox}>
                <Text style={styles.statusText}>Rejected</Text>
                <Text style={[styles.number, {color: '#F34141'}]}>
                  {rejected?.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(5),
    },

    statusContainer: {
      backgroundColor: Colors.Foreground,
      padding: 15,
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    line: {
      marginTop: responsiveScreenHeight(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },
    assessmentContainer: {
      padding: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
    },
    heading: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    text: {
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      marginBottom: responsiveScreenHeight(1),
    },
    statisticsContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1.5),
    },
    stateBox: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      flex: 1,
    },
    statusText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    number: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.6),
    },
  });
