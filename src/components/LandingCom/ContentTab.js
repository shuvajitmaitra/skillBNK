import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import ContentBody from './ContentTabCom/ContentBody';
import axiosInstance from '../../utility/axiosInstance';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import Loading from '../SharedComponent/Loading';

const ContentTab = ({categories, courseId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [status, setStatus] = useState(null);
  const [lessonData, setLessonData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cachedData, setCachedData] = useState({});
  const [displayCount, setDisplayCount] = useState(6);
  const [allChapters, setChapters] = useState([]);

  useEffect(() => {
    if (categories?.length > 0) {
      const active = categories.filter(category => category?.isActive);
      setActiveCategories(active);
      if (active.length > 0) {
        const firstActive = active[0];
        setCategoryId(firstActive._id);
        setStatus(firstActive.name);
      }
    }
  }, [categories]);

  const handleTabStatus = tab => {
    setStatus(tab?.name);
    setCategoryId(tab?._id);
    setDisplayCount(6);
  };
  const chapters = lessonData?.chapters?.chapters || [];
  // const chapterData = chapters.filter((item) => item.chapter) || [];
  const dataToDisplay = chapters.slice(0, displayCount);

  const handleShowMoreOrLess = () => {
    if (displayCount >= chapters?.length) {
      setDisplayCount(6);
    } else {
      setDisplayCount(prevCount => Math.min(prevCount + 6, chapters?.length));
    }
  };

  const getContentData = async () => {
    setIsLoading(true);
    if (!categoryId) return;

    if (cachedData[categoryId]) {
      setLessonData(cachedData[categoryId]);
      setIsLoading(false);
    } else {
      try {
        const res = await axiosInstance.post('/course/chapterv2/preview', {
          courseId: courseId,
          fields: ['chapters'],
          categoryId: categoryId,
        });

        const data = res?.data?.results;

        setLessonData(data);
        setCachedData(prev => ({
          ...prev,
          [categoryId]: data,
        }));
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (categoryId) {
      getContentData();
    }
  }, [categoryId]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollViewContainer}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <View style={styles.tabContainer}>
            {activeCategories?.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTabStatus(tab)}
                style={[
                  {
                    paddingHorizontal: responsiveScreenWidth(1.9),
                  },
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
            ))}
          </View>
        </ScrollView>
      </View>

      {isLoading ? (
        <Loading backgroundColor={'transparent'} />
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabViewContainer}>
            {dataToDisplay?.map(item => (
              <ContentBody key={item?._id} item={item} chapters={chapters} />
            ))}
          </ScrollView>
          {chapters.length > 6 && (
            <TouchableOpacity
              onPress={handleShowMoreOrLess}
              style={styles.showMoreButton}>
              <Text style={styles.showMoreButtonText}>
                {displayCount >= chapters?.length ? 'See Less' : 'See More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ContentTab;

const getStyles = Colors =>
  StyleSheet.create({
    showMoreButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      width: responsiveWidth(30),
      marginTop: 5,
    },
    showMoreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      color: Colors.PureWhite,
      paddingVertical: 8,
      fontSize: responsiveFontSize(2),
    },
    tabViewContainer: {
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(1),
    },
    scrollViewContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 100,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    tabActiveButton: {
      backgroundColor: Colors?.Primary,
      paddingVertical: responsiveScreenWidth(2.5),
      borderRadius: 100,
    },
    activeTabText: {
      color: Colors.PureWhite,
    },
    inactiveTabText: {
      color: Colors.Primary,
    },
    mainContainer: {
      flex: 1,
      paddingTop: responsiveHeight(2),
      paddingHorizontal: 5,
      borderRadius: 10,
    },
    tabText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
      paddingHorizontal: 15,
      borderRadius: 10,
    },
  });
