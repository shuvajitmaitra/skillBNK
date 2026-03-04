import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {StackedBarChart, YAxis} from 'react-native-svg-charts';
import {Text as SVGText, G, Line} from 'react-native-svg';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import {ActivityIndicator} from 'react-native';
import axiosInstance from '../../utility/axiosInstance';
import Divider from '../SharedComponent/Divider';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {gGap} from '../../constants/Sizes';

const colors = ['#5DB34C', '#FF5454'];
const keys = ['completed', 'incomplete'];
const yAxisData = [0, 20, 40, 60, 80, 100];

const CustomLegend = ({colors}) => {
  const Colors = useTheme();
  const styles = getLegendStyles(Colors);
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: colors[0]}]} />
        <Text style={styles.legendLabel}>Completed</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: colors[1]}]} />
        <Text style={styles.legendLabel}>Incomplete</Text>
      </View>
    </View>
  );
};

const CoursesChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [selectCourse, setSelectCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  console.log('coursesData', JSON.stringify(coursesData, null, 2));
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const loadCourseData = courseId => {
    setIsLoading(true);
    axiosInstance
      .post('dashboard/portal', {
        course: {
          courseId,
        },
      })
      .then(res => {
        setCoursesData(res.data.data.course.results);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(
          'error you got to load course data ',
          JSON.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/order/myorder/course')
      .then(res => {
        if (res?.data?.orders?.length !== 0) {
          const firstCourse = res?.data?.orders[0]?.course;
          setSelectCourse(firstCourse?.title);
          setCourses(res?.data?.orders?.map(o => o?.course));
          setCourseId(firstCourse?._id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    }
  }, [courseId, selectCourse]);

  const transformedData = Array.isArray(coursesData)
    ? coursesData.map(item => ({
        category: item.category.name,
        completed: (item.completedItems / item.totalItems) * 100 || 0,
        incomplete: (item.incompletedItems / item.totalItems) * 100 || 0,
        label: item.category.name,
      }))
    : [];

  const Labels = ({x, y, bandwidth, data}) =>
    data.map((item, index) => (
      <G key={index}>
        <SVGText
          x={x(index) + bandwidth / 2}
          y={y(item.completed) + 10}
          fontFamily={CustomFonts.WorkSans_Regular}
          fontSize={responsiveScreenFontSize(1.4)}
          fill={Colors.PureWhite}
          alignmentBaseline="middle"
          textAnchor="middle">
          {`${item.completed.toFixed()}%`}
        </SVGText>
        <SVGText
          x={x(index) + bandwidth / 2}
          y={y(item.completed + item.incomplete) + 10}
          fontFamily={CustomFonts.WorkSans_Regular}
          fontSize={responsiveScreenFontSize(1.4)}
          fill={Colors.PureWhite}
          alignmentBaseline="middle"
          textAnchor="middle">
          {`${item.incomplete.toFixed()}%`}
        </SVGText>
      </G>
    ));
  const TextLabels = ({x, y, bandwidth, data}) =>
    data.map((item, index) => (
      <G key={index}>
        <SVGText
          x={x(index) + bandwidth / 1.8}
          y={y(0) + 30}
          fontFamily={CustomFonts.WorkSans_Regular}
          fontSize={responsiveScreenFontSize(1.4)}
          fill={Colors.PureWhite}
          alignmentBaseline="middle"
          textAnchor="middle">
          {item?.label}
        </SVGText>
      </G>
    ));
  const CustomGrid = ({x, y, ticks}) => (
    <G>
      {ticks.map(tick => (
        <Line
          key={tick}
          x1="0%"
          x2="100%"
          y1={y(tick)}
          y2={y(tick)}
          stroke={Colors.ForegroundOpacityColor}
          strokeDasharray={[4, 4]}
          strokeWidth={1}
        />
      ))}
    </G>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{
            height: responsiveScreenHeight(40),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.heading}>Courses</Text>
            <CustomDropDownTwo
              containerStyle={{width: gGap(250)}}
              data={courses.map(course => course.title)}
              background={Colors.Background_color}
              state={selectCourse}
              setState={selected => {
                setSelectCourse(selected);
                const selectedCourse = courses.find(
                  course => course.title === selected,
                );
                setCourseId(selectedCourse?._id);
              }}
            />
          </View>
          {coursesData.length > 0 ? (
            <>
              <CustomLegend colors={colors} />
              <View
                style={{
                  height: responsiveScreenFontSize(30),
                  flexDirection: 'row',
                }}>
                <YAxis
                  data={yAxisData}
                  contentInset={{
                    top: responsiveScreenHeight(1.5),
                    bottom: responsiveScreenHeight(5),
                  }}
                  svg={{
                    fill: Colors.Heading,
                    fontSize: responsiveScreenFontSize(1.6),
                    fontFamily: CustomFonts.WorkSans_Medium,
                  }}
                  formatLabel={value => `${value}`}
                  numberOfTicks={yAxisData?.length}
                  min={0}
                  max={100}
                />
                <View style={{flex: 1, marginLeft: 10}}>
                  <StackedBarChart
                    style={{flex: 1}}
                    data={transformedData}
                    keys={keys}
                    colors={colors}
                    showGrid={false}
                    contentInset={{top: 10, bottom: responsiveScreenHeight(6)}}
                    horizontal={false}
                    spacingInner={0.4}
                    spacingOuter={0.2}>
                    <CustomGrid belowChart={true} ticks={yAxisData} />
                    <Labels />
                    <TextLabels />
                  </StackedBarChart>
                </View>
              </View>
            </>
          ) : (
            <NoDataAvailable />
          )}
        </>
      )}
      <View
        style={[
          styles.dataContainer,
          {
            flexBasis: '30%',
            flexWrap: 'wrap',
            gap: 10,
          },
        ]}>
        {coursesData?.map((item, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.title}>
              {item?.category?.name || 'Untitled'}
            </Text>
            <Divider marginBottom={1} marginTop={1} />
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Total Item</Text>
              <Text style={styles.text}>{item?.totalItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Completed</Text>
              <Text style={styles.text}>{item?.completedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Incomplete</Text>
              <Text style={styles.text}>{item?.incompletedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Pinned</Text>
              <Text style={styles.text}>{item?.pinnedItems || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
    },
    labelsContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(6),
      marginLeft: responsiveScreenWidth(10),
      marginTop: 10,
      justifyContent: 'center',
      maxHeight: 20,
      alignSelf: 'baseline',
    },
    barLabelContainer: {
      alignItems: 'center',
      gap: 10,
    },
    label: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
    },
    labsLabel: {
      marginLeft: 3,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: 10,
      zIndex: 2,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    dataContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    box: {
      padding: 10,
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(42),
      // marginHorizontal: responsiveScreenWidth(1)
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      textAlign: 'center',
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
    },
  });

const getLegendStyles = Colors =>
  StyleSheet.create({
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    legendColor: {
      width: 15,
      height: 15,
      borderRadius: 5,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
  });

export default CoursesChart;
