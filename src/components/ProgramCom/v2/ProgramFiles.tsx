import React, {useContext, useEffect, useState, useRef, FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {ModuleContext} from './ContentList';
import WebView from 'react-native-webview';
import ArrowTopIcon from '../../../assets/Icons/ArrowTopIcon';
import {ArrowDownTwo} from '../../../assets/Icons/ArrowDownTwo';
import {PlayButtonIcon} from '../../../assets/Icons/PlayButtonIcon';
import {ReadIcon} from '../../../assets/Icons/ReadIcon';
import {LockIcon} from '../../../assets/Icons/LockIconTwo';
import PinIcon from '../../../assets/Icons/PinIcon';
import ThreedotIcon from '../../../assets/Icons/ThreedotIcon';
import ProgramTextDetailsModal from './Modal/ProgramTextDetailsModal';
import {useTheme} from '../../../context/ThemeContext';
import {showToast} from '../../HelperFunction';
import Priority from './Priority';
import BottomNavigationContainer from './BottomNavigationContainer';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import Popover from 'react-native-popover-view';
import {Placement} from 'react-native-popover-view/dist/Types';
import {TColors} from '../../../types';
import {
  TContent,
  TProgram,
  ChapterType,
  TChapter,
  TLesson,
} from '../../../types/program/programModuleType';

// Alias EvilIcons to avoid TS issues
const EIconsAny = EvilIcons as any;

interface ProgramFilesProps {
  item: TContent;
  course: TProgram;
  category: string;
  isChildren: boolean;
  index?: number;
}

interface VideoButtonContainerProps {
  item: TContent;
  dataListArray: string[];
  setType: (type: string) => void;
  setProgramDetailsModalVisible: (visible: boolean) => void;
}

const VideoButtonContainer: FC<VideoButtonContainerProps> = ({
  item,
  dataListArray,
  setType,
  setProgramDetailsModalVisible: _setProgramDetailsModalVisible,
}) => {
  const Colors = useTheme() as TColors;
  const styles = getStyles(Colors);
  const [itemType, setItemType] = useState('');
  const [isProgramDetailsModalVisible, setIsProgramDetailsModalVisible] =
    useState(false);
  if (!item?.lesson?.data) {
    return;
  }
  return (
    <View style={[styles.videoTypeContainer, {marginBottom: 10}]}>
      {dataListArray.map((type: string, index: number) => {
        if (!item.lesson?.data[type as keyof typeof item.lesson.data]) {
          return null;
        }
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setType(type);
              setIsProgramDetailsModalVisible(true);
              setItemType(type);
            }}
            disabled={
              !(
                'lesson' in item &&
                item?.lesson?.data &&
                item.lesson.data[type as keyof typeof item.lesson.data]
              )
            }
            activeOpacity={0.8}
            style={[
              styles.videoType,
              // {
              //   backgroundColor: isActive ? Colors.Primary : Colors.BorderColor,
              // },
            ]}>
            <Text style={styles.videoTypeTitle}>{type}</Text>
          </TouchableOpacity>
        );
      })}
      {'lesson' in item &&
        item?.lesson?.data &&
        isProgramDetailsModalVisible && (
          <ProgramTextDetailsModal
            itemType={itemType}
            item={item}
            dataListArray={dataListArray}
            setProgramDetailsModalVisible={setIsProgramDetailsModalVisible}
            isProgramDetailsModalVisible={isProgramDetailsModalVisible}
          />
        )}
    </View>
  );
};

