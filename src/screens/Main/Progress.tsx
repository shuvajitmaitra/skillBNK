import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import AnimatedProgressWheel from 'react-native-progress-wheel';

import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import Loading from '../../components/SharedComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
// import TechnicalTestProgress from '../../components/progress/TechnicalTestProgress';
import CalendarProgress from '../../components/progress/CalendarProgress';
import OtherActivitiesProgress from '../../components/progress/OtherActivitiesProgress';
import MessageProgress from '../../components/progress/MessageProgress';
import {setDashboardData} from '../../store/reducer/dashboardReducer';
import DayToDayProgress from '../../components/progress/DayToDayProgress';
import {TColors} from '../../types';
import {ProgramStackParamList} from '../../types/navigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {loadBootcampProgress} from '../../actions/apiCall2';
import {calculateOverallProgress} from '../../utility/commonFunction';
import {LoadMockInterviewInfo} from '../../actions/apiCall';

// Define an interface for each progress item.
interface ProgressItem {
  id: string;
  count: number;
  limit: number;
  [key: string]: any;
}

// Define an interface for the metrics data.
interface Metrics {
  totalObtainedMark: number;
  totalMark: number;
  overallPercentageAllItems: number;
  [key: string]: any;
}

// Define an interface for a course option.
// interface CourseOption {
//   label: string;
//   value: string;
// }

type ProgressScreenProps = NativeStackScreenProps<
  ProgramStackParamList,
  'Progress'
>;

