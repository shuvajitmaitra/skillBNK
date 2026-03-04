// ContentList.tsx
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import axiosInstance from '../../../utility/axiosInstance';
import ProgramFiles from './ProgramFiles';
import Loading from '../../SharedComponent/Loading';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import SearchAndFilter from '../../SharedComponent/SearchAndFilter';
import {useTheme} from '../../../context/ThemeContext';
import ProgramPriority from './ProgramPriority';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import {TColors} from '../../../types';
import {
  TChapter,
  TLesson,
  TProgram,
} from '../../../types/program/programModuleType';
import {theme} from '../../../utility/commonFunction';

// Create a ModuleContext to share values with child components.
// For improved type safety, you can create an interface for the context value.
export const ModuleContext = React.createContext<any>(null);

interface ContentListProps {
  category: string;
  course: TProgram;
}

const ContentList: React.FC<ContentListProps> = ({category, course}) => {
  // Get theme colors from your custom hook (cast as TColors)
  const Colors = useTheme() as TColors;
  const styles = getStyles(Colors);

  // Local state definitions
  const [isPlayingLesson, setIsPlayingLesson] = useState<TLesson | null>(null);
  const [treeData, setTreeData] = useState<TLesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataLoad, setDataLoad] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<TLesson[]>([]);

  const itemList = [
    {label: 'All', value: 'all'},
    {label: 'Newly updated', value: 'newly updated'},
    {label: 'Focus', value: 'focused'},
    {label: 'Pinned', value: 'pinned'},
    {label: 'Completed', value: 'completed'},
    {label: 'Incomplete', value: 'incomplete'},
  ];

  // Fetch data from the API
  const handleFetchData = ({
    course,
    category,
    searchText,
    filterBy,
  }: {
    course: TProgram;
    category: string;
    searchText: string;
    filterBy: string;
  }) => {
    if (!course?.slug) {
      return;
    }
    setIsLoading(true);

    axiosInstance
      .post(`/course/chapterv2/get/${course.slug}/${category}`, {
        parent: null,
        queryText: searchText?.length > 2 ? searchText : null,
        filterBy,
      })
      .then(res => {
        // Map API response chapters into your lesson type.
        const initialChapters: TLesson[] = res.data?.chapters.map(
          (chapter: TChapter) => ({
            title: chapter?.lesson?.title || chapter.chapter?.name,
            key: chapter?._id,
            isLeaf: chapter?.isLocked ? true : chapter.type !== 'chapter',
            ...chapter,
          }),
        );
        setTreeData(initialChapters);
        setFilteredData(initialChapters);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // Filter lessons based on priority or other properties
  const handlePriorityChange = (priority: string) => {
    let filtered: TLesson[];
    if (priority === 'high') {
      filtered = treeData.filter((item: TLesson) => item.priority === 3);
    } else if (priority === 'medium') {
      filtered = treeData.filter((item: TLesson) => item.priority === 2);
    } else if (priority === 'low') {
      filtered = treeData.filter((item: TLesson) => item.priority === 0);
    } else if (priority === 'pinned') {
      filtered = treeData.filter((item: TLesson) => item.isPinned);
    } else if (priority === 'completed') {
      filtered = treeData.filter((item: TLesson) => item.isCompleted);
    } else if (priority === 'incomplete') {
      filtered = treeData.filter((item: TLesson) => !item.isCompleted);
    } else {
      filtered = treeData;
    }
    setFilteredData(filtered);
  };

  // Fetch data when the component mounts or when dependencies change
  useEffect(() => {
    handleFetchData({
      course,
      category,
      searchText,
      filterBy: filterValue,
    });
  }, [category, searchText, filterValue, course]);

  const handleSearch = () => {
    handleFetchData({
      course,
      category,
      searchText,
      filterBy: filterValue,
    });
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    handleFetchData({
      course,
      category,
      searchText,
      filterBy: value,
    });
  };

  // Update a specific chapter (root-level) when its properties change.
  const handleUpdateRootChapter = (chapterId: string, data: TLesson) => {
    const newTreeData = treeData.map(item => {
      if (item?._id === chapterId) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
    setTreeData(newTreeData);
    setFilteredData(newTreeData);
  };

  return (
    <ModuleContext.Provider
      value={{
        setIsPlayingLesson,
        isPlayingLesson,
        dataLoad,
        setDataLoad,
        handleUpdateRootChapter,
      }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.Background_color,
        }}>
        <StatusBar
          translucent={true}
          backgroundColor={Colors.Background_color}
          barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
        />
        <View style={styles.searchFilterContainer}>
          <SearchAndFilter
            handleSearch={handleSearch}
            handleFilter={handleFilter}
            setSearchText={setSearchText}
            filterValue={filterValue}
            itemList={itemList}
            searchText={searchText}
            setFilterValue={setFilterValue}
          />
          <ProgramPriority
            onPriorityChange={handlePriorityChange}
            category={category}
          />
        </View>
        <View style={styles.mainContainer}>
          {isLoading ? (
            <Loading backgroundColor={'transparent'} />
          ) : filteredData?.length > 0 ? (
            filteredData.map((item: TLesson) => (
              <ProgramFiles
                item={item}
                key={item._id}
                course={course}
                category={category}
                isChildren={false}
                // dataLoad={dataLoad}
                // setDataLoad={setDataLoad}
              />
            ))
          ) : (
            <NoDataAvailable />
          )}
        </View>
      </ScrollView>
    </ModuleContext.Provider>
  );
};

export default ContentList;

// --------------------
// Dynamic Styles
// --------------------
const getStyles = (Colors: TColors): {[key: string]: ViewStyle | TextStyle} =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(10),
      paddingHorizontal: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(50),
    },
    searchFilterContainer: {
      paddingTop: responsiveScreenHeight(1.5),
      marginHorizontal: responsiveScreenWidth(4),
      gap: 10,
    },
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.1),
      color: 'rgba(0, 0, 0, 0.80)',
    },
  });
