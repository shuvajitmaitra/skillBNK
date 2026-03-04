// ChapterItem.tsx
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {AntDesignIcon, IoniconsIcon} from '../../constants/Icons';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import WebView from 'react-native-webview';
import {
  setSelectedVideo,
  togglePinContent,
  toggleFocusContent,
  toggleCompleteContent,
} from '../../store/reducer/programReducer';
import {TContent} from '../../types/program/programModuleType';

interface ChapterItemProps {
  item: TContent;
  isSearchResult?: boolean;
  searchPaths?: Record<string, boolean>;
  onOpenActionModal: (item: TContent) => void;
  customChildMapping?: Record<string, TContent[]>;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  item,
  isSearchResult = false,
  searchPaths = {},
  onOpenActionModal,
  customChildMapping,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // Initialize expanded state based on search context
  const [expanded, setExpanded] = useState(false);

  const {
    selectedCategory,
    chapterModules,
    selectedVideo,
    searchResults,
    isSearching,
    isFiltering,
  } = useSelector((state: RootState) => state.program);

  // Determine if this item is a direct search match
  const isDirectSearchMatch =
    isSearchResult &&
    searchResults?.matchedItems.some(
      matchedItem => matchedItem._id === item._id,
    );

  // Determine if this is a chapter that should be expanded in search results
  const shouldExpandChapter =
    item.type === 'chapter' &&
    isSearchResult &&
    (isDirectSearchMatch || searchPaths[item._id]);

  // Update expanded state when search context changes
  useEffect(() => {
    // If search is active and this is a matched chapter, expand it
    if (shouldExpandChapter) {
      setExpanded(true);
    }
    // If search is cleared and we're back to normal view, collapse all chapters
    else if (!isSearching && !isFiltering) {
      setExpanded(false);
    }
  }, [isSearching, shouldExpandChapter, isDirectSearchMatch, isFiltering]);

  // Get child items from custom mapping or default chapter modules
  const child =
    expanded &&
    (() => {
      if (customChildMapping) {
        return customChildMapping[item._id] || [];
      }
      return (
        selectedCategory &&
        chapterModules[selectedCategory?._id]?.child[item._id]
      );
    })();

  const getIconName = (): string => {
    if (item.type === 'chapter') {
      return expanded ? 'folder-open' : 'folder';
    } else {
      // lesson
      if (item.lesson && item.lesson.type) {
        switch (item.lesson.type) {
          case 'video':
            return 'videocam';
          case 'slide':
            return 'images';
          default:
            return 'document-text';
        }
      }
      return 'document-text';
    }
  };

  // Function to handle direct icon press
  const handleIconPress = (type: 'pin' | 'focus' | 'complete') => {
    switch (type) {
      case 'pin':
        dispatch(togglePinContent(item._id));
        break;
      case 'focus':
        dispatch(toggleFocusContent(item._id));
        break;
      case 'complete':
        dispatch(toggleCompleteContent(item._id));
        break;
    }
  };

