import React, {useState} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import CalendarProgressCart from '../progress/CalendarProgressCart';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';

export default function TechnicalChart() {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const assignmentData = useSelector(
    state => state.dashboard?.dashboardData?.assignment?.results,
  );
  console.log('technical test data', JSON.stringify(assignmentData, null, 2));

  const progressData = [
    {
      title: 'Total Assignments',
      value: assignmentData?.totalItems,
      percentage: 100,
      color: Colors.Primary,
    },
    {
      title: 'Accepted',
      value: assignmentData?.acceptedItems ?? 0,
      percentage:
        (assignmentData?.acceptedItems / assignmentData?.totalItems) * 100 || 0,
      color: Colors.Primary,
    },
    {
      title: 'Denied',
      value: assignmentData?.rejectedItems ?? 0,
      percentage:
        (assignmentData?.rejectedItems / assignmentData?.totalItems) * 100 || 0,
      color: Colors.Red,
    },
    {
      title: 'Pending',
      value: assignmentData?.pendingItems ?? 0,
      percentage:
        (assignmentData?.pendingItems / assignmentData?.totalItems) * 100 || 0,
      color: '#FFB800',
    },
  ];

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Technical Test</Text>
        {/* <CustomDropDownTwo
                data={option}
                state={selectedOption}
                setState={setSelectedOption}
              /> */}
      </View>
      <View>
        <FlatList
          nestedScrollEnabled={true}
          data={progressData}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between', gap: 10}}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => (
            <CalendarProgressCart
              title={item.title}
              percentage={item.percentage}
              value={item?.value?.toString() || ''}
              color={item.color}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    box: {
      // width: responsiveScreenWidth(37),
    },
    bottom: {
      marginTop: responsiveScreenHeight(2),
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: 10,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });
