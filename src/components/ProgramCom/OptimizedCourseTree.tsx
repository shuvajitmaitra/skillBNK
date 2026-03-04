import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

import {IoniconsIcon} from '../../constants/Icons';
import CustomFonts from '../../constants/CustomFonts';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';

import {useTheme} from '../../context/ThemeContext';
import {programService} from '../../services/programService';

import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

import Divider from '../SharedComponent/Divider';
import TreeNode from './TreeNode';

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

interface OptimizedCourseTreeProps {
  data: CourseItem[];
}

/* ============================================================================
 * Helpers / constants
 * ========================================================================== */

const FILTER_OPTIONS = [
  {label: 'All', value: 'all'},
  {label: 'Pinned', value: 'pinned'},
  {label: 'Focused', value: 'focused'},
  {label: 'Completed', value: 'completed'},
  {label: 'Incomplete', value: 'incomplete'},
  {label: 'Free Content', value: 'isFree'},
  {label: 'Locked Content', value: 'isLocked'},
  {label: 'Special', value: 'isSpecial'},
  {label: 'High Priority', value: 'isHigh'},
  {label: 'Medium Priority', value: 'isMedium'},
  {label: 'Low Priority', value: 'isLow'},
] as const;

const getDisplayName = (item: TreeItem) =>
  item.type === 'chapter'
    ? item.chapter?.name || 'Untitled Chapter'
    : item.lesson?.title || 'Untitled Lesson';

const ItemSeparator = () => <Divider />;

/* ============================================================================
 * ActionModal
 * ========================================================================== */

