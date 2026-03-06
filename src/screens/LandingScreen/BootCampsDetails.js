import {StatusBar, StyleSheet, Text, View, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomFonts from '../../constants/CustomFonts';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import GlobeIcon from '../../assets/Icons/GlobeIcon';
import {Image} from 'react-native';
import Images from '../../constants/Images';
import EnrollmentCard from '../../components/LandingCom/EnrollmentCard';
import axiosInstance from '../../utility/axiosInstance';
import Loading from '../../components/SharedComponent/Loading';
import WhatLearns from '../../components/LandingCom/WhatLearns';
import CourseDescription from '../../components/LandingCom/CourseDescription';
import CourseRequirements from '../../components/LandingCom/CourseRequirements';
import CourseCertification from '../../components/LandingCom/CourseCertification';
import Benefits from '../../components/LandingCom/Benefits';
import CourseRoadmap from '../../components/LandingCom/CourseRoadmap';
import CourseContent from '../../components/LandingCom/CourseContent';
import AlumniCom from '../../components/LandingCom/AlumniCom';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FrequentlyAsked from '../../components/LandingCom/FrequentlyAsked';
import NextCareer from '../../components/LandingCom/NextCareer';
import SalaryRole from '../../components/LandingCom/SalaryRole';
import Recognition from '../../components/LandingCom/Recognition';
import ClassDeliveryBy from '../../components/LandingCom/ClassDeliveryBy';
// import PartnershipOfSchool from "../../components/LandingCom/PartnershipOfSchool";
// import DownloadApp from "../../components/LandingCom/DownloadApp";
// import FinanceOption from "../../components/LandingCom/FinanceOption";
import StudentsReviews from '../../components/LandingCom/StudentsReviews';
import {Rating} from '@kolking/react-native-rating';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setBootCampDetails} from '../../store/reducer/landingReducer';
import CourseCard from '../../components/LandingCom/CourseCard';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {theme} from '../../utility/commonFunction';

