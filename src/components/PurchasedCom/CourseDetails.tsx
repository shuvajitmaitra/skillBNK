// CourseDetails.tsx
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import Loading from '../../components/SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TCategories, TProgram} from '../../types/program/programModuleType';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import ProgramTabBar from '../../components/ProgramCom/ProgramTabBar';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCategories,
  clearSearchResults,
} from '../../store/reducer/programReducer';
import {RootState} from '../../types/redux/root';
import OptimizedCourseTree from '../../components/ProgramCom/OptimizedCourseTree';
import LessonInfoModal from '../../components/ProgramCom/LessonInfoModal';
import ChapterAttachmentModal from '../../components/ProgramCom/ChapterAttachmentModal';
import ProgramQuizModal from '../../components/ProgramCom/ProgramQuizModal';
import {HomeStackParamList} from '../../types/navigation';

type CourseDetailsProps = NativeStackScreenProps<
  HomeStackParamList,
  'CourseDetails'
>;

const CourseDetails: React.FC<CourseDetailsProps> = ({route}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<TProgram | null>(null);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const {selectedLesson, isSearching, chapterData, selectedCategory} =
    useSelector((state: RootState) => state.program);
  // console.log('chapterData', JSON.stringify(chapterData, null, 2));
  const getAllData = async (slug: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/course/contentv2/${slug}`);
      const allCourses = response.data;
      setCourse(allCourses?.course);
      dispatch(
        setCategories(
          allCourses?.category?.categories.filter(
            (item: TCategories) => item.isActive === true,
          ),
        ),
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error program details', error);
    }
  };

  useEffect(() => {
    if (route?.params?.slug) {
      getAllData(route.params.slug);
    }

    // Clear search results when component unmounts
    return () => {
      dispatch(clearSearchResults());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading backgroundColor="transparent" />
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      {selectedLesson?.quizModalVisible && <ProgramQuizModal />}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 15,
          gap: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => {
            // Clear search when navigating back
            dispatch(clearSearchResults());
            navigation.goBack();
          }}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text style={styles.programNameText}>
          {isSearching ? `${course?.title} - Search` : course?.title}
        </Text>
      </View>
      <ProgramTabBar />
      {chapterData && (
        <OptimizedCourseTree
          data={selectedCategory?._id && chapterData[selectedCategory?._id]}
        />
      )}
      <LessonInfoModal />
      <ChapterAttachmentModal />
    </View>
  );
};

export default CourseDetails;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    backButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: Colors.Foreground,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    container: {
      flex: 1,
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
    },
    programNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 20,
      color: Colors.Heading,
      flex: 0.95,
    },
  });
