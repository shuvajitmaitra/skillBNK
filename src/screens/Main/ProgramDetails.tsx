import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import Loading from '../../components/SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProgramStackParamList} from '../../types/navigation';
import {TCategories, TProgram} from '../../types/program/programModuleType';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import ProgramTabBar from '../../components/ProgramCom/ProgramTabBar';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCategories,
  clearSearchResults,
  setSelectedCategory,
  setCategories2,
} from '../../store/reducer/programReducer';
import {RootState} from '../../types/redux/root';
import OptimizedCourseTree from '../../components/ProgramCom/OptimizedCourseTree';
import LessonInfoModal from '../../components/ProgramCom/LessonInfoModal';
import ChapterAttachmentModal from '../../components/ProgramCom/ChapterAttachmentModal';
import ProgramQuizModal from '../../components/ProgramCom/ProgramQuizModal';
import ScormContent from '../../components/ProgramCom/ScormContent';

type ProgramDetailsProps = NativeStackScreenProps<
  ProgramStackParamList,
  'ProgramDetails'
>;

const ProgramDetails: React.FC<ProgramDetailsProps> = ({route}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<TProgram | null>(null);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  const {selectedLesson, isSearching, chapterData, selectedCategory, programs} =
    useSelector((state: RootState) => state.program);

  const routeSlug = route?.params?.slug;
  const routeName = route?.params?.routeName;

  const programSlug = useMemo(() => {
    return routeSlug ?? programs?.program?.slug ?? null;
  }, [routeSlug, programs?.program?.slug]);

  const getAllData = useCallback(async () => {
    if (!programSlug) return;

    try {
      setIsLoading(true);

      const response = await axiosInstance.get(
        `/course/contentv2/${programSlug}`,
      );
      const data = response?.data ?? {};

      setCourse(data?.course ?? null);

      const activeCategories: TCategories[] = (
        data?.category?.categories ?? []
      ).filter((item: TCategories) => item?.isActive === true);

      if (!routeName) {
        dispatch(setCategories(activeCategories));
      } else {
        dispatch(setCategories2(activeCategories));
      }

      if (routeName) {
        const found = activeCategories.find(
          (item: any) => item?.slug === routeName,
        );
        if (found) dispatch(setSelectedCategory(found));
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error program details', error);
    }
  }, [dispatch, programSlug, routeName]);

  useEffect(() => {
    getAllData();

    return () => {
      dispatch(clearSearchResults());
    };
  }, [getAllData, dispatch]);

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading backgroundColor="transparent" />
      </View>
    );
  }

  const isScorm = course?.deliveryType === 'scorm';

  const selectedId = selectedCategory?._id;
  const selectedChapters = selectedId ? chapterData?.[selectedId] ?? [] : [];
  console.log('selectedChapters', JSON.stringify(selectedChapters, null, 2));

  const scormFirst = selectedChapters?.length > 0 ? selectedChapters[0] : null;

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      {selectedLesson?.quizModalVisible ? <ProgramQuizModal /> : null}

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
            dispatch(clearSearchResults());
            navigation.goBack();
          }}>
          <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.programNameText}>
          {isSearching
            ? `${course?.title ?? ''} - Search`
            : course?.title ?? ''}
        </Text>
      </View>

      <ProgramTabBar />

      {/* ✅ Always safe rendering */}
      {isScorm ? (
        scormFirst ? (
          <ScormContent scormContent={scormFirst} />
        ) : (
          <View style={{padding: 16}}>
            <Text style={{color: Colors.BodyText}}>
              SCORM content not available for this category.
            </Text>
          </View>
        )
      ) : (
        <OptimizedCourseTree data={selectedChapters} />
      )}

      <LessonInfoModal />
      <ChapterAttachmentModal />
    </View>
  );
};

export default ProgramDetails;

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
