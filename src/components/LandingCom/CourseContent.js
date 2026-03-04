import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import ContentTab from './ContentTab';

const CourseContent = ({courseId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [contentData, setContentData] = useState({});

  const getContentData = async () => {
    try {
      const res = await axiosInstance.post('/course/chapterv2/preview', {
        courseId: courseId,
        fields: [
          'chapters',
          'categories',
          'totalDuration',
          'totalChapter',
          'totalLesson',
        ],
      });
      setContentData(res?.data?.results);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  useEffect(() => {
    getContentData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Bootcamps Content</Text>
      <Text style={styles.courseInfo}>
        {contentData?.totalChapter} chapters • {contentData?.totalLesson}{' '}
        lectures • {Math.floor(contentData?.totalDuration / 3600)}h total length
      </Text>
      <ContentTab courseId={courseId} categories={contentData?.categories} />
    </View>
  );
};

export default CourseContent;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      paddingVertical: 25,
      paddingHorizontal: 20,
      // backgroundColor: "green",
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
    },
    courseInfo: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'left',
      marginTop: 20,
    },
  });
