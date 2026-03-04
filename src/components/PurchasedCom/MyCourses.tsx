import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import Loading from '../SharedComponent/Loading';
import CoursesCard from './CoursesCard';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {TColors} from '../../types';
import {TCourse} from '../../types/courses/courses';
import {gPadding} from '../../constants/Sizes';

const MyCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  // const [selectedCourse, setSelectedCourse] = useState('');
  const Colors = useTheme();
  const styles = getStyles(Colors);
  React.useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/order/myorder/course')
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 2));
        if (res.data.orders?.length !== 0) {
          setCourses(res.data.orders);
          // setSelectedCourse(res.data.orders[0].course._id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log('You got error', JSON.stringify(err, null, 1));
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.headingText}>Courses</Text>
        <Text style={styles.subHeading}>
          Explore Your Learning and Services
        </Text>
        {isLoading ? (
          <View style={{flex: 1, height: responsiveScreenHeight(60)}}>
            <Loading backgroundColor={'transparent'} />
          </View>
        ) : (
          <>
            {!courses.length ? (
              <View
                style={{
                  height: responsiveScreenHeight(60),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NoDataAvailable />
              </View>
            ) : (
              <View style={styles.cardContainer}>
                {courses.reverse().map((item: TCourse, index: number) => (
                  <CoursesCard key={index} item={item} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MyCourses;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingBottom: responsiveScreenHeight(1.5),
    },
    cardContainer: {
      gap: 10,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: gPadding(15),
    },

    headingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
  });
