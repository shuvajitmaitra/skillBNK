import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ChatItem from '../../components/ChatCom/ChatItem';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import OnlineUsersItem from '../../components/ChatCom/OnlineUsersItem';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import ChatHeaderFilter from '../../components/ChatCom/ChatHeaderFilter';
import Divider from '../../components/SharedComponent/Divider';
import ChatSearchField from '../../components/ChatCom/ChatSearchField';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FilterOptionModal from '../../components/ChatCom/Modal/FilterOptionModal';
import {TouchableWithoutFeedback} from 'react-native';
import CreateCrowdModal from '../../components/ChatCom/Modal/CreateCrowdModal';
import {RootState} from '../../types/redux/root';
import {IOnlineUser, TChat} from '../../types/chat/chatTypes';
import {TColors} from '../../types';
import {loadChats} from '../../actions/chat-noti';
import {theme} from '../../utility/commonFunction';

export function sortByNestedProperty<T>(
  array: T[] = [],
  propertyPath = '',
  order = 'desc',
): T[] {
  const getValue = (obj: any, path: string) =>
    path.split('.').reduce((o, k) => (o || {})[k], obj);

  return [...array].sort((a, b) => {
    const valueA = new Date(getValue(a, propertyPath));
    const valueB = new Date(getValue(b, propertyPath));

    return order === 'asc'
      ? valueA.getTime() - valueB.getTime()
      : valueB.getTime() - valueA.getTime();
  });
}

function sortByLatestMessage<T extends {latestMessage?: {createdAt?: string}}>(
  data: T[] = [],
  propertyPath = 'latestMessage.createdAt',
): T[] {
  return data?.slice().sort((a, b) => {
    const getNestedValue = (obj: T, path: string) => {
      const parts = path.split('.');
      let value: any = obj;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          return undefined;
        }
      }
      return value;
    };

    const dateA = getNestedValue(a, propertyPath)
      ? new Date(getNestedValue(a, propertyPath))
      : new Date(0);
    const dateB = getNestedValue(b, propertyPath)
      ? new Date(getNestedValue(b, propertyPath))
      : new Date(0);

    return dateB.getTime() - dateA.getTime(); // For descending order
  });
}