  // Function to render status icons
  const renderStatusIcons = () => {
    return (
      <View style={styles.statusIconsContainer}>
        {item.isPinned && (
          <TouchableOpacity
            style={{transform: [{scaleX: -1}]}}
            onPress={() => handleIconPress('pin')}>
            <AntDesignIcon name="pushpin" size={20} color={Colors.BodyText} />
          </TouchableOpacity>
        )}
        {item.isFocused && (
          <TouchableOpacity onPress={() => handleIconPress('focus')}>
            <IoniconsIcon name="eye" size={20} color={Colors.BodyText} />
          </TouchableOpacity>
        )}
        {item.isCompleted && (
          <TouchableOpacity onPress={() => handleIconPress('complete')}>
            <IoniconsIcon
              name="checkmark-circle"
              size={20}
              color={Colors.SuccessColor}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Function to render child items
  const renderChildItems = () => {
    if (!child || child.length === 0) return null;

    if (isSearchResult) {
      // If ANY parent in the path to this item is a direct match, show ALL children
      if (isDirectSearchMatch && item.type === 'chapter') {
        // This is a directly matched chapter - show ALL children
        return child.map((childItem: TContent) => (
          <ChapterItem
            key={childItem._id}
            item={childItem}
            // Pass search context only for highlighting
            isSearchResult={true}
            searchPaths={searchPaths}
            onOpenActionModal={onOpenActionModal}
            customChildMapping={customChildMapping}
          />
        ));
      } else if (item.type === 'chapter' && searchPaths[item._id]) {
        // This is a chapter in the path to a match - also show ALL children
        // Not just the matched ones
        return child.map((childItem: TContent) => (
          <ChapterItem
            key={childItem._id}
            item={childItem}
            isSearchResult={true}
            searchPaths={searchPaths}
            onOpenActionModal={onOpenActionModal}
            customChildMapping={customChildMapping}
          />
        ));
      }
    }

    // For filtered or normal mode, show all children
    return child.map((childItem: TContent) => (
      <ChapterItem
        key={childItem._id}
        item={childItem}
        isSearchResult={isSearchResult}
        searchPaths={searchPaths}
        onOpenActionModal={onOpenActionModal}
        customChildMapping={customChildMapping}
      />
    ));
  };

  return (
    <View
      style={{
        ...styles.mainCon,
        backgroundColor: !item.myCourse.parent
          ? Colors.Foreground
          : item.myCourse.parent && item.type === 'chapter'
          ? Colors.Background_color
          : item.myCourse.parent && item.type === 'lesson'
          ? Colors.Foreground
          : undefined,
        paddingHorizontal: gGap(5),
        marginHorizontal: !item.myCourse.parent ? gGap(5) : gGap(-5),
        paddingVertical:
          item.myCourse.parent && item.type === 'chapter' ? gGap(10) : gGap(6),
        marginTop:
          item.myCourse.parent && item.type !== 'chapter' ? gGap(5) : undefined,
        // Highlight search matches or filtered items
        borderColor: isDirectSearchMatch
          ? Colors.Primary
          : isFiltering && (item.isPinned || item.isFocused || item.isCompleted)
          ? Colors.Primary
          : Colors.BorderColor,
        borderWidth:
          isDirectSearchMatch ||
          (isFiltering && (item.isPinned || item.isFocused || item.isCompleted))
            ? 2
            : 1,
      }}>
      <View style={styles.itemContainer}>
        <Pressable
          onPress={() => {
            if (item.type === 'lesson') {
              dispatch(setSelectedVideo(item));
            } else if (item.type === 'chapter') {
              // Simply toggle expanded state
              setExpanded(!expanded);
            }
          }}
          style={[
            styles.container,
            item.type === 'lesson' && {
              justifyContent: 'flex-start',
              gap: gGap(10),
            },
          ]}>
          {item.type !== 'lesson' && (
            <TouchableOpacity
              onPress={() => {
                setExpanded(!expanded);
              }}>
              <IoniconsIcon
                name={expanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={
                  isDirectSearchMatch ||
                  (isFiltering &&
                    (item.isPinned || item.isFocused || item.isCompleted))
                    ? Colors.Primary
                    : Colors.BodyText
                }
              />
            </TouchableOpacity>
          )}
          <IoniconsIcon
            name={getIconName()}
            size={20}
            color={
              isDirectSearchMatch ||
              (isFiltering &&
                (item.isPinned || item.isFocused || item.isCompleted))
                ? Colors.Primary
                : Colors.BodyText
            }
          />

          <Text
            style={[
              styles.chapterTitle,
              isDirectSearchMatch && styles.highlightedText,
              isFiltering &&
                (item.isPinned || item.isFocused || item.isCompleted) &&
                styles.highlightedText,
            ]}>
            {item.type === 'chapter' ? item.chapter.name : item.lesson.title}
          </Text>
        </Pressable>

        <View style={styles.actionsContainer}>
          {/* Status icons */}
          {renderStatusIcons()}

          {/* Three dots menu icon */}
          {(!item.myCourse.parent || item.type === 'lesson') && (
            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => onOpenActionModal(item)}>
              <IoniconsIcon
                name="ellipsis-vertical"
                size={20}
                color={Colors.BodyText}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectedVideo?._id === item._id && (
        <View style={{aspectRatio: 16 / 9}}>
          <WebView
            source={{
              html: `<iframe src="${
                item.type === 'lesson' && item.lesson.url
                  ? item.lesson.url
                  : 'https://placehold.co/1920x1080.mp4?text=No+Video+Available'
              }" width="100%" height="100%" frameborder="0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`,
            }}
            onError={() => null}
            allowsFullscreenVideo={true}
            scrollEnabled={false}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      )}

      {expanded && renderChildItems()}

      {expanded && (!child || child.length === 0) && (
        <Text
          style={{
            textAlign: 'center',
            backgroundColor: Colors.PrimaryOpacityColor,
            paddingVertical: gGap(5),
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: borderRadius.small,
            color: Colors.Primary,
            fontWeight: '500',
            fontSize: fontSizes.body,
            marginTop: gGap(5),
          }}>
          No content available
        </Text>
      )}
    </View>
  );
};

export default ChapterItem;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    mainCon: {
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
      backgroundColor: Colors.BodyTextOpacity,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(5),
    },
    expandIcon: {},
    chapterTitle: {
      fontSize: fontSizes.body,
      color: Colors.Heading,
      fontWeight: '600',
      flex: 1,
      marginRight: 5,
    },
    highlightedText: {
      color: Colors.Primary,
      fontWeight: '700',
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(5),
    },
    menuIcon: {
      paddingVertical: 5,
    },
  });