const BootCampsDetails = ({route}) => {
  const {courseId, slug, orgSlug} = route.params;
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const {bootCampDetails} = useSelector(state => state.landing);
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const course = bootCampDetails?.course;
  const certification = course?.obtainCertification || {};
  const requirements = course?.requirements || '';
  const description = course?.description || '';
  const alumniImages = course?.alumni?.images || [];
  const whatLearns = course?.whatLearns || [];
  const benefits = course?.benefits || [];
  const faqs = course?.faqs || [];
  const image = course?.image;

  const dateObject = new Date(course?.updatedAt);
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  const formattedDate = dateObject.toLocaleDateString('en-US', options);
  const roundDuration = Math.floor(bootCampDetails?.totalDuration / 3600);
  const starRating = parseFloat(
    bootCampDetails?.review?.averageStarCount?.toFixed(1),
  );
  const [othersItem, setOthersItem] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const getCourseData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/course/single/${slug}`);
      dispatch(setBootCampDetails(res?.data));
      console.log(
        'res.data.course.type',
        JSON.stringify(res.data.course.type, null, 1),
      );
      setType(res.data.course.type);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrograms = async option => {
    // setIsLoading(true);
    try {
      const res = await axiosInstance.post(
        `/course/organization/${orgSlug}`,
        option,
      );
      setOthersItem(res.data.programs.filter(item => item._id !== courseId));
      setTotalItems(res.data.count);
      if (res.data.programs.length <= res.data.count) {
        setPage(pre => pre + 1);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    getCourseData();
    getPrograms({currentPage: 1, limit: 10, type});
    return () => {
      setOthersItem([]);
      setTotalItems(0);
      setPage(1);
    };
  }, [courseId]);

  const handleBackButton = () => {
    navigation.goBack();
  };
  const sectionLayout = course?.layoutSections
    ?.filter(item => item.isVisible)
    .map(item => {
      switch (item.id) {
        case 'alumni':
          return <AlumniCom key={item.id} images={alumniImages} />;
        case 'whatYouLearn':
          return <WhatLearns key={item.id} whatLearnsData={whatLearns} />;
        case 'courseContent':
          return <CourseContent key={item.id} courseId={courseId} />;
        case 'requirements':
          return (
            <CourseRequirements key={item.id} requirements={requirements} />
          );
        case 'benefits':
          return <Benefits key={item.id} benefitsData={benefits} />;
        case 'certificate':
          return (
            <CourseCertification key={item.id} certification={certification} />
          );
        case 'roadmap':
          return <CourseRoadmap key={item.id} courseId={courseId} />;
        case 'faqs':
          return <FrequentlyAsked key={item.id} faqs={faqs} />;
        case 'reviews':
          return <StudentsReviews key={item.id} courseId={courseId} />;
        case 'opportunities':
          return <NextCareer key={item.id} />;
        case 'salary':
          return (
            <SalaryRole
              key={item.id}
              salary={bootCampDetails?.course?.salaryForThisRole}
            />
          );
        case 'instructurs':
          return <ClassDeliveryBy key={item.id} />;
        case 'recognition':
          return <Recognition key={item.id} />;
        default:
          return null;
      }
    });

  const limitedDescription =
    course?.shortDetail?.length > 100
      ? course?.shortDetail.slice(0, 100) + '...'
      : course?.shortDetail;

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading backgroundColor={'transparent'} />
      </View>
    );
  }

  const renderListFooter = () => {
    return (
      <View>
        <Text style={styles.bootCampsTitle}>
          {type === 'program' ? 'Bootcamps' : 'Online Course'} (
          <Text>{othersItem?.length || 0}</Text>)
        </Text>
        <FlatList
          data={othersItem}
          renderItem={({item}) => <CourseCard item={item} orgSlug={orgSlug} />}
          keyExtractor={item => item._id}
          onEndReached={() =>
            othersItem.length + 1 < totalItems &&
            getPrograms({currentPage: page, limit: 10, type})
          }
          ListFooterComponent={<View style={{marginBottom: 20}} />}
        />
      </View>
    );
  };

  console.log(
    'course?.instructor?.image',
    JSON.stringify(course?.instructor?.image, null, 2),
  );
  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        paddingTop: top,
        flex: 1,
      }}>
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={handleBackButton}
          style={styles.backNavigation}>
          <ArrowLeft />
          <Text style={styles.navigationText}>Back</Text>
        </TouchableOpacity>
      )}
      <FlatList
        ListHeaderComponent={
          <>
            <StatusBar
              translucent={true}
              backgroundColor={Colors.Background_color}
              barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
            />
            <View style={styles.headerContainer}>
              <Text style={styles.courseTitle}>{course?.title}</Text>
              <Text style={styles.subTitle}>{limitedDescription}</Text>
              <View style={styles.ratingContainer}>
                {starRating > 0 && (
                  <Text style={styles.ratingText}>{starRating}</Text>
                )}
                <Rating
                  variant="stars"
                  rating={starRating}
                  disabled={true}
                  size={16}
                  baseColor={Colors.BodyText}
                  fillColor={Colors.StarColor}
                />
                <Text style={styles.totalReviewsText}>
                  ({bootCampDetails?.review?.totalReviews})
                </Text>
                <Text style={styles.courseSubTitle}>
                  {' '}
                  {bootCampDetails?.studentCount} Students
                </Text>
              </View>
              <Text style={styles.courseSubTitle}>
                Total hours: {roundDuration}+h Video Lectures
              </Text>
              <View style={styles.updateAndLanguage}>
                <View style={styles.lastUpdateContainer}>
                  <CalendarIconSmall />
                  <Text style={styles.lastUpdateText}>
                    Last updated: {formattedDate}
                  </Text>
                </View>
                <View style={styles.lastUpdateContainer}>
                  <GlobeIcon />
                  <Text style={styles.languageText}>{course?.language}</Text>
                </View>
              </View>
              {course?.instructor?.name && (
                <View style={styles.instructorContainer}>
                  <Text style={styles.mentorText}>Mentor</Text>
                  <View style={styles.imageNameContainer}>
                    {course?.instructor?.image && (
                      <Image
                        style={styles.instructorImage}
                        source={{uri: course?.instructor?.image}}
                      />
                    )}
                    <Text style={styles.mentorNameText}>
                      {course?.instructor?.name}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.imageContainer}>
                <Image
                  source={
                    image && image !== ''
                      ? {uri: image}
                      : Images.DEFAULT_IMAGE || Images.DEFAULT_IMAGE
                  }
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </View>
            <EnrollmentCard enrollDetails={bootCampDetails} />
            <CourseDescription description={description} />
          </>
        }
        data={sectionLayout || []}
        renderItem={({item}) => item}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderListFooter}
      />
    </View>
  );
};

export default BootCampsDetails;

const getStyles = Colors =>
  StyleSheet.create({
    bootCampsTitle: {
      fontSize: responsiveScreenFontSize(3.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      paddingHorizontal: 20,
    },
    headerContainer: {
      paddingHorizontal: 20,
      paddingVertical: 25,
    },
    navigationText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(1.8),
      color: Colors.BodyText,
    },
    horizontalLine: {
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.LineColor,
      marginVertical: 20,
    },
    alumniContainer: {
      backgroundColor: Colors.PureWhite,
      marginHorizontal: -20,
    },
    alumniTitleText: {
      marginHorizontal: -20,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
    },
    descriptionText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(1.8),
    },
    instructorImage: {
      height: 100,
      width: 100,
      borderColor: Colors.Primary,
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 50,
    },
    mentorNameText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2.5),
      maxWidth: '60%',
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    imageNameContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    },
    mentorText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2.5),
    },
    instructorContainer: {
      flex: 1,
      // flexWrap: "wrap",
      flexDirection: 'column',
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    mentorNameAndImage: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },

    imageContainer: {
      borderRadius: 10,
      height: 210,
      width: '100%',
      overflow: 'hidden',
      backgroundColor: Colors.Primary,
      marginVertical: 30,
    },
    image: {
      borderRadius: 10,
      height: '100%',
      width: '100%',
    },
    languageText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(1.8),
      color: Colors.BodyText,
    },
    lastUpdateText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(1.8),
      color: Colors.BodyText,
    },
    updateAndLanguage: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 30,
      alignItems: 'center',
      marginTop: 10,
    },
    ratingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
      color: Colors.Heading,
    },
    lastUpdateContainer: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 10,
      marginBottom: 5,
    },
    totalReviewsText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(2),
    },
    courseSubTitle: {
      fontSize: responsiveFontSize(2),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      textAlign: 'center',
    },
    container: {
      paddingHorizontal: responsiveScreenWidth(4.5),
      backgroundColor: Colors.Background_color,
    },
    courseTitle: {
      fontSize: responsiveFontSize(3.5),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      textAlign: 'center',
    },
    subTitle: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.SEMI_BOLD,
      textAlign: 'center',
      fontSize: responsiveFontSize(2),
      marginHorizontal: 30,
      marginTop: 10,
    },
    backNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 20,
      paddingBottom: 10,
      gap: 10,
    },
  });
