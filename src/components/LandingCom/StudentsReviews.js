import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import ReviewsBody from './ReviewsBody';

const StudentsReviews = ({courseId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(3);
  const [categories, setCategories] = useState('categories');

  const [type, setType] = useState('reviews');
  const [reviewsData, setReviewsData] = useState({});
  const activeCategories = reviewsData?.categories;
  const [sortedCategory, setShortedCategory] = useState(activeCategories);

  useEffect(() => {
    if (activeCategories && activeCategories.length > 0) {
      const defaultCategory = activeCategories.find(
        category => category.isDefault === true,
      );
      const otherCategories = activeCategories.filter(
        category => category.isDefault === false,
      );
      if (defaultCategory) {
        const sortedCategories = [defaultCategory, ...otherCategories];
        setShortedCategory(sortedCategories);
      }
    }
  }, [activeCategories]);

  // console.log("sortedCategory", JSON.stringify(sortedCategory, null, 1));

  const handleTabStatus = tab => {
    setStatus(tab?.name);
    setLimit(3);
  };

  const getCourseData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(
        `/course/review/get/${courseId}?fields[]=${categories}&fields[]=${type}&page=1&limit=0&category=""`,
      );
      setReviewsData(res?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching course data:', error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  useEffect(() => {
    const defaultCategory = reviewsData?.categories?.find(
      item => item?.isDefault,
    );
    setStatus(defaultCategory?.name);
    // console.log("defaultCategory", JSON.stringify(defaultCategory, null, 1));
  }, [reviewsData?.categories]);
  // console.log("", JSON.stringify(category, null, 1));
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Student Reviews</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <View style={styles.tabContainer}>
            {sortedCategory?.map(
              (tab, index) =>
                tab?.isActive && (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTabStatus(tab)}
                    style={[
                      styles.tabButton,
                      status === tab?.name && styles.tabActiveButton,
                    ]}>
                    <Text
                      style={[
                        styles.tabText,
                        status === tab?.name
                          ? styles.activeTabText
                          : styles.inactiveTabText,
                      ]}>
                      {tab?.name}
                    </Text>
                  </TouchableOpacity>
                ),
            )}
          </View>
        </ScrollView>
      </View>
      <ReviewsBody
        courseId={courseId}
        categories={categories}
        category={status}
        type={type}
        setLimit={setLimit}
        limit={limit}
      />
    </View>
  );
};

export default StudentsReviews;

const getStyles = Colors =>
  StyleSheet.create({
    showMoreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      color: Colors.PureWhite,
      paddingVertical: 8,
      fontSize: responsiveFontSize(2),
    },
    showMoreButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      width: responsiveWidth(30),
      marginTop: 20,
    },
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
      // backgroundColor: "green",
    },
    scrollViewContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 100,
      flex: 0.6,
    },
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1,
      flexShrink: 1,
    },
    tabButton: {
      paddingHorizontal: responsiveScreenWidth(2.5),
      paddingVertical: responsiveHeight(1),
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 1,
      flexGrow: 1,
      width: responsiveWidth(40),
    },
    tabActiveButton: {
      backgroundColor: Colors?.Primary,
      borderRadius: 100,
    },
    tabText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(1.8),
      borderRadius: 10,
      textAlign: 'center',
      flexWrap: 'wrap',
      lineHeight: responsiveFontSize(2.2),
    },
    activeTabText: {
      color: Colors.PureWhite,
    },
    inactiveTabText: {
      color: Colors.Primary,
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveFontSize(3),
      textAlign: 'center',
      marginBottom: 20,
    },
  });