const ProgramFiles: FC<ProgramFilesProps> = ({
  item,
  course,
  category,
  isChildren,
  index,
}) => {
  const Colors = useTheme() as TColors;
  const styles = getStyles(Colors);

  const {
    isPlayingLesson,
    setIsPlayingLesson,
    dataLoad,
    handleUpdateRootChapter,
  } = useContext(ModuleContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<string | null>(
    item?.isFocused
      ? 'focus'
      : item?.isPinned
      ? 'pin'
      : item?.isCompleted
      ? 'complete'
      : null,
  );
  const [_type, setType] = useState<string>('');
  const [_isProgramDetailsModalVisible, setProgramDetailsModalVisible] =
    useState<boolean>(false);
  const dataListArray = [
    'summary',
    'implementation',
    'interview',
    'behavioral',
  ];

  // Popover States and Refs
  const [isThreeDotPopoverVisible, setIsThreeDotPopoverVisible] =
    useState<boolean>(false);
  const threeDotPopoverRef = useRef(null);

  const handleRadioChecked = (typ: string) => {
    axiosInstance
      .post(`course/chapterv2/track/${item?.myCourse?.course}`, {
        action: typ,
        chapterId: item?._id,
      })
      .then(() => {
        let obj: Partial<TContent> = {};
        if (typ === 'pin') {
          obj = {isPinned: true, isCompleted: false};
        } else if (typ === 'unpin') {
          obj = {isPinned: false, isCompleted: false};
        } else if (typ === 'focus') {
          obj = {isFocused: true, isCompleted: false};
        } else if (typ === 'unfocus') {
          obj = {isFocused: false, isCompleted: false};
        } else if (typ === 'complete') {
          obj = {isCompleted: true};
        } else if (typ === 'incomplete') {
          obj = {isCompleted: false};
        }

        // if (isChildren) {
        //   const arr = [...treeData];
        //   const idx = arr.findIndex(x => x._id === item._id);
        //   if (idx !== -1) {
        //     arr[idx] = {...arr[idx], ...obj};
        //     setTreeData(arr);
        //   }
        // } else {
        // handleUpdateRootChapter(item._id, obj);
        // }

        if (!isChildren) {
          handleUpdateRootChapter(item._id, obj);
        }
        showToast({message: `Added on ${typ}`});
      })
      .catch(err => {
        showToast({
          message: err?.response?.data?.error || 'Something went wrong!',
        });
        console.log(err);
      });

    setChecked(typ);
  };

  const radioOptions = [
    {
      label: item?.isPinned ? 'Unpin' : 'Pin',
      value: item?.isPinned ? 'unpin' : 'pin',
    },
    {
      label: item?.isFocused ? 'Unfocus' : 'Focus',
      value: item?.isFocused ? 'unfocus' : 'focus',
    },
    {
      label: item?.isCompleted ? 'Incomplete' : 'Complete',
      value: item?.isCompleted ? 'incomplete' : 'complete',
    },
  ];

  // Updated onLoadData mapping: explicitly build either a TChapter or a TLesson object
  const onLoadData = ({key}: {key: string}): Promise<void> => {
    return new Promise(resolve => {
      setIsLoading(true);
      axiosInstance
        .post(`/course/chapterv2/get/${course?.slug}/${category}`, {
          parent: key,
        })
        .then(res => {
          const loadedChildren: TContent[] = res.data.chapters.map(
            (child: any) => {
              if (child.chapter) {
                // Construct a TChapter object
                const chapterObj: TChapter = {
                  _id: child._id,
                  type: ChapterType.CHAPTER,
                  chapter: child.chapter, // must match TChapterInfo
                  priority: child.priority,
                  myCourse: child.myCourse,
                  isPinned: child.isPinned,
                  isCompleted: child.isCompleted,
                  isFocused: child.isFocused,
                  isLocked: child.isLocked,
                  isSpecial: child.isSpecial,
                  createdAt: child.createdAt,
                  title: child.chapter.name,
                };
                return chapterObj;
              } else if (child.lesson) {
                // Construct a TLesson object
                const lessonObj: TLesson = {
                  _id: child._id,
                  type: ChapterType.LESSON,
                  lesson: child.lesson, // must match TLessonInfo
                  priority: child.priority,
                  myCourse: child.myCourse,
                  isPinned: child.isPinned,
                  isCompleted: child.isCompleted,
                  isFocused: child.isFocused,
                  isLocked: child.isLocked,
                  isSpecial: child.isSpecial,
                  createdAt: child.createdAt,
                  title: child.lesson.title,
                };
                return lessonObj;
              }
              // Fallback: return the child as-is (or filter it out)
              return child;
            },
          );
          setTreeData(loadedChildren);
          setIsLoading(false);
          resolve();
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
          resolve();
        });
    });
  };

  const handleCollapse = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (isExpanded && treeData?.length === 0) {
      onLoadData({key: item?._id});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, dataLoad]);

  const handleClickLesson = async (lesson: TContent) => {
    if ('lesson' in lesson && lesson?.lesson?.type === 'video') {
      setIsPlayingLesson(lesson);
    } else {
      showToast({
        message: 'This file type can be opened in next update.',
      });
    }
  };

  const startAt = 60;
  console.log(
    'isPlayingLesson.lesson.url',
    JSON.stringify(isPlayingLesson.lesson.url, null, 2),
  );

  const html = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://player.vimeo.com/api/player.js"></script>
    <style>
      html, body { margin:0; padding:0; height:100%; background:#000; }
      iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:0; }
    </style>
  </head>
  <body>
    <iframe
      id="vimeo"
      src="${
        'lesson' in isPlayingLesson && isPlayingLesson.lesson.url
          ? isPlayingLesson.lesson.url
          : 'https://placehold.co/1920x1080.mp4?text=No+Video+Available'
      }?autoplay=1&muted=1&playsinline=1"
      allow="autoplay; picture-in-picture"
    ></iframe>

    <script>
      (function () {
        var iframe = document.getElementById('vimeo');
        var player = new Vimeo.Player(iframe);

        player.ready().then(function () {
          return player.setCurrentTime(${startAt});
        }).then(function () {
          return player.play();
        }).catch(function (e) {
          console.log('seek/play error:', e);
          // autoplay ব্লক হলে এখানে পড়বে
        });
      })();
    </script>
  </body>