const Progress: React.FC<ProgressScreenProps> = () => {
  // State for the progress items. Initially, no items (null) or an empty array.
  const [myprogress, setMyprogress] = useState<ProgressItem[] | null>(null);
  // State for metrics data.
  const [totalResults, setTotalResults] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the current user from the auth slice. (Type as any or replace with your own state type.)
  const {user} = useSelector((state: any) => state.auth);
  const {bootcamp} = useSelector((state: any) => state.dashboard);

  // Find specific progress items by id.
  const dayToday = myprogress?.find(
    (item: ProgressItem) => item.id === 'day2day',
  );
  const message = myprogress?.find(
    (item: ProgressItem) => item.id === 'messages',
  );
  const showNTell = myprogress?.find(
    (item: ProgressItem) => item.id === 'showAndTell',
  );
  console.log('showNTell', JSON.stringify(showNTell, null, 2));
  const myUploadedDocuments = myprogress?.find(
    item => item.id === 'uploadedDocuments',
  );
  // Courses state: an array of course options or null if not loaded.
  // const [courses, setCourses] = useState<CourseOption[] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Get additional dashboard data from Redux.
  const {mockInterview, community} = useSelector(
    (state: any) => state.dashboard.dashboardData,
  );
  // console.log('mockInterview', JSON.stringify(mockInterview, null, 2));
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Fetch the progress data.
  useEffect(() => {
    LoadMockInterviewInfo();
    setIsLoading(true);
    axiosInstance
      .get('/progress/myprogress')
      .then(res => {
        console.log('my Progress Data', JSON.stringify(res.data, null, 2));
        setTotalResults(res.data.metrics);
        setMyprogress(res.data.results || []);
        setIsLoading(false);
        // console.log("res.data", JSON.stringify(res.data, null, 1));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        // Alert.alert(err?.response?.data?.error);
      });
  }, []);

  // Fetch the courses (orders) data.
  useEffect(() => {
    axiosInstance
      .get('/order/myorder/course')
      .then(res => {
        if (res.data.orders?.length !== 0) {
          // const courseOptions: CourseOption[] = res.data.orders.map(
          //   (o: any) => ({
          //     label: o.course.title,
          //     value: o.course._id,
          //   }),
          // );
          // setCourses(courseOptions);
          setSelectedCourse(res.data.orders[0].course._id);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Fetch and update dashboard data whenever the selected course changes.
  useEffect(() => {
    setIsLoading(true);
    loadBootcampProgress();
    axiosInstance
      .post('/dashboard/portal', {
        familyMember: {},
        lastPasswordUpdate: {},
        review: {},
        template: {},
        community: {},
        mockInterview: {},
        message: {},
        dayToday: {timeFrame: 'week'},
        myDocument: {},
        documentLab: {},
        calendar: {},
        assignment: {},
        showTell: {},
        myNotes: {},
        course: {
          courseId: selectedCourse,
        },
      })
      .then(res => {
        console.log('dashboard Data', JSON.stringify(res.data, null, 2));
        if (res.data.success) {
          dispatch(setDashboardData(res.data.data));
          console.log('Data stored');
          setIsLoading(false);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        // Alert.alert(err?.response?.data?.error);
        console.log(
          'err.response.data.error',
          JSON.stringify(err.response.data.error, null, 2),
        );
      });
  }, [dispatch, selectedCourse]);

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView style={{backgroundColor: Colors.Background_color}}>
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Text style={styles.screenHeading}>Progress</Text>
          <View style={styles.ProfileContainer}>
            <View style={{maxWidth: responsiveScreenWidth(70)}}>
              <Text style={styles.profileName}>{user?.fullName}</Text>
              <Text style={styles.ProfileText}>
                {totalResults?.totalObtainedMark} out of{' '}
                {totalResults?.totalMark}
              </Text>
              <Text style={styles.ProfileText}>
                Overall Progress {calculateOverallProgress(bootcamp)}%
              </Text>
            </View>
            <View style={{height: 'auto', justifyContent: 'center'}}>
              <AnimatedProgressWheel
                size={responsiveScreenWidth(20)}
                width={responsiveScreenWidth(2.5)}
                color={Colors.Primary}
                progress={calculateOverallProgress(bootcamp) || 0}
                backgroundColor={Colors.PureWhite}
                rotation={'-90deg'}
                showProgressLabel={true}
                rounded={true}
                labelStyle={styles.profileProgressLabel}
                showPercentageSymbol={true}
              />
            </View>
          </View>
        </View>
        <DayToDayProgress
          progress={
            ((dayToday?.count || 0) / (dayToday?.limit || 0)) * 100 || 0
          }
          count={dayToday?.count || 0}
          limit={dayToday?.limit || 0}
        />
        {/* <TechnicalTestProgress /> */}
        {/* <DocumentsProgress
          myUploadedDocuments={myUploadedDocuments}
          docLabs={docLabs}
          showNTell={showNTell}
          reviews={reviews}
        /> */}

        <CalendarProgress />
        <OtherActivitiesProgress
          showNTell={showNTell}
          community={community}
          mockInterview={mockInterview || 0}
          myUploadedDocuments={myUploadedDocuments}
        />
        <MessageProgress message={message} />
      </View>
    </ScrollView>
  );
};

export default Progress;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    dayTwoDayAndReviewContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    screenHeading: {
      marginBottom: 10,
      textAlign: 'left',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.3),
      color: Colors.Heading,
    },
    ProfileText: {
      color: Colors.PureWhite,
      // marginTop:,
      fontFamily: CustomFonts.REGULAR,
    },
    profileProgressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.PureWhite,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2.5),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.PureWhite,
    },
    ProfileContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      // height: 'auto',
      padding: 10,
    },
    container: {
      flex: 1,
      flexDirection: 'row', // New property
      flexWrap: 'wrap', // New property
      alignItems: 'center',
      justifyContent: 'space-around', // Ensures even spacing
      paddingBottom: 10,
      paddingHorizontal: 10,
      // backgroundColor: Colors.Red,
      gap: 10,
    },
    prograssContainer: {
      width: responsiveScreenWidth(95),
      backgroundColor: Colors.Foreground,
      marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 20,
      zIndex: 1,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      width: '80%',
      color: Colors.Heading,
      textAlign: 'center',
    },
    progress: {
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.9),
      color: Colors.Primary,
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
      textAlign: 'center',
    },
    pieSectionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pieDetails: {
      width: responsiveScreenWidth(60),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    circle: {
      width: responsiveScreenWidth(4),
      height: responsiveScreenWidth(4),
      backgroundColor: Colors.Primary,
      borderRadius: 20,
    },
    pieSection: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
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
