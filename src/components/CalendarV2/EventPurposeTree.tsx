import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

import CustomFonts from '../../constants/CustomFonts';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';

import {useTheme} from '../../context/ThemeContext';

import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

import PurposeTreeNode from './PurposeTreeNode';

/* ============================================================================
 * Types
 * ========================================================================== */

interface Chapter {
  isFree: boolean;
  _id: string;
  name: string;
  description?: string | null;
  subTitle?: string | null;
  subDescription?: string | null;
  image?: string;
  updatedAt?: string;
}

interface Lesson {
  type: 'video' | 'slide' | string;
  isFree: boolean;
  duration: number;
  _id: string;
  title: string;
  url: string;
  updatedAt?: string;
}

interface MyCourse {
  isOwner: boolean;
  isPublished: boolean;
  groups: any[];
  sessions: any[];
  isPreview: boolean;
  _id?: string;
  course: string;
  parent: string;
  prev: string;
  category: string;
}

interface CourseItem {
  type: 'chapter' | 'lesson';
  priority: number;
  _id: string;
  chapter?: Chapter;
  lesson?: Lesson;
  category: string;
  index?: number;
  updatedAt: string;
  attachments: any[];
  myCourse: MyCourse;
  isPinned: boolean;
  isCompleted: boolean;
  isFocused: boolean;
  isLocked: boolean;
  isSpecial: boolean;
  isFree?: boolean;
}

interface TreeItem extends CourseItem {
  children: TreeItem[];
  level?: number;
  hasChildren?: boolean;
}

interface EventPurposeTreeProps {
  data: CourseItem[];
  onPress: (item: any) => void;
}

/* ============================================================================
 * Component
 * ========================================================================== */

const EventPurposeTree: React.FC<EventPurposeTreeProps> = ({data, onPress}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {preFilterItem} = useSelector((state: RootState) => state.program);

  // UI state
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string[]>(['all']);

  // Data state
  const [courseData, setCourseData] = useState<CourseItem[]>(data);
  const [flattenedTree, setFlattenedTree] = useState<TreeItem[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  /* ----------------------------------
   * Effects
   * ---------------------------------- */

  useEffect(() => {
    if (preFilterItem) setFilterType([preFilterItem]);
  }, [preFilterItem]);

  useEffect(() => {
    setCourseData(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
      return prev;
    });
  }, [data]);

  /* ----------------------------------
   * Memo
   * ---------------------------------- */

  // Used to validate parent chain (ancestors)
  const fullItemMap = useMemo(() => {
    const map: Record<string, TreeItem> = {};
    data?.forEach(item => {
      map[item._id] = {...item, children: []};
    });
    return map;
  }, [data]);

  /* ----------------------------------
   * Tree utilities
   * ---------------------------------- */

  const getAncestors = useCallback(
    (
      itemMap: Record<string, TreeItem>,
      id: string,
      ancestors = new Set<string>(),
    ) => {
      const node = itemMap[id];
      if (!node || !node.myCourse.parent || node.myCourse.parent === '')
        return ancestors;
      if (!fullItemMap[node.myCourse.parent]) return ancestors;

      ancestors.add(node.myCourse.parent);
      return getAncestors(itemMap, node.myCourse.parent, ancestors);
    },
    [fullItemMap],
  );

  const buildTreeFromFlatData = useCallback(
    (flatData: CourseItem[]): TreeItem[] => {
      const itemMap: Record<string, TreeItem> = {};
      const parentMap: Record<string, TreeItem[]> = {};
      const rootItems: TreeItem[] = [];

      flatData.forEach(item => {
        const treeItem: TreeItem = {...item, children: []};
        itemMap[item._id] = treeItem;

        const parent = item.myCourse?.parent || '';
        if (!parent || parent === '') {
          rootItems.push(treeItem);
        } else if (flatData.some(d => d._id === parent)) {
          if (!parentMap[parent]) parentMap[parent] = [];
          parentMap[parent].push(treeItem);
        }
      });

      Object.keys(parentMap).forEach(parentId => {
        if (itemMap[parentId]) itemMap[parentId].children = parentMap[parentId];
      });

      rootItems.sort((a, b) => {
        const aHasParent = a.myCourse.parent && a.myCourse.parent !== '';
        const bHasParent = b.myCourse.parent && b.myCourse.parent !== '';
        if (!aHasParent && bHasParent) return -1;
        if (aHasParent && !bHasParent) return 1;
        return 0;
      });

      return rootItems;
    },
    [],
  );

  const flattenTree = useCallback(
    (
      tree: TreeItem[],
      expandedNodesMap: Record<string, boolean>,
      level = 0,
      result: TreeItem[] = [],
    ): TreeItem[] => {
      if (!tree?.length) return result;

      tree.forEach(node => {
        result.push({
          ...node,
          level,
          hasChildren: !!node.children?.length,
        });

        if (node.children?.length && expandedNodesMap[node._id]) {
          flattenTree(node.children, expandedNodesMap, level + 1, result);
        }
      });

      return result;
    },
    [],
  );

  /* ----------------------------------
   * Build + flatten on changes
   * ---------------------------------- */

  useEffect(() => {
    if (!courseData?.length) {
      setFlattenedTree([]);
      setLoading(false);
      return;
    }

    try {
      const nestedTree = buildTreeFromFlatData(courseData);
      const flattened = flattenTree(nestedTree, expandedNodes);

      setFlattenedTree(prev => {
        const nextStr = JSON.stringify(flattened);
        const prevStr = JSON.stringify(prev);
        return nextStr !== prevStr ? flattened : prev;
      });

      if (
        nestedTree.length <= 10 &&
        filterType.includes('all') &&
        Object.keys(expandedNodes).length === 0
      ) {
        const initialExpanded: Record<string, boolean> = {};
        nestedTree.forEach(item => (initialExpanded[item._id] = true));
        setExpandedNodes(initialExpanded);
      }
    } catch (error) {
      console.error('Error processing course data:', error);
    } finally {
      setLoading(false);
    }
  }, [
    buildTreeFromFlatData,
    courseData,
    expandedNodes,
    filterType,
    flattenTree,
  ]);

  /* ----------------------------------
   * Actions
   * ---------------------------------- */

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => ({...prev, [nodeId]: !prev[nodeId]}));
  }, []);

  const handleLessonPress = useCallback((lesson: TreeItem) => {
    lesson &&
      onPress({
        name: lesson.lesson?.title || lesson.chapter?.name,
        category: lesson.type,
        resourcesId: lesson._id,
      });
  }, []);

  /* ----------------------------------
   * FlatList helpers
   * ---------------------------------- */

  const renderItem = useCallback(
    ({item}: {item: TreeItem}) => (
      <PurposeTreeNode
        item={item}
        level={item.level || 0}
        isExpanded={expandedNodes[item._id] || false}
        onToggle={toggleNode}
        onLessonPress={handleLessonPress}
      />
    ),
    [expandedNodes, handleLessonPress, toggleNode],
  );

  const keyExtractor = useCallback((item: TreeItem) => item._id, []);

  const getItemLayout = useCallback((_data: any, index: number) => {
    const rowHeight = 60;
    return {length: rowHeight, offset: rowHeight * index, index};
  }, []);

  /* ----------------------------------
   * Render
   * ---------------------------------- */

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading course content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tree List */}
      <FlatList
        data={flattenedTree}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        maxToRenderPerBatch={20}
        windowSize={10}
        initialNumToRender={20}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No nodes match the current filter.
          </Text>
        }
      />
    </View>
  );
};

