import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CommunityCreatePost from '../../components/CommunityCom/CommunityCreatePost';
import {loadCommunityPosts} from '../../actions/chat-noti';
import CommunityPost from '../../components/CommunityCom/CommunityPost';
import {useDispatch, useSelector} from 'react-redux';
import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
import ScrollToTop from '../../assets/Icons/ScrollToTop';
import SearchAndFilter from '../../components/SharedComponent/SearchAndFilter';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import CrossCircle from '../../assets/Icons/CrossCircle';
import debounce from 'lodash/debounce';
import {
  setComInfo,
  setCommunityPosts,
} from '../../store/reducer/communityReducer';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {IPost} from '../../types/community/community';
import RepostModal from '../../components/CommunityCom/Modal/RepostModal';
import {loadComPostNewly} from '../../utility/commonFunction';
import {gGap} from '../../constants/Sizes';
import CrossIcon from '../../assets/Icons/CrossIcon';

const CommunityScreen = () => {
  const {
    posts = [],
    totalPost = 0,
    isLoading: loadingData = false,
    comInfo,
  } = useSelector((state: RootState) => state.community);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [searchTag, setSearchTag] = useState<string[]>([]);
  useEffect(() => {
    loadComPostNewly();
    return () => {
      dispatch(setCommunityPosts([]));
      dispatch(
        setComInfo({
          action: 'set',
          data: {
            page: 1,
            limit: 10,
            query: '',
            tags: [],
            user: '',
            filterBy: '',
          },
        }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setData] = useState({
    page: 1,
    limit: 10,
    query: '',
    tags: [],
    user: '',
    filterBy: '',
  });

  const filterData = [
    {
      id: 1,
      label: 'Clear',
      value: '',
    },
    {
      id: 2,
      label: 'Saved Posts',
      value: 'save',
    },
    {
      id: 3,
      label: 'Reported Posts',
      value: 'report',
    },
    {
      id: 4,
      label: 'My Posts',
      value: 'mypost',
    },
    {
      id: 5,
      label: 'Recent',
      value: 'recent',
    },
    {
      id: 6,
      label: 'This Week',
      value: 'lastweek',
    },
    {
      id: 7,
      label: 'This Month',
      value: 'lastmonth',
    },
  ];

  const scrollY = useSharedValue(0);
  const flatListRef = useRef<any>(null);
  const buttonTranslateY = useSharedValue(250);

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    if (event.contentOffset.y > 200) {
      buttonTranslateY.value = withSpring(0, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
    } else {
      buttonTranslateY.value = withSpring(250, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
    }
  });

  const renderItem = useCallback(
    ({item, index}: {item: IPost; index: number}) => {
      if (!item) {
        return null;
      }
      return (
        <CommunityPost
          post={item}
          index={index}
          handleTopContributor={handleTopContributor}
          handleTagSearch={handleTagSearch}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const keyExtractor = useCallback(
    (item: IPost, index: number) => item?._id?.toString() || index.toString(),
    [],
  );

  const handleScrollToTop = () => {
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
  };

  const handleFilter = (value: string) => {
    dispatch(
      setComInfo({
        action: 'update',
        data: {page: 1, filterBy: value, user: ''},
      }),
    );
    loadCommunityPosts();
    //   {
    //     page: 1,
    //     limit: 10,
    //     query: '',
    //     tags: '',
    //     user: '',
    //     filterBy: value,
    //   },
    //   () => {},
    //   'filter',
    // const filterOption = filterData.find(option => option.value === value);

    // if (!filterOption) {
    //   console.error('Invalid filter value:', value);
    //   return;
    // }
  };

  const handleTagSearch = (tag: string) => {
    setSearchTag(prevTags => {
      if (prevTags.includes(tag as string)) {
        return prevTags;
      }
      dispatch(
        setComInfo({
          action: 'update',
          data: {page: 1, tags: [...prevTags, tag]},
        }),
      );
      loadCommunityPosts();
      const updatedTags = [...prevTags, tag];
      return updatedTags;
    });
    handleScrollToTop();
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setSearchTag(prevTags => {
      const updatedTags = prevTags.filter(tag => tag !== tagToRemove);
      dispatch(
        setComInfo({
          action: 'update',
          data: {page: 1, tags: updatedTags},
        }),
      );
      loadCommunityPosts();
      return updatedTags;
    });
  };

  const handleTopContributor = (id: string) => {
    handleScrollToTop();
    dispatch(
      setComInfo({
        action: 'update',
        data: {page: 1, user: id, filterBy: ''},
      }),
    );
    loadCommunityPosts();
  };

  const handleSearch = useCallback(
    (text: string) => {
      debounce(() => {
        dispatch(
          setComInfo({
            action: 'update',
            data: {page: 1, query: text},
          }),
        );
        loadCommunityPosts();
      }, 500)();
    },
    [dispatch],
  );

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: buttonTranslateY.value}],
    };
  });

  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        position: 'relative',
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: Colors.Background_color,
        }}
      />
      <Animated.View style={[styles.upButtonContainer, buttonStyle]}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleScrollToTop}>
          <ScrollToTop />
        </TouchableOpacity>
      </Animated.View>
      <Animated.FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View style={{gap: gGap(10), paddingHorizontal: gGap(10)}}>
            <RepostModal />
            <View>
              <Text style={styles.title}>Community</Text>
              <Text style={styles.subHeading}>
                Engage and inspire: post, share, and discover
              </Text>
            </View>
            <SearchAndFilter
              setSearchText={text => setData(pre => ({...pre, query: text}))}
              // placeholderText="Search by tag..."
              searchText={data?.query ? data.query : ''}
              handleSearch={handleSearch}
              itemList={filterData}
              handleFilter={handleFilter}
              filterValue={comInfo?.filterBy}
              setFilterValue={value => {
                dispatch(
                  setComInfo({
                    action: 'update',
                    data: {page: 1, filterBy: value},
                  }),
                );
              }}
            />
            {(comInfo.user || comInfo.filterBy) && (
              <Pressable
                onPress={() => {
                  loadComPostNewly();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: gGap(5),
                }}>
                <View
                  style={{
                    borderRadius: 50,
                    backgroundColor: Colors.PrimaryButtonBackgroundColor,
                    paddingVertical: gGap(2),
                    paddingHorizontal: gGap(5),
                  }}>
                  <Text style={styles.selectedFilter}>
                    {comInfo.user
                      ? 'Top Contributor'
                      : comInfo.filterBy === 'save'
                      ? 'Saved Posts'
                      : comInfo.filterBy === 'report'
                      ? 'Reported Posts'
                      : comInfo.filterBy === 'mypost'
                      ? 'My Posts'
                      : comInfo.filterBy === 'recent'
                      ? 'Recent Posts'
                      : comInfo.filterBy === 'lastweek'
                      ? 'This Week'
                      : comInfo.filterBy === 'lastmonth'
                      ? 'This Month'
                      : comInfo.filterBy}
                  </Text>
                </View>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: gGap(10),
                      backgroundColor: Colors.Red,
                      borderRadius: 50,
                      paddingVertical: gGap(2),
                      paddingHorizontal: gGap(5),
                    },
                  ]}>
                  <Text style={styles.subHeading}>Clear</Text>
                  <CrossIcon color="white" />
                </View>
              </Pressable>
            )}
            <CommunityCreatePost />
            {/* {isLoading && <Loading />} */}
            {searchTag?.length > 0 && (
              <View style={styles.tagContainer}>
                {searchTag?.map((tag, idx) => (
                  <View key={idx} style={styles.tagButton}>
                    <Text style={styles.tagSearchText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.crossIcon}>
                      <CrossCircle color={Colors.Red} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        }
        contentContainerStyle={styles.container}
        onScroll={onScroll}
        onEndReached={() => {
          if (posts.length < totalPost!) {
            // console.log(
            //   'Called neee0===================================================',
            // );
            dispatch(
              setComInfo({
                action: 'update',
                data: {page: comInfo?.page + 1},
              }),
            );
            loadCommunityPosts();
          }
        }}
        ListFooterComponent={
          <>
            {loadingData && comInfo?.page > 1 && (
              <View
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LoadingSmall color={Colors.Primary} size={20} />
              </View>
            )}
            {/* {posts.length === 0 && <NoDataAvailable />} */}
          </>
        }
        ListEmptyComponent={!loadingData ? <NoDataAvailable /> : null}
      />
    </View>
  );
};

export default CommunityScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    selectedFilter: {
      color: Colors.PrimaryButtonTextColor,
      fontWeight: '500',
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      // paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
    },
    title: {
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: '500',
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    separator: {
      minHeight: responsiveScreenHeight(10),
    },
    buttonContainer: {
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
      width: responsiveScreenFontSize(5),
      height: responsiveScreenFontSize(5),
      alignItems: 'center',
      justifyContent: 'center',
    },

    upButtonContainer: {
      position: 'absolute',
      zIndex: 100,
      bottom: responsiveScreenHeight(5),
      right: responsiveScreenWidth(8),
    },
    tagSearchText: {
      color: Colors.Heading,
      paddingHorizontal: 15,
      paddingVertical: 5,
      fontFamily: CustomFonts.REGULAR,
    },
    tagContainer: {
      paddingTop: 5,
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 15,
      paddingBottom: 15,
      paddingHorizontal: 10,
    },
    tagButton: {
      backgroundColor: Colors.Foreground,
    },
    crossIcon: {
      position: 'absolute',
      right: -10,
      top: -10,
    },
  });
