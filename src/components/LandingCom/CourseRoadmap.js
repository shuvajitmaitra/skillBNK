import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import Feather from 'react-native-vector-icons/Feather';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const {width} = Dimensions.get('window');

const CourseRoadmap = ({courseId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [benefits, setBenefits] = useState([]);
  // console.log("courseId", JSON.stringify(benefits?.roadmap?.quarters, null, 1));
  const weeksData = benefits?.roadmap?.quarters;
  const weeks = weeksData?.[0]?.['weeks'] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("weeks", JSON.stringify(weeks, null, 1));
  const handleNext = () => {
    if (currentIndex < weeks.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({index: currentIndex - 1});
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.slide}>
      <Text style={styles.slideText}>{item.title}</Text>
      <Text style={styles.descriptionText}>{item.description}</Text>
      <View style={styles.weeksContainer}>
        <Text style={styles.weeksText}>Weeks {index + 1}</Text>
      </View>
    </View>
  );

  const getBenefitsData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/course/roadmap/find/${courseId}`);
      setBenefits(res?.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getBenefitsData();
  }, []);

  // console.log("weeks", JSON.stringify(weeks, null, 1));
  return (
    weeks?.length > 0 && (
      <View style={styles.container}>
        <Text style={styles.title}>Journey For Quarter-1 (1 Quarters)</Text>
        <FlatList
          ref={flatListRef}
          data={weeks}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={handlePrev}
          style={styles.leftButton}
          disabled={currentIndex === 0}>
          <Feather name="chevron-left" size={24} color={Colors.Primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.rightButton}
          disabled={currentIndex === weeks.length - 1}>
          <Feather name="chevron-right" size={24} color={Colors.Primary} />
        </TouchableOpacity>
      </View>
    )
  );
};

export default CourseRoadmap;

const getStyles = Colors =>
  StyleSheet.create({
    weeksText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.BOLD,
      fontSize: responsiveFontSize(3),
    },
    weeksContainer: {
      position: 'absolute',
      paddingVertical: 10,
      paddingHorizontal: 30,
      top: -30,
      borderRadius: 10,
      left: responsiveWidth(25),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
      borderWidth: 2,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
      paddingBottom: responsiveHeight(3),
      textAlign: 'center',
    },
    container: {
      flex: 1,
      paddingVertical: 25,
      // backgroundColor: "green",
    },
    slide: {
      backgroundColor: Colors.Foreground,
      padding: 10,
      borderRadius: 10,
      width: width - 40,
      marginHorizontal: 20,
      marginTop: 30,
      alignItems: 'center',
      paddingTop: 50,
    },
    slideText: {
      fontSize: responsiveFontSize(3.5),
      fontWeight: CustomFonts.MEDIUM,
      color: Colors.Heading,
      textAlign: 'center',
      marginBottom: 10,
      paddingHorizontal: 20,
    },
    rightButton: {
      padding: 10,
      borderRadius: 50,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Primary,
      backgroundColor: Colors.Foreground,
      position: 'absolute',
      bottom: 160,
      right: 5,
    },
    leftButton: {
      padding: 10,
      borderRadius: 50,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Primary,
      position: 'absolute',
      bottom: 160,
      left: 5,
      backgroundColor: Colors.Foreground,
    },
    descriptionText: {
      textAlign: 'center',
      marginHorizontal: 30,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveFontSize(2),
    },
  });
