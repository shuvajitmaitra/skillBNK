import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {borderRadius, fontSizes, gGap, gWidth} from '../../../constants/Sizes';
import {TColors} from '../../../types';
import {FeatherIcon, OcticonsIcon} from '../../../constants/Icons';
import {TCategories} from '../../../types/program/programModuleType';
import {showToast} from '../../HelperFunction';
import axiosInstance from '../../../utility/axiosInstance';
import {useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import {useTheme} from '../../../context/ThemeContext';
import LoadingSmall from '../../SharedComponent/LoadingSmall';

type PurposeModalProps = {
  isVisible: boolean;
  onPress: (arg: string) => void;
  onCancel: () => void;
};
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
const PurposeModal = ({isVisible, onPress, onCancel}: PurposeModalProps) => {
  const {programs} = useSelector((s: RootState) => s.program);
  const [category, setCategory] = useState<TCategories[] | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TCategories | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [treeData, setTreeData] = useState<{[key: string]: ChapterItem[]}>({});
  const [expandedData, setExpandedData] = useState<{[key: string]: boolean}>(
    {},
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const loadProgramModule = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramModule();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProgramChapter = async (categoryId: string, parent?: string) => {
    try {
      const response = await axiosInstance.get(
        `/course/chapterv2/mychapters/${programs.program.slug}/${categoryId}`,
      );
      if (parent) {
        setTreeData(prev => ({
          ...prev,
          [parent]: response?.data?.chapters || [],
        }));
      } else {
        setChapters(response.data.chapters);
      }
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

  const renderChapter = ({item}: {item: ChapterItem}) => {
    const isExpanded = expandedData[item._id];
    const chapterName =
      item.chapter?.name ||
      item.lesson?.title ||
      selectedResource?.category ||
      'Unnamed Chapter';

    return (
      <>
        <Pressable
          onPress={() => {
            setSelectedResource({
              name: chapterName,
              category: item.type,
              resourceId: item._id,
            });
            // setState({category: item.type, resourceId: item._id});
          }}
          style={styles.chapterItem}>
          <View style={styles.chapterContent}>
            {item.type === 'chapter' ? (
              <FeatherIcon name="folder" size={20} color={Colors.BodyText} />
            ) : (
              <OcticonsIcon name="video" size={20} color={Colors.BodyText} />
            )}
            <Text numberOfLines={1} style={styles.chapterText}>
              {chapterName}
            </Text>
          </View>
          {item.type === 'chapter' && (
            <FeatherIcon
              onPress={() => {
                const newExpanded = !isExpanded;
                setExpandedData(prev => ({...prev, [item._id]: newExpanded}));

                if (newExpanded && !treeData[item._id]) {
                  loadProgramChapter(item.myCourse.category, item._id);
                }
              }}
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size={25}
              color={Colors.Heading}
            />
          )}
        </Pressable>
        {isExpanded && (
          <View style={styles.nestedContainer}>
            {treeData[item._id]?.length > 0 ? (
              treeData[item._id].map((chapter, index) => (
                <View key={index}>{renderChapter({item: chapter})}</View>
              ))
            ) : (
              <Text style={styles.emptyText}>No chapters available</Text>
            )}
          </View>
        )}
      </>
    );
  };
  return (
    <ReactNativeModal isVisible={isVisible} onBackdropPress={onCancel}>
      <View>
        {loading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: gGap(500),
              backgroundColor: Colors.Foreground,
              borderRadius: borderRadius.default,
            }}>
            <Text
              style={{
                marginVertical: gGap(20),
                fontSize: fontSizes.heading,
                color: Colors.BodyText,
                fontWeight: '600',
              }}>
              Loading modules...
            </Text>
            <LoadingSmall />
          </View>
        ) : (
          <View
            style={{
              //   alignItems: 'center',
              //   justifyContent: 'center',
              //   height: responsiveScreenHeight(80),
              backgroundColor: Colors.Foreground,
              borderRadius: borderRadius.default,
              //   gap: gGap(10),
              padding: gGap(10),
            }}>
            <View style={styles.triggerButton}>
              <TextInput placeholder="Search chapter or lesson..." />
              <FeatherIcon
                name={'search'}
                size={25}
                color={Colors.Heading}
                style={{position: 'absolute', right: gGap(10)}}
              />
            </View>

            {
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
                  {chapters?.map((chapter, index) => (
                    <View key={index}>{renderChapter({item: chapter})}</View>
                  ))}
                </ScrollView>
              </View>
            }
          </View>
        )}
      </View>
    </ReactNativeModal>
  );
};

export default PurposeModal;

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
      paddingHorizontal: gGap(10),
      justifyContent: 'center',
      borderRadius: borderRadius.default,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      width: '100%',
      height: gGap(40),
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
      paddingBottom: gGap(10),
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
      maxHeight: 500,
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
