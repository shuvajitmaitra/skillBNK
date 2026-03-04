import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import axiosInstance from '../../utility/axiosInstance';
import {RootState} from '../../types/redux/root';
import {useSelector} from 'react-redux';
import {TCategories} from '../../types/program/programModuleType';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {borderRadius, fontSizes, gGap, gWidth} from '../../constants/Sizes';
import {FeatherIcon, OcticonsIcon} from '../../constants/Icons';
import {showToast} from '../HelperFunction';
import OptimizedCourseTree from '../ProgramCom/OptimizedCourseTree';
import EventPurposeTree from './EventPurposeTree';

interface ChapterItem {
  _id: string;
  type: 'chapter' | 'lesson';
  priority: number;
  chapter?: {
    _id: string;
    name: string;
    description: string;
    isFree: boolean;
  };
  lesson?: {
    _id: string;
    title: string;
    type: string;
    isFree: boolean;
    url: string;
  };
  myCourse: {
    category: string;
    parent: string;
  };
  isCompleted: boolean;
  isLocked: boolean;
}

interface SelectedResource {
  name?: string;
  category?: string;
  resourceId?: string;
}

const EventPurposeV2 = ({
  setState,
  state,
}: {
  state: {
    category?: string;
    resourceId?: string;
    name?: string;
  };
  setState: (item: {category?: string; resourceId?: string}) => void;
}) => {
  const {programs} = useSelector((s: RootState) => s.program);
  const [category, setCategory] = useState<TCategories[] | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TCategories | null>(
    null,
  );
  const [moduleVisible, setModuleVisible] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<SelectedResource | null>(null);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const loadProgramModule = async () => {
    try {
      const response = await axiosInstance.get(
        `/course/contentv2/${programs.program.slug}`,
      );
      if (response.data.success) {
        const c = response.data.category.categories.filter(
          (item: TCategories) => item.isActive,
        );
        setSelectedCategory(c?.[0]);
        await loadProgramChapter(c?.[0]._id);
        setCategory(c);
      }
    } catch (error: any) {
      console.error(
        'Error to load program module:',
        JSON.stringify(error.response.data.error, null, 2),
      );
      showToast({
        message: error.response.data.error || 'Program module cannot be load',
      });
    }
  };

  const loadProgramChapter = async (categoryId: string) => {
    try {
      const response = await axiosInstance.get(
        `/course/chapterv2/mychapters/${programs.program.slug}/${categoryId}`,
      );
      setChapters(response.data.chapters);
    } catch (error: any) {
      console.log('Error fetching course progress:', error.response?.data);
      showToast({message: error.response?.data?.error || 'An error occurred'});
    }
  };

  const renderCategory = ({item}: {item: TCategories}) => {
    const isSelected = selectedCategory?.name === item.name;
    return (
      <Pressable
        onPress={() => {
          setSelectedCategory(item);
          loadProgramChapter(item._id);
        }}
        style={[styles.categoryButton, isSelected && styles.selectedCategory]}>
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <Text style={styles.labelText}>Purpose</Text>
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => {
          setModuleVisible(!moduleVisible);
          !moduleVisible && loadProgramModule();
          !moduleVisible && setSelectedResource(state);
        }}>
        <Text numberOfLines={1} style={styles.triggerText}>
          {state?.name
            ? state?.name
            : selectedResource?.name
            ? selectedResource?.name
            : 'Select purpose'}
        </Text>
        <FeatherIcon
          onPress={() => {
            setModuleVisible(!moduleVisible);
            !moduleVisible && loadProgramModule();
            !moduleVisible && setSelectedResource(state);
          }}
          name={moduleVisible ? 'chevron-down' : 'chevron-right'}
          size={25}
          color={Colors.Heading}
          style={{position: 'absolute', right: gGap(10)}}
        />
      </TouchableOpacity>

      {moduleVisible && (
        <View style={styles.moduleContainer}>
          <FlatList
            horizontal
            data={category || []}
            renderItem={renderCategory}
            contentContainerStyle={styles.categoryList}
            showsHorizontalScrollIndicator={false}
          />

          <ScrollView
            nestedScrollEnabled
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}>
            <EventPurposeTree
              data={chapters || []}
              onPress={(item: any) => {
                console.log('item', JSON.stringify(item, null, 2));
                setSelectedResource(item);
                setState({
                  category: item.category,
                  resourceId: item.resourceId,
                });
              }}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    labelText: {
      color: Colors.Heading,
      fontSize: fontSizes.body,
      fontWeight: '600',
      marginBottom: gGap(5),
    },
    triggerButton: {
      backgroundColor: Colors.Background_color,
      height: gGap(40),
      paddingHorizontal: gGap(10),
      justifyContent: 'center',
      borderRadius: borderRadius.default,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    triggerText: {
      color: Colors.BodyText,
      width: gWidth(260),
    },
    moduleContainer: {
      backgroundColor: Colors.Background_color,
      paddingTop: gGap(5),
      paddingHorizontal: gGap(5),
      borderRadius: borderRadius.small,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      marginHorizontal: gGap(2),
    },
    categoryList: {
      gap: gGap(10),
      paddingTop: gGap(5),
    },
    categoryButton: {
      paddingHorizontal: gGap(8),
      paddingVertical: gGap(5),
      borderRadius: borderRadius.small,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
    },
    selectedCategory: {
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
    },
    categoryText: {
      color: Colors.SecondaryButtonTextColor,
      fontSize: fontSizes.body,
      fontWeight: '500',
    },
    selectedCategoryText: {
      color: Colors.PrimaryButtonTextColor,
    },
    scrollView: {
      maxHeight: 300,
    },
    scrollContent: {
      // paddingTop: gGap(5),
    },
    chapterItem: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingHorizontal: gGap(5),
      paddingVertical: gGap(2),
      borderRadius: borderRadius.small,
      marginBottom: gGap(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: gGap(10),
    },
    chapterContent: {
      flexDirection: 'row',
      gap: gGap(10),
      alignItems: 'center',
      paddingVertical: gGap(5),
    },
    chapterText: {
      color: Colors.SecondaryButtonTextColor,
      width: gWidth(220),
      fontSize: fontSizes.small,
      fontWeight: '400',
    },
    nestedContainer: {
      paddingBottom: gGap(5),
      paddingLeft: gGap(10),
    },
    emptyText: {
      color: Colors.BodyText,
      // paddingLeft: gGap(5),
      textAlign: 'center',
    },
  });

export default EventPurposeV2;