/* ============================================================================
 * Styles
 * ========================================================================== */

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    searchContainer: {
      flex: 1,
    },
    searchInput: {
      width: '100%',
      height: 40,
      fontSize: 16,
      paddingHorizontal: 8,
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    filterButton: {
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
      borderRadius: borderRadius.small,
      borderWidth: 1,
      borderColor: Colors.Background_color,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: gGap(10),
      justifyContent: 'space-between',
      position: 'relative',
    },
    filterButtonText: {
      fontSize: 16,
      color: Colors.SecondaryButtonTextColor,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      position: 'absolute',
      top: gGap(-10),
      right: gGap(-10),
      paddingHorizontal: gGap(5),
      borderRadius: borderRadius.circle,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: Colors.Background_color,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      maxHeight: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.BodyText,
      textAlign: 'center',
      marginBottom: 12,
    },
    modalItem: {
      paddingVertical: 12,
    },
    modalItemText: {
      fontSize: fontSizes.subHeading,
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    modalCloseButton: {
      marginTop: 12,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
      borderRadius: borderRadius.small,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    modalCloseButtonText: {
      fontSize: fontSizes.body,
      color: Colors.PrimaryButtonTextColor,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: Colors.BodyText,
    },
    nodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
    },
    nodeInnerContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(5),
    },
    nodeIconContainer: {
      paddingHorizontal: gGap(5),
      alignItems: 'center',
    },
    nodeContent: {
      flex: 1,
    },
    nodeTitle: {
      fontSize: 14,
      fontWeight: '500',
    },
    chapterTitle: {
      color: Colors.Heading,
      fontWeight: 'bold',
    },
    lessonTitle: {
      color: Colors.Heading,
    },
    playingLesson: {
      color: Colors.Primary,
      fontWeight: 'bold',
    },
    nodeDescription: {
      fontSize: 12,
      color: Colors.BodyText,
      marginTop: 2,
    },
    statusIcon: {},
    moreButton: {},
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
    filterItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
    },
  });

export default EventPurposeTree;
