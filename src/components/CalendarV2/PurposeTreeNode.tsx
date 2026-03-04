import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {borderRadius, gGap} from '../../constants/Sizes';
import {TColors} from '../../types';
import {IoniconsIcon} from '../../constants/Icons';

import {showToast} from '../HelperFunction';

// TypeScript interfaces
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
  duration?: {
    watched: number;
    total: number;
  };
}
interface TreeItem extends CourseItem {
  children: TreeItem[];
  level?: number;
  hasChildren?: boolean;
}

interface PurposeTreeNodeProps {
  item: TreeItem;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onLessonPress: (lesson: TreeItem) => void;
}
// Memoized PurposeTreeNode component
const PurposeTreeNode = memo(
  ({
    item,
    level,
    isExpanded,
    onToggle,
    onLessonPress,
  }: PurposeTreeNodeProps) => {
    const isChapter = item.type === 'chapter';
    const hasChildren = item.children && item.children.length > 0;
    const Colors = useTheme();
    const styles = getStyles(Colors);
    const displayName = isChapter
      ? (item.chapter && item.chapter.name) || 'Untitled Chapter'
      : (item.lesson && item.lesson.title) || 'Untitled Lesson';

    const getIconName = (): string => {
      if (item.isLocked) {
        return 'lock-closed';
      }
      if (isChapter) {
        return hasChildren
          ? isExpanded
            ? 'folder-open'
            : 'folder'
          : 'document';
      } else {
        if (item.lesson && item.lesson.type) {
          switch (item.lesson.type) {
            case 'video':
              return 'videocam';
            case 'slide':
              return 'images';
            case 'quiz':
              return 'book';
            default:
              return 'document-text';
          }
        }
        return 'document-text';
      }
    };

    const handlePress = () => {
      //   if (item.isLocked) {
      //     return showToast({
      //       message: 'This lesson is locked',
      //     });
      //   }

      if (isChapter && hasChildren) {
        onToggle(item._id);
      }
      onLessonPress(item);
    };

    return (
      <View style={{}}>
        <View
          style={[
            styles.nodeContainer,
            {
              borderLeftWidth: level! > 0 ? 5 : undefined,
              borderLeftColor:
                level! > 0 ? Colors.Primary + '70' : Colors.BorderColor,
              borderTopColor: Colors.BorderColor,
              borderBottomColor: Colors.BorderColor,
              borderRightColor: Colors.BorderColor,
              backgroundColor: !item.myCourse.parent
                ? Colors.Foreground
                : item.myCourse.parent && item.type === 'chapter'
                ? Colors.Background_color
                : Colors.Foreground,
              borderWidth: 1,
              borderRadius: borderRadius.small,
              marginTop: item.myCourse.parent ? gGap(3) : gGap(5),
            },
          ]}>
          <TouchableOpacity
            style={styles.nodeInnerContainer}
            onPress={handlePress}>
            <View style={styles.nodeIconContainer}>
              {isChapter && hasChildren && (
                <IoniconsIcon
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={Colors.BodyText}
                />
              )}
              <IoniconsIcon
                name={getIconName()}
                size={20}
                color={Colors.BodyText}
              />
            </View>
            <View style={styles.nodeContent}>
              <Text
                style={[
                  styles.nodeTitle,
                  isChapter ? styles.chapterTitle : styles.lessonTitle,
                ]}
                numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);
export default PurposeTreeNode;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
      flexDirection: 'row',
      gap: gGap(3),
    },
    nodeContent: {
      flex: 1,
      paddingVertical: gGap(7),
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
  });