</html>
`;

  return (
    <View
      style={[
        item.type === ChapterType.CHAPTER
          ? styles.chapterContainer
          : styles.lessonContainer,
        {
          borderColor:
            isChildren && item.type === ChapterType.CHAPTER
              ? Colors.BorderColor
              : Colors.BorderColor,
          backgroundColor:
            isChildren && item.type === ChapterType.CHAPTER
              ? Colors.Background_color
              : Colors.Foreground,
          marginTop:
            isChildren && item.type === ChapterType.CHAPTER
              ? responsiveScreenHeight(1)
              : isChildren && item.type !== ChapterType.CHAPTER && index === 0
              ? 10
              : 0,
          borderRadius: 10,
          marginBottom: responsiveScreenHeight(1),
        },
      ]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() =>
              item.isLocked
                ? showToast({message: 'This Program is locked...'})
                : item.type === ChapterType.CHAPTER
                ? handleCollapse()
                : item.type === ChapterType.LESSON
                ? handleClickLesson(item)
                : null
            }
            activeOpacity={0.7}
            style={[
              item.type === ChapterType.LESSON
                ? styles.expandedTitleContainer
                : styles.titleContainer,
              {flex: 0.8},
            ]}>
            <View style={{flex: 0.07}}>
              {item.type === ChapterType.LESSON && (
                <View>
                  {item.isLocked ? (
                    <LockIcon />
                  ) : (
                    <>
                      {'lesson' in item && item.lesson.type === 'video' ? (
                        <PlayButtonIcon />
                      ) : 'lesson' in item && item?.lesson?.type === 'link' ? (
                        <EIconsAny
                          name="external-link"
                          size={responsiveScreenFontSize(3)}
                        />
                      ) : 'lesson' in item && item.lesson.type === 'file' ? (
                        <ReadIcon />
                      ) : 'lesson' in item && item.lesson.type === 'slide' ? (
                        <ReadIcon />
                      ) : null}
                    </>
                  )}
                </View>
              )}
              {item.type === ChapterType.CHAPTER &&
                (item.isLocked ? (
                  <LockIcon />
                ) : isExpanded ? (
                  <ArrowTopIcon />
                ) : (
                  <ArrowDownTwo />
                ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 0.93,
                gap: responsiveScreenWidth(1),
                alignItems: 'flex-start',
                marginLeft: responsiveScreenWidth(1),
              }}>
              <Text
                style={[
                  item.type === ChapterType.CHAPTER
                    ? styles.details
                    : styles.lessonDetails,
                ]}>
                {item.type === ChapterType.CHAPTER
                  ? item.chapter.name
                  : item.title}
              </Text>
              <Priority priority={item.priority} />
            </View>
          </TouchableOpacity>

          {/* Right Icons Container */}
          <View style={styles.rightIconsContainer}>
            {/* Pin Icon */}
            <TouchableOpacity
              onPress={() => {
                handleRadioChecked(item.isPinned ? 'unpin' : 'pin');
              }}
              activeOpacity={0.7}>
              {item.isPinned ? <PinIcon /> : null}
            </TouchableOpacity>

            {/* Three-Dot Icon */}
            {!isChildren && (
              <TouchableOpacity
                onPress={() => setIsThreeDotPopoverVisible(true)}
                activeOpacity={0.8}
                style={styles.threeDotIcon}
                ref={threeDotPopoverRef}>
                <ThreedotIcon />
              </TouchableOpacity>
            )}

            {/* Three-Dot Popover */}
            <Popover
              isVisible={isThreeDotPopoverVisible}
              onRequestClose={() => setIsThreeDotPopoverVisible(false)}
              placement={Placement.BOTTOM}
              backgroundStyle={{backgroundColor: Colors.BackDropColor}}
              popoverStyle={styles.popupContent}>
              <GlobalRadioGroup
                options={radioOptions}
                onSelect={value => {
                  handleRadioChecked(value.toString());
                  setIsThreeDotPopoverVisible(false);
                  setChecked(value.toString());
                }}
                selectedValue={checked || ''}
              />
            </Popover>
          </View>
        </View>

        {/* WebView for Playing Lessons */}
        {isPlayingLesson && isPlayingLesson._id === item._id && (
          <>
            <View style={{aspectRatio: 16 / 9}}>
              <WebView
                source={{html}}
                allowsFullscreenVideo
                scrollEnabled={false}
              />
            </View>
            <VideoButtonContainer
              item={item}
              dataListArray={dataListArray}
              setType={setType}
              setProgramDetailsModalVisible={setProgramDetailsModalVisible}
            />
          </>
        )}
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.Primary}
          style={styles.loader}
        />
      ) : isExpanded ? (
        <></>
      ) : null}

      {/* Render Child Chapters/Lessons */}
      {isExpanded &&
        treeData.map((child, idx) => (
          <ProgramFiles
            item={child}
            key={child._id}
            course={course}
            category={category}
            isChildren={true}
            index={idx}
          />
        ))}

      {/* Bottom Navigation Container */}
      {isExpanded && item.type === ChapterType.CHAPTER && !isChildren && (
        <BottomNavigationContainer />
      )}
    </View>
  );
};

export default ProgramFiles;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    // Popover Styles
    popupContent: {
      padding: 16,
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      width: responsiveScreenWidth(50),
      height: responsiveScreenHeight(15),
    },
    popupArrow: {
      // Handled automatically by react-native-popover-view
    },
    // Radio Button Styles
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
    },
    btnContainer: {
      backgroundColor: 'rgba(84, 106, 126, 1)',
      height: responsiveScreenHeight(4.5),
      borderRadius: responsiveScreenWidth(1),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonName: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(5),
    },
    // Container Styles
    lessonContainer: {
      width: '100%',
      justifyContent: 'center',
    },
    chapterContainer: {
      width: '100%',
      alignSelf: 'center',
      borderRadius: 10,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      justifyContent: 'center',
    },
    contentContainer: {
      paddingHorizontal: responsiveScreenWidth(1),
      borderRadius: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '85%',
      paddingHorizontal: responsiveScreenWidth(1),
      gap: responsiveScreenWidth(2),
    },
    expandedTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: responsiveScreenHeight(1),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(2),
      width: '86%',
    },
    details: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: 'left',
    },
    lessonDetails: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.7),
    },
    rightIconsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      flex: 0.2,
    },
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    loader: {
      marginTop: responsiveScreenHeight(2),
    },
    // Video Type Styles
    videoTypeContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      // marginBottom: 10,
    },
    videoType: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingHorizontal: 10,
    },
    videoTypeTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.SecondaryButtonTextColor,
      textTransform: 'capitalize',
    },
  });
