import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {useTheme} from '../../context/ThemeContext';
import {borderRadius, fontSizes, gGap, gHeight} from '../../constants/Sizes';
import {TColors} from '../../types';
import {AntDesignIcon, IoniconsIcon} from '../../constants/Icons';
import {
  LessonData,
  setSelectedLesson,
} from '../../store/reducer/programReducer';
import {removeMarkdown, showToast} from '../HelperFunction';
import {programService} from '../../services/programService';
import VimeoPlayer from './VimeoPlayer';
import YouTubePlayer from './YouTubePlayer';
import RNText from '../SharedComponent/RNText';
function getOrderedKeys(obj: LessonData): string[] {
  const desiredOrder = [
    'transcription',
    'summary',
    'behavioral',
    'interview',
    'implementation',
  ];

  // Get keys from desired order that exist and have non-empty values
  const orderedKeys = desiredOrder.filter(
    key => obj[key] && obj[key].trim() !== '',
  );

  // Get additional keys not in desired order that have non-empty values
  const additionalKeys = Object.keys(obj).filter(
    key => !desiredOrder.includes(key) && obj[key] && obj[key].trim() !== '',
  );

  // Combine ordered keys with additional keys
  return [...orderedKeys, ...additionalKeys];
}

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

interface TreeNodeProps {
  item: TreeItem;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onLessonPress: (lesson: TreeItem) => void;
  onMorePress: (item: TreeItem) => void;
  isPlaying: boolean;
  toggleComplete: (id: TreeItem) => void;
}
// Memoized TreeNode component
const TreeNode = memo(
  ({
    item,
    level,
    isExpanded,
    onToggle,
    onLessonPress,
    onMorePress,
    isPlaying,
    toggleComplete,
  }: TreeNodeProps) => {
    const {selectedLesson} = useSelector((state: RootState) => state.program);
    const dispatch = useDispatch();
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
      if (item.isLocked) {
        return showToast({
          message: 'This lesson is locked',
        });
      }
      if (selectedLesson === null || selectedLesson?._id !== item?._id) {
        programService.loadSingleLessonData(item._id);
      }
      if (item.lesson?.type === 'quiz') {
        dispatch(
          setSelectedLesson({
            ...selectedLesson,
            quizModalVisible: true,
            ...item,
          }),
        );
      }
      if (isChapter && !hasChildren) {
        if (selectedLesson && selectedLesson?._id === item?._id) {
          return dispatch(setSelectedLesson(null));
        }
        showToast({message: 'No content available'});
      }
      if (isChapter && hasChildren) {
        onToggle(item._id);
      } else if (!isChapter) {
        if (item.lesson?.type === 'video' && !item.lesson.url) {
          return showToast({message: 'Videos not found'});
        }
        if (item.lesson?.type === 'video') {
          onLessonPress(item);
        } else if (item.lesson?.type === 'file') {
          showToast({
            message: 'File cannot be open from mobile',
          });
        }
      }
    };
    const startAt =
      item.lesson?.type === 'video' && item.duration
        ? item.duration.watched || 0
        : 0;
    const isYouTubeUrl = (u: string): boolean => {
      return u.includes('youtube.com/') || u.includes('youtu.be/');
    };
    item.isFocused && console.log('item', JSON.stringify(item, null, 2));
    return (
      <View
        style={{
          paddingHorizontal: gGap(10),
          marginLeft: level! > 0 ? 5 : undefined,
        }}>
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
              marginTop: item.myCourse.parent ? gGap(5) : gGap(10),
              height: gHeight(45),
            },
          ]}>
          <TouchableOpacity
            style={styles.nodeInnerContainer}
            onPress={handlePress}>
            {isChapter && hasChildren && (
              <IoniconsIcon
                name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                size={16}
                color={Colors.BodyText}
              />
            )}
            <View style={styles.nodeIconContainer}>
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
                  isPlaying && !isChapter ? styles.playingLesson : null,
                ]}
                numberOfLines={1}>
                {displayName}
              </Text>
              {isChapter && item.chapter && item.chapter.description && (
                <Text style={styles.nodeDescription} numberOfLines={1}>
                  {removeMarkdown(item.chapter.description)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          {item.isPinned && (
            <AntDesignIcon
              name="pushpin"
              size={16}
              color="#007AFF"
              style={styles.statusIcon}
            />
          )}
          {item.isFocused && (
            <IoniconsIcon
              name="eye"
              size={16}
              color="#FFD700"
              style={styles.statusIcon}
            />
          )}
          {item.isCompleted && (
            <IoniconsIcon
              name="checkmark-circle"
              size={16}
              color="#28A745"
              style={styles.statusIcon}
            />
          )}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => onMorePress(item)}
            accessibilityLabel={`More options for ${displayName}`}>
            <IoniconsIcon
              name="ellipsis-vertical"
              size={20}
              color={Colors.BodyText}
            />
          </TouchableOpacity>
        </View>
        {isPlaying &&
          !isChapter &&
          item.lesson?.url &&
          item.lesson.type === 'video' &&
          (isYouTubeUrl(item.lesson.url) ? (
            // <YouTubePlayer url={item.lesson.url} startAt={startAt || 0} />
            <YouTubePlayer
              onDuration={d => console.log('YT duration', d)}
              onStateChange={s => console.log('YT state', s)}
              url={item.lesson.url}
              startAt={startAt || 0}
              onEvery15Sec={async ({currentTime, duration}) => {
                // console.log('every 15s', currentTime, '/', duration);

                item.myCourse?.course &&
                  (await programService.saveLessonProgress({
                    lessonId: item.myCourse?.course || '',
                    progress: {
                      action: 'duration',
                      chapterId: item._id,
                      watched: Math.floor(currentTime),
                      total: Math.floor(duration),
                    },
                  }));
              }}
              onFiveSecBeforeEnd={async ({currentTime, duration}) => {
                console.log(
                  'Lesson End-------------------',
                  currentTime,
                  '/',
                  duration,
                );
                // item.myCourse?.course &&
                //   (await programService.saveLessonProgress({
                //     lessonId: item.myCourse?.course || '',
                //     progress: {
                //       action: 'duration',
                //       chapterId: item._id,
                //       watched: Math.floor(currentTime),
                //       total: Math.floor(duration),
                //     },
                //   }));
                toggleComplete(item);
              }}
            />
          ) : (
            <VimeoPlayer
              url={item.lesson.url}
              startAt={startAt || 0}
              onEvery15Sec={async ({currentTime, duration}) => {
                // console.log('every 15s', currentTime, '/', duration);

                item.myCourse?.course &&
                  (await programService.saveLessonProgress({
                    lessonId: item.myCourse?.course || '',
                    progress: {
                      action: 'duration',
                      chapterId: item._id,
                      watched: Math.floor(currentTime),
                      total: Math.floor(duration),
                    },
                  }));
              }}
              // onFiveSecBeforeEnd={async ({currentTime, duration}) => {
              //   // console.log(
              //   //   'Lesson End-------------------',
              //   //   currentTime,
              //   //   '/',
              //   //   duration,
              //   // );
              //   // console.log('item', JSON.stringify(item, null, 2));
              //   // item.myCourse?.course &&
              //   //   (await programService.saveLessonProgress({
              //   //     lessonId: item.myCourse?.course || '',
              //   //     progress: {
              //   //       action: 'duration',
              //   //       chapterId: item._id,
              //   //       watched: Math.floor(currentTime),
              //   //       total: Math.floor(duration),
              //   //     },
              //   //   }));
              //   // toggleComplete(item._id);
              // }}
              onStateChange={state => {
                console.log('Lesson End-------------------');
                if (state === 'ended') {
                  toggleComplete(item);
                }
              }}
            />
          ))}
        {isPlaying &&
          !isChapter &&
          item.lesson?.url &&
          item.lesson.type === 'video' && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: gGap(10),
                marginTop: gGap(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {selectedLesson?.lesson?.data &&
                getOrderedKeys(selectedLesson.lesson.data).map(i => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      const pre = {...selectedLesson};
                      dispatch(
                        setSelectedLesson({
                          ...pre,
                          activeTab: i,
                          lessonInfoModalVisible: true,
                        }),
                      );
                    }}
                    style={{
                      backgroundColor: Colors.SecondaryButtonBackgroundColor,
                      paddingVertical: gGap(5),
                      paddingHorizontal: gGap(15),
                      borderWidth: 1,
                      borderRadius: borderRadius.small,
                      borderColor: Colors.BorderColor,
                    }}>
                    <RNText
                      style={{
                        color: Colors.SecondaryButtonTextColor,
                        fontSize: fontSizes.body,
                        textTransform: 'capitalize',
                      }}>
                      {i}
                    </RNText>
                  </TouchableOpacity>
                ))}
            </View>
          )}

        {selectedLesson?._id === item._id &&
          selectedLesson?.attachments?.length > 0 && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.PrimaryButtonBackgroundColor,
                gap: gGap(10),
                width: gGap(130),
                justifyContent: 'center',
                marginTop: gGap(10),
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                borderRadius: borderRadius.small,
                paddingVertical: gGap(3),
                alignSelf: 'center',
              }}
              onPress={() => {
                const pre = {...selectedLesson};
                dispatch(
                  setSelectedLesson({
                    ...pre,
                    chapterAttachmentModalVisible: true,
                  }),
                );
              }}>
              <IoniconsIcon
                name="eye"
                size={25}
                color={Colors.PrimaryButtonTextColor}
              />
              <Text style={{color: Colors.PrimaryButtonTextColor}}>
                Attachments
              </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  },
);
export default TreeNode;

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
  });
