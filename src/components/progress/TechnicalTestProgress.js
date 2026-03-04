import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import Divider from '../SharedComponent/Divider';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import CustomPieChart from '../SharedComponent/CustomPieChart';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

function convertDataToPercentage(data) {
  const total =
    data?.results?.totalItems +
    data?.results?.pendingItems +
    data?.results?.acceptedItems +
    data?.results?.rejectedItems;

  if (total === 0) {
    return [];
  }

  const fields = [
    {key: 'totalItems', color: '#097EF2'},
    {key: 'totalAnswered', color: 'skyblue'},
    {key: 'rejectedItems', color: '#F34141'},
    {key: 'acceptedItems', color: '#2A9A13'},
    {key: 'pendingItems', color: '#F90'},
  ];

  const percentageData = [];
  let keyCounter = 1;

  fields.forEach(field => {
    const value = data?.results[field.key];
    if (value > 0) {
      const percentage = (value / total) * 100;
      percentageData.push({
        key: keyCounter++,
        value: percentage,
        svg: {fill: field.color},
      });
    }
  });

  return percentageData;
}

// function transformCalendarDataDynamic(assignment) {
//   const keyDescriptions = {
//     totalItems: "Total Answers",
//     pendingItems: "Accepted",
//     acceptedItems: "Pending",
//     rejectedItems: "Rejected",
//   };

//   return Object.keys(assignment)?.map((key) => ({
//     name: keyDescriptions[key] || key,
//     key: key,
//     value: assignment[key],
//   }));
// }

const TechnicalTestProgress = ({}) => {
  // const [value, setValue] = useState("This Year");

  const Colors = useTheme();
  const styles = getStyles(Colors);
  // const data = ["This Day", "This Month", "This Year"];
  const assignment = useSelector(
    state => state.dashboard?.dashboardData?.assignment,
  );

  console.log('assignment', JSON.stringify(assignment, null, 2));
  const newAssignment = {
    success: assignment?.success,
    results: {
      totalItems: assignment?.results?.totalItems,
      pendingItems: assignment?.results?.pendingItems,
      acceptedItems: assignment?.results?.acceptedItems,
      rejectedItems: assignment?.results?.rejectedItems,
    },
  };

  const navigation = useNavigation();

  // const pieData = [
  //   {
  //     key: 1,
  //     value: 50,
  //     svg: { fill: "#2A9A13" },
  //   },
  //   {
  //     key: 2,
  //     value: 30,
  //     svg: { fill: "#F34141" },
  //   },
  //   {
  //     key: 3,
  //     value: 40,
  //     svg: { fill: "#097EF2" },
  //   },
  //   {
  //     key: 4,
  //     value: 95,
  //     svg: { fill: "#F90" },
  //   },
  //   {
  //     key: 5,
  //     value: 85,
  //     svg: { fill: "#3DB8AD" },
  //   },
  // ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            zIndex: -9,
          }}>
          <Text style={styles.HeadingText}>Technical Test</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProgramStack', {
                screen: 'TechnicalTestScreen',
              })
            }>
            <ArrowTopRight />
          </TouchableOpacity>
        </View>
        {/* <View style={{ zIndex: 9 }}>
          <CustomDropDownTwo data={data} state={value} setState={setValue} />
        </View> */}
      </View>

      <Divider marginTop={1} marginBottom={1} />
      <CustomPieChart
        pieData={convertDataToPercentage(newAssignment)}
        // pieData={pieData}
      />
      {/* <View style={styles.legendContainer}>
        {assignment?.results &&
          transformCalendarDataDynamic(assignment?.results)?.map(
            (item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <View
                    style={[
                      styles.colorBox,
                      {
                        backgroundColor:
                          (item.name === "Total Answers" && Colors.Primary) ||
                          (item.name === "Accepted" && "#097EF2") ||
                          (item.name === "Pending" && "#F90") ||
                          (item.name === "Rejected" && "#F34141") ||
                          Colors.Primary,
                      },
                    ]}
                  ></View>
                  <Text style={styles.legendName}>{item?.name}</Text>
                </View>
                <Text style={styles.legendValue}>{item?.value}</Text>
              </View>
            )
          )}
      </View> */}
      <View style={styles.legendContainer}>
        <View style={styles.itemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: Colors.Primary,
                },
              ]}></View>
            <Text style={styles.legendName}>Total Assignments</Text>
          </View>
          <Text style={styles.legendValue}>
            {newAssignment?.results?.totalItems}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: 'lightgreen',
                },
              ]}></View>
            <Text style={styles.legendName}>Total Answered</Text>
          </View>
          <Text style={styles.legendValue}>
            {newAssignment?.results?.pendingItems}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: '#F90',
                },
              ]}></View>
            <Text style={styles.legendName}>Pending</Text>
          </View>
          <Text style={styles.legendValue}>
            {newAssignment?.results?.pendingItems}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: Colors.Red,
                },
              ]}></View>
            <Text style={styles.legendName}>Rejected</Text>
          </View>
          <Text style={styles.legendValue}>
            {newAssignment?.results?.rejectedItems}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TechnicalTestProgress;

const getStyles = Colors =>
  StyleSheet.create({
    legendValue: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
    },
    legendName: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      // fontSize: responsiveScreenFontSize(1.8),
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 10,
      // backgroundColor: "red",
      // flex: 0.5,
    },
    itemContainer: {
      flexDirection: 'row',
      gap: 5,
      marginBottom: responsiveScreenHeight(1),
      // flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      // backgroundColor: "red",
      // flex: ,
      width: '48%',
    },
    colorBox: {
      width: 15,

      height: 15,

      borderRadius: 4,
    },
    progress: {
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    details: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1.5),
      textAlign: 'center',
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(4),
      color: Colors.Primary,
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 10,
      zIndex: 1,
    },
    headerContainer: {
      flexDirection: 'row',

      justifyContent: 'space-between',
      zIndex: 10,
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
  });