const ActionModal: React.FC<{
  visible: boolean;
  item: TreeItem | null;
  colors: TColors;
  onClose: () => void;
  onTogglePin: (id: string) => void;
  onToggleFocus: (id: string) => void;
  onToggleComplete: (id: string) => void;
}> = ({
  visible,
  item,
  colors,
  onClose,
  onTogglePin,
  onToggleFocus,
  onToggleComplete,
}) => {
  const styles = getStyles(colors);
  if (!item) return null;

  const displayName = getDisplayName(item);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actions for {displayName}</Text>

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              onTogglePin(item._id);
              onClose();
            }}>
            <Text style={styles.modalItemText}>
              {item.isPinned ? 'Unpin' : 'Pin'}
            </Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              onToggleFocus(item._id);
              onClose();
            }}>
            <Text style={styles.modalItemText}>
              {item.isFocused ? 'Unfocus' : 'Focus'}
            </Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              onToggleComplete(item._id);
              onClose();
            }}>
            <Text style={styles.modalItemText}>
              {item.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            accessibilityLabel="Close actions modal">
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

/* ============================================================================
 * Component
 * ========================================================================== */

const OptimizedCourseTree: React.FC<OptimizedCourseTreeProps> = ({data}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {preFilterItem, programs} = useSelector(
    (state: RootState) => state.program,
  );

  // UI state
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string[]>(['all']);
  const [modalVisible, setModalVisible] = useState(false);

  // Data state
  const [courseData, setCourseData] = useState<CourseItem[]>(data);
  const [flattenedTree, setFlattenedTree] = useState<TreeItem[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  // Action modal state
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);

  // Playback state
  const [playingLessonId, setPlayingLessonId] = useState<string | null>(null);

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

  const filterData = useCallback(
    (flatData: CourseItem[]): CourseItem[] => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchingIds = new Set<string>();

      const itemMap: Record<string, TreeItem> = {};
      flatData.forEach(item => {
        itemMap[item._id] = {...item, children: []};
      });

      flatData.forEach(item => {
        const name =
          item.type === 'chapter' ? item.chapter?.name : item.lesson?.title;

        const matchesSearch =
          searchQuery && name ? name.toLowerCase().includes(lowerQuery) : true;

        const matchesFilter = filterType.every(type => {
          if (type === 'all') return true;
          console.log('item', JSON.stringify(item, null, 2));
          switch (type) {
            case 'pinned':
              return item.isPinned;
            case 'unpinned':
              return !item.isPinned;
            case 'focused':
              return item.isFocused;
            case 'unfocused':
              return !item.isFocused;
            case 'isFree':
              return item.isFree;
            case 'completed':
              return item.isCompleted;
            case 'incomplete':
              return !item.isCompleted;
            case 'isLocked':
              return item.isLocked;
            case 'isSpecial':
              return item.isSpecial;
            case 'isLow':
              return item.priority === 1;
            case 'isMedium':
              return item.priority === 2;
            case 'isHigh':
              return item.priority > 2;
            default:
              return true;
          }
        });

        if (matchesSearch && matchesFilter) {
          matchingIds.add(item._id);
          getAncestors(itemMap, item._id).forEach(aid => matchingIds.add(aid));
        }
      });

      return flatData.filter(item => matchingIds.has(item._id));
    },
    [filterType, getAncestors, searchQuery],
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
      const filteredData = filterData(courseData);
      const nestedTree = buildTreeFromFlatData(filteredData);
      const flattened = flattenTree(nestedTree, expandedNodes);

      setFlattenedTree(prev => {
        const nextStr = JSON.stringify(flattened);
        const prevStr = JSON.stringify(prev);
        return nextStr !== prevStr ? flattened : prev;
      });

      if (
        nestedTree.length <= 10 &&
        !searchQuery &&
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
    filterData,
    filterType,
    flattenTree,
    searchQuery,
  ]);

  /* ----------------------------------
   * Actions
   * ---------------------------------- */

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => ({...prev, [nodeId]: !prev[nodeId]}));
  }, []);

  const handleMorePress = useCallback((item: TreeItem) => {
    setSelectedItem(item);
    setActionModalVisible(true);
  }, []);

  const handleViewLesson = useCallback(
    async (item: TreeItem) => {
      try {
        await programService.handleProgramItemAction(
          item.myCourse.course,
          'focus',
          item._id,
        );
        await programService.loadProgramModules(
          programs.program.slug,
          item.myCourse.category || item.category,
        );
      } catch (error: any) {
        console.log(
          'error.response.data.error',
          JSON.stringify(error?.response?.data?.error, null, 2),
        );
      }
    },
    [programs.program.slug],
  );

  const handleLessonPress = useCallback(
    (lesson: TreeItem) => {
      if (lesson.type === 'lesson' && lesson.lesson?.url) {
        setPlayingLessonId(prevId =>
          prevId === lesson._id ? null : lesson._id,
        );
        handleViewLesson(lesson);
      }
    },
    [handleViewLesson],
  );

  const togglePin = useCallback((id: string) => {
    setCourseData(prev =>
      prev.map(item => {
        if (item._id !== id) return item;

        const updated = {...item, isPinned: !item.isPinned};
        programService.handleProgramItemAction(
          updated.myCourse.course,
          updated.isPinned ? 'pin' : 'unpin',
          updated._id,
        );
        return updated;
      }),
    );
  }, []);

  const toggleFocus = useCallback((id: string) => {
    setCourseData(prev =>
      prev.map(item => {
        if (item._id !== id) return item;

        const updated = {...item, isFocused: !item.isFocused};
        programService.handleProgramItemAction(
          updated.myCourse.course,
          updated.isFocused ? 'focus' : 'unfocus',
          updated._id,
        );
        return updated;
      }),
    );
  }, []);

  const toggleComplete = useCallback(
    (id: string) => {
      setCourseData(prev =>
        prev.map(item => {
          if (item._id !== id) return item;

          const updated = {...item, isCompleted: !item.isCompleted};
          programService.handleProgramItemAction(
            updated.myCourse.course,
            updated.isCompleted ? 'incomplete' : 'complete',
            updated._id,
          );
          programService.loadProgramModules(
            programs.program.slug,
            item.category,
          );
          return updated;
        }),
      );
    },
    [programs.program.slug],
  );

  const handleVideoComplete = useCallback(
    async (i: TreeItem) => {
      try {
        await programService.handleProgramItemAction(
          i.myCourse.course,
          'complete',
          i._id,
        );
        await programService.loadProgramModules(
          programs.program.slug,
          i.category,
        );
      } catch (error: any) {
        console.log(
          'error.response.data.error',
          JSON.stringify(error?.response?.data?.error, null, 2),
        );
      }
    },
    [programs.program.slug],
  );

  const toggleFilterType = useCallback((value: string) => {
    setFilterType(prev => {
      if (value === 'all') return ['all'];
      if (prev.includes('all')) return [value];

      if (prev.includes(value)) {
        const next = prev.filter(v => v !== value);
        return next.length ? next : ['all'];
      }

      return [...prev, value];
    });
  }, []);

  /* ----------------------------------
   * FlatList helpers
   * ---------------------------------- */

  const renderItem = useCallback(
    ({item}: {item: TreeItem}) => (
      <TreeNode
        item={item}
        level={item.level || 0}
        isExpanded={expandedNodes[item._id] || false}
        onToggle={toggleNode}
        onLessonPress={handleLessonPress}
        onMorePress={handleMorePress}
        isPlaying={playingLessonId === item._id}
        toggleComplete={handleVideoComplete}
      />
    ),
    [
      expandedNodes,
      handleLessonPress,
      handleMorePress,
      playingLessonId,
      toggleNode,
      handleVideoComplete,
    ],
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

  const isFilterAdded =
    filterType.length === 1 && filterType[0] === 'all' ? 0 : filterType.length;

  return (
    <View style={styles.container}>
      {/* Search + Filter */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: gGap(10),
          gap: gGap(10),
          marginTop: gGap(10),
        }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chapters or lessons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search chapters or lessons"
            placeholderTextColor={Colors.BodyText}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Select filter">
          {Boolean(isFilterAdded) && (
            <Text style={styles.filterButtonText}>{isFilterAdded}</Text>
          )}
          <IoniconsIcon
            name="filter"
            size={24}
            color={Colors.PrimaryButtonTextColor}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filters</Text>

            <FlatList
              data={FILTER_OPTIONS}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => toggleFilterType(item.value)}
                  accessibilityLabel={`Toggle filter ${item.label}`}>
                  <View style={styles.filterItemContainer}>
                    <IoniconsIcon
                      name={
                        filterType.includes(item.value)
                          ? 'checkbox'
                          : 'square-outline'
                      }
                      size={20}
                      color={
                        filterType.includes(item.value) ? '#007AFF' : '#444'
                      }
                    />
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={ItemSeparator}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              accessibilityLabel="Close filter modal">
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Action Modal */}
      <ActionModal
        visible={actionModalVisible}
        item={selectedItem}
        colors={Colors}
        onClose={() => setActionModalVisible(false)}
        onTogglePin={togglePin}
        onToggleFocus={toggleFocus}
        onToggleComplete={toggleComplete}
      />

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

export default OptimizedCourseTree;
