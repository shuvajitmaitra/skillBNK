import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text as RNText} from 'react-native';
import {BarChart} from 'react-native-svg-charts';
import {Rect, Text as SvgText} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import axiosInstance from '../../utility/axiosInstance';
import moment from 'moment';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import {gHeight} from '../../constants/Sizes';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';

const DayToDayChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [timeFrame, setTimeFrame] = useState('month');
  const [dayToday, setDayToday] = useState([]);
  const option = ['week', 'month'];
  const [loading, setLoading] = useState(false);

  console.log('dayToday', JSON.stringify(dayToday, null, 2));

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .post('dashboard/portal', {
        dayToday: {timeFrame},
      })
      .then(res => {
        setLoading(false);
        let apiData = res.data.data.dayToday.results || [];

        let processedData = [...apiData];

        if (apiData.length < 5) {
          // Determine the last week number
          let lastWeekNumber = 0;
          if (apiData.length > 0) {
            const lastLabel = apiData[apiData.length - 1].label;
            if (lastLabel.startsWith('Week')) {
              lastWeekNumber = parseInt(lastLabel.split(' ')[1], 10) || 0;
            }
          }

          // Add dummy data to reach a total of 10 items
          const dummyCount = 10 - apiData.length;
          for (let i = 1; i <= dummyCount; i++) {
            processedData.push({
              count: 0,
              label: `Week ${lastWeekNumber + i}`,
            });
          }
        }

        setDayToday(processedData);
      })
      .catch(error => {
        console.log('Error fetching day-to-day data', error.response.data);
        setLoading(false);
      });
  }, [timeFrame]);

  // Extract counts and formatted labels from your data
  const data = dayToday?.map(result => result?.count) || [];
  const labels =
    dayToday?.map(result =>
      result.label.startsWith('Week')
        ? `W ${result.label.split(' ')[1]}`
        : moment(result?.label, 'MMMM YYYY').format('MMM'),
    ) || [];

  // CustomBar renders the bars as rectangles
  const CustomBar = ({x, y, bandwidth}) =>
    data.map((value, index) => (
      <Rect
        key={index}
        x={x(index)}
        y={y(value)}
        rx={5}
        ry={5}
        width={bandwidth}
        height={y(0) - y(value)}
        fill={Colors.Primary}
      />
    ));

  const Labels = ({x, y, bandwidth}) =>
    data.map((value, index) => (
      <SvgText
        key={index}
        x={x(index) + bandwidth / 2}
        y={y(0) + responsiveScreenFontSize(2)}
        fontSize={responsiveScreenFontSize(1.2)}
        fill={Colors.BodyText}
        alignmentBaseline="middle"
        textAnchor="middle">
        {labels[index]}
      </SvgText>
    ));

  return (
    <View>
      <View style={styles.titleContainer}>
        <RNText style={styles.title}>Day-to-Day Activities</RNText>
        <CustomDropDownTwo
          flex={0.6}
          data={option}
          state={timeFrame}
          setState={setTimeFrame}
          background={Colors.Background_color}
        />
      </View>
      {loading ? (
        <View
          style={{
            height: gHeight(200),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LoadingSmall color={Colors.Primary} />
        </View>
      ) : (
        <View>
          {data.length > 0 ? (
            <BarChart
              style={{height: gHeight(200), width: '100%'}}
              data={data}
              gridMin={0}
              contentInset={{bottom: 20}}
              svg={{fill: 'none'}}>
              <CustomBar />
              <Labels />
            </BarChart>
          ) : (
            <NoDataAvailable />
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
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
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });

export default DayToDayChart;