export default function NewChatScreen() {
  const Colors = useTheme();
  const {chats, onlineUsers, onlineUsersObj, archivedChats} = useSelector(
    (state: RootState) => state.chat,
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const {top} = useSafeAreaInsets();

  const [checked, setChecked] = useState('chats');
  const [allRecords, setAllRecords] = useState<TChat[]>([]);
  const [records, setRecords] = useState<TChat[]>([]);
  // console.log('records.length', JSON.stringify(records.length, null, 2));
  const [results, setResults] = useState<TChat[]>([]);
  const [isOnlineUsers, setOnlineUsers] = useState<IOnlineUser[]>(onlineUsers);
  const [isCreateCrowdModalVisible, setIsCreateCrowdModalVisible] =
    useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const toggleCreateCrowdModal = () => {
    setIsCreateCrowdModalVisible(!isCreateCrowdModalVisible);
  };
  const bottomSheetRef = useRef<any>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const openBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };
  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };
  useEffect(() => {
    loadChats();
  }, []);

  // Load initial data
  useEffect(() => {
    const filteredChats = chats?.filter((x: TChat) => !x?.isArchived) || [];
    const sortedChats = sortByLatestMessage(
      filteredChats,
      'latestMessage.createdAt',
    );

    setAllRecords(sortedChats);
    setResults(sortedChats);

    // Reset pagination when chats change
    setPage(1);
    setHasMoreData(sortedChats.length > ITEMS_PER_PAGE);

    // Load first page
    setRecords(sortedChats.slice(0, ITEMS_PER_PAGE));
  }, [chats]);

  useEffect(() => {
    setOnlineUsers(onlineUsers);

    return () => {
      setOnlineUsers([]);
    };
  }, [onlineUsers]);

  // Handle loading more data when filter changes
  const handleRadioChecked = useCallback(
    (item: string) => {
      let filteredChats: TChat[] = [];
      switch (item) {
        case 'mention':
          filteredChats = [];
          break;
        case 'unreadMessage':
          filteredChats =
            chats?.filter(
              (x: TChat) =>
                x?.unreadCount &&
                x?.unreadCount > 0 &&
                !x?.isArchived &&
                x.latestMessage.sender._id !== user._id,
            ) || [];
          break;
        case 'favorites':
          filteredChats =
            chats?.filter(
              (x: TChat) => x?.myData?.isFavourite && !x?.isArchived,
            ) || [];
          break;
        case 'muted':
          filteredChats =
            chats?.filter(
              (x: TChat) => !x.myData.notification.isOn && !x?.isArchived,
            ) || [];
          break;
        case 'crowds':
          filteredChats =
            chats?.filter((x: TChat) => x?.isChannel && !x?.isArchived) || [];
          break;
        case 'archived':
          filteredChats = archivedChats || [];
          break;
        default:
          filteredChats = chats?.filter((x: TChat) => !x?.isArchived) || [];
      }

      const sortedChats = sortByLatestMessage(
        filteredChats,
        'latestMessage.createdAt',
      );

      // Reset pagination when filter changes
      setAllRecords(sortedChats);
      setPage(1);
      setHasMoreData(sortedChats.length > ITEMS_PER_PAGE);

      // Load first page
      setRecords(sortedChats.slice(0, ITEMS_PER_PAGE));
      setChecked(item);
    },
    [archivedChats, chats, user._id],
  );

  const handleFilter = useCallback(
    (val: string) => {
      console.log('val', JSON.stringify(val, null, 1));
      if (checked === 'onlines') {
        if (val) {
          const filteredUsers: IOnlineUser[] = (onlineUsers || []).filter(
            (c: IOnlineUser) =>
              c?.fullName?.toLowerCase().includes(val?.toLowerCase()),
          ) as IOnlineUser[];
          setOnlineUsers(filteredUsers);
        } else {
          setOnlineUsers(onlineUsers || []);
        }
      } else {
        if (val) {
          const d = checked === 'archived' ? archivedChats : results;
          const filteredChats = d?.filter(
            (c: TChat) =>
              c?.latestMessage?.text
                ?.toLowerCase()
                .includes(val?.toLowerCase()) ||
              c?.name?.toLowerCase().includes(val?.toLowerCase()) ||
              c?.otherUser?.fullName
                ?.toLowerCase()
                .includes(val?.toLowerCase()),
          );

          const sortedChats = sortByLatestMessage(
            filteredChats,
            'latestMessage.createdAt',
          );

          // Reset pagination when search filter changes
          setAllRecords(sortedChats);
          setPage(1);
          setHasMoreData(sortedChats.length > ITEMS_PER_PAGE);

          // Load first page
          setRecords(sortedChats.slice(0, ITEMS_PER_PAGE));
        } else {
          handleRadioChecked(checked);
        }
      }
    },
    [checked, onlineUsers, archivedChats, results, handleRadioChecked],
  );

  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMoreData || checked === 'onlines') return;
    setIsLoading(true);

    // Simulate loading delay (remove in production)
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = nextPage * ITEMS_PER_PAGE;

      // Check if there's more data to load
      if (startIndex >= allRecords.length) {
        setHasMoreData(false);
        setIsLoading(false);
        return;
      }

      // Get next batch of items
      const newItems = allRecords.slice(startIndex, endIndex);

      // Append new items to current records
      setRecords(prevRecords => [...prevRecords, ...newItems]);
      setPage(nextPage);

      // Check if we have more data for future loads
      setHasMoreData(endIndex < allRecords.length);
      setIsLoading(false);
    }, 500); // Simulated delay of 500ms
  }, [page, allRecords, isLoading, hasMoreData, checked]);

  const renderChatItem = useCallback(
    ({item}: {item: TChat}) => (
      <ChatItem
        active={Boolean(onlineUsersObj[item.otherUser?._id as string])}
        chat={item}
        setChecked={setChecked}
      />
    ),
    [onlineUsersObj],
  );

  const styles = getStyles(Colors, checked);

  const renderListEmptyComponent = () => (
    <View
      style={{
        height: responsiveScreenHeight(80),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <NoDataAvailable />
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={Colors.Primary} />
      </View>
    );
  };

  const renderItemSeparator = () => (
    <Divider marginTop={0.000001} marginBottom={0.00001} />
  );

  return (
    <TouchableWithoutFeedback
      style={{zIndex: 1111111}}
      onPress={() => bottomSheetRef.current?.dismiss()}>
      <View style={[styles.container, {paddingTop: top}]}>
        <StatusBar
          translucent={true}
          backgroundColor={Colors.Background_color}
          barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
        />
        <View style={styles.searchContainer}>
          <ChatSearchField
            handleFilter={handleFilter}
            checked={checked}
            handleRadioChecked={handleRadioChecked}
          />
        </View>
        <ChatHeaderFilter
          handleFilterModalPress={openBottomSheet}
          checked={checked}
          handleRadioChecked={handleRadioChecked}
          toggleCreateCrowdModal={toggleCreateCrowdModal}
        />
        {checked === 'onlines' ? (
          <ScrollView>
            {isOnlineUsers?.map(item => (
              <View key={item._id}>
                {user?._id !== item?._id && <OnlineUsersItem item={item} />}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.chatListContainer, {}]}>
            {
              <FlatList
                data={records}
                renderItem={renderChatItem}
                keyExtractor={item => item?._id || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                ItemSeparatorComponent={renderItemSeparator}
                ListEmptyComponent={renderListEmptyComponent}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
              />
            }
          </View>
        )}
        {isBottomSheetVisible && (
          <FilterOptionModal
            isVisible={isBottomSheetVisible}
            closeModal={closeBottomSheet}
            handleRadioChecked={handleRadioChecked}
          />
        )}
        {isCreateCrowdModalVisible && (
          <CreateCrowdModal
            isCreateCrowdModalVisible={isCreateCrowdModalVisible}
            toggleCreateCrowdModal={toggleCreateCrowdModal}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (Colors: TColors, checked: string) =>
  StyleSheet.create({
    NoDataContainer: {
      // backgroundColor: "red",
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createCrowdIcon: {
      // backgroundColor: Colors.Primary,
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(1),
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      // paddingVertical: 5,
    },
    CrowdsTexts: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    CrowdHeadingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: responsiveScreenWidth(4),
      // paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(1),
    },
    container: {
      zIndex: 0,
      flex: 1,
      // backgroundColor: "yellow",
      // // paddingTop: responsiveScreenHeight(3.5),
      backgroundColor: Colors.Background_color,
      // marginBottom: 10
    },
    searchContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      // marginTop: responsiveScreenHeight(1),
      zIndex: 1,
    },
    chatListContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      // paddingTop: responsiveScreenHeight(1),
      // backgroundColor: Colors.Red
      height: checked === 'crowds' ? '73%' : 'auto',
      flex: 1,
    },
    recentText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      marginVertical: responsiveScreenHeight(2),
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    loaderContainer: {
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
