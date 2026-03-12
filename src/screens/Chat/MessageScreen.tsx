import React, {useState, useCallback, useLayoutEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../utility/axiosInstance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import MessageTopPart from '../../components/ChatCom/MessageTopPart';
import {useMMKVObject} from 'react-native-mmkv';
import {
  setLocalMessages,
  updatePinnedMessage,
} from '../../store/reducer/chatSlice';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import PinnedMessagesScreen from './PinnedMessagesScreen';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';
import EmptyMessageContainer from '../../components/ChatCom/EmptyMessageContainer';
import ArchivedMessageContainer from '../../components/ChatCom/ArchivedMessageContainer';
import {setSingleChat} from '../../store/reducer/chatReducer';
import {RootState} from '../../types/redux/root';
import {IMessage} from '../../types/chat/messageTypes';
import {TColors} from '../../types';
import Message from '../../components/ChatCom/Message';
import {TCrowdMembers} from '../../types/chat/crowdMembersTypes';
import {loadCrowdMember} from '../../actions/apiCall';
import {showToast} from '../../components/HelperFunction';
import MessageForwardModal from '../../components/ChatCom/Modal/MessageForwardModal';
import AddNewEventModalV2 from '../../components/CalendarV2/AddNewEventModalV2';
// import ChatFooter3 from '../../components/ChatCom/ChatFooter3';
import {setChatFooterInfo} from '../../store/reducer/chatFooterReducer';
import ChatInputContainer from '../../components/ChatCom/ChatInputContainer';

const ListFooterComponent = ({
  isLoading,
  page,
  styles,
  Colors,
}: {
  isLoading: boolean;
  page: number;
  styles: any;
  Colors: TColors;
}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={[styles.footer, page === 1 && styles.initialFooter]}>
      <ActivityIndicator size="small" color={Colors.Primary} />
    </View>
  );
};

export type MessageProps = {
  [key: string]: IMessage[];
};

const MessageScreen = ({route}: {route: any}) => {
  const dispatch = useDispatch();
  // console.log('rerender');
  const {top} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {singleChat: chat} = useSelector((state: RootState) => state.chat);
  const {newEventData} = useSelector((state: RootState) => state.calendarV2);

  const {messageOptionData} = useSelector((state: RootState) => state.modal);
  const {localMessages, forwardInfo} = useSelector(
    (state: RootState) => state.chatSlice,
  );
  const [viewImage, setViewImage] = useState<{uri: string; index: number}[]>(
    [],
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [messages = {}, setMessages] =
    useMMKVObject<MessageProps>('allMessages');

  const [pinned, setPinned] = useState<IMessage[]>([]);
  const [pinnedCount = {}, setPinnedCount] = useMMKVObject<{
    [key: string]: number;
  }>('pinCount');

  const [crowdMembers] = useMMKVObject<{
    [key: string]: TCrowdMembers[];
  }>('crowdMembers');

  const [pinnedScreenVisible, setPinnedScreenVisible] = useState(false);

  const [viewInitialMessage, setViewInitialMessage] = useState(false);
  const LIMIT = 15;

  const fetchPinned = () => {
    if (!chat?._id) {
      return console.log('Chat id is missing');
    }
    axiosInstance
      .get(`/chat/fetchpinned/${chat?._id || ''}`)
      .then(res => {
        // if (res.data?.pinnedMessages?.length === 0)
        // dispatch(setPinnedMessages(res.data.pinnedMessages));
        setPinned(res?.data?.pinnedMessages as IMessage[]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const initialGetMessage = useCallback(async () => {
    setIsLoading(true);
    const options = {
      page: 0,
      chat: chat?._id,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      setPinnedCount({
        ...pinnedCount,
        [chat?._id]: res.data.pinnedCount,
      });
      const newMessages = res.data.messages.reverse();
      setMessages({
        ...messages,
        [chat?._id]: newMessages,
      });
      if (res.data.messages.length <= 1) {
        setViewInitialMessage(true);
      }
      dispatch(setLocalMessages(newMessages));
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(2);
      }
    } catch (error: any) {
      console.log(
        'Error loading initial messages:',
        JSON.stringify(error.response.data.error, null, 1),
      );
      showToast({
        message: error.response.data.error,
      });
      if (error.response.data.error === 'Channel is listed as archived') {
        dispatch(setSingleChat({...chat, isArchived: true}));
      }
    } finally {
      // console.log('initial Message Calling completed');
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id]);

  useLayoutEffect(() => {
    if (chat?._id) {
      if (
        chat?.isChannel &&
        (!crowdMembers ||
          !crowdMembers[chat?._id] ||
          crowdMembers[chat?._id].length !== chat?.membersCount - 1)
      ) {
        loadCrowdMember(chat?._id);
      }
      initialGetMessage();
    }
    return () => {
      dispatch(setLocalMessages([]));
      dispatch(setChatFooterInfo({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id]);

  const handleLoadMore = async () => {
    // console.log('handleLoadMore', hasMore);
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    const options = {
      page: page,
      chat: chat?._id,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      const newMessages = res.data.messages.reverse();
      dispatch(setLocalMessages([...localMessages, ...newMessages]));
      setMessages(prevMessages => ({
        ...prevMessages,
        [chat?._id]: [...(prevMessages?.[chat?._id] || []), ...newMessages],
      }));
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error: any) {
      console.log(
        'Error loading more messages:',
        JSON.stringify(error.response.data, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handlePin = (id: string) => {
    axiosInstance
      .patch(`/chat/pin/${id}`)
      .then(res => {
        if (res.data.message) {
          if (res.data.message.pinnedBy) {
            showToast({message: 'Message pinned successfully!'});
            setPinned(pre => [messageOptionData, ...pre!]);
            setPinnedCount({
              ...pinnedCount,
              [chat?._id]: (pinnedCount[chat?._id] || 0) + 1,
            });
          } else {
            showToast({message: 'Message unpinned successfully!'});

            setPinned(pre =>
              pre.filter(item => item._id !== res.data.message._id),
            );

            setPinnedCount({
              ...pinnedCount,
              [chat?._id]: pinnedCount[chat?._id] - 1,
            });
          }
          dispatch(updatePinnedMessage(res.data.message));
          dispatch(setMessageOptionData(null));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const pastMessage = localMessages?.length
      ? localMessages[index + 1]
      : messages[chat?._id][index + 1];
    const isSameDate =
      new Date(item?.createdAt).toDateString() ===
      new Date(pastMessage?.createdAt).toDateString()
        ? true
        : false;

    return (
      <>
        <Message item={{...item, isSameDate}} setViewImage={setViewImage} />
      </>
    );
  };

  if (pinnedScreenVisible && pinned.length) {
    return (
      <PinnedMessagesScreen
        messageOptionData={{...messageOptionData, pinnedScreenVisible}}
        pinned={pinned}
        setPinnedScreenVisible={() => setPinnedScreenVisible(pre => !pre)}
        handlePin={handlePin}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}>
      <View
        style={[
          {
            flex: 1,
            paddingTop: top / 1.5,
          },
        ]}>
        {!messageOptionData?.parentMessage && messageOptionData?._id && (
          <MessageOptionModal
            handlePin={handlePin}
            messageOptionData={{...messageOptionData, pinnedScreenVisible}}
          />
        )}

        <MessageTopPart
          fetchPinned={fetchPinned}
          setPinnedScreenVisible={() => setPinnedScreenVisible(pre => !pre)}
          from={route?.params?.from}
        />
        <View style={styles.flatListContainer}>
          {viewInitialMessage && !localMessages.length && (
            <EmptyMessageContainer chat={chat} />
          )}

          {chat?.isArchived ? (
            <ArchivedMessageContainer chat={chat} />
          ) : (
            <FlatList
              removeClippedSubviews
              data={localMessages?.length ? localMessages : messages[chat?._id]}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()} // Ensure string return
              onEndReached={!chat?.isArchived ? () => handleLoadMore() : null}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                ListFooterComponent({
                  isLoading,
                  page,
                  styles,
                  Colors,
                })
              }
              inverted={true}
            />
          )}
        </View>
        {chat?.myData?.role !== 'owner' && chat?.isReadOnly ? (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyText}>This is read only crowd</Text>
          </View>
        ) : chat?.isArchived ? (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyText}>Channel archived</Text>
          </View>
        ) : (
          // <ChatFooter3 />
          <>
            {/* <ChatFooter2
              chatId={chat?._id}
              setMessages={(chatId, message) => {
                const typedMessage: IMessage = message as any;
                setMessages({
                  ...messages,
                  [chatId]: [...(messages[chatId] || []), typedMessage],
                });
              }}
              messageEditVisible={messageEditVisible}
              setMessageEditVisible={setMessageEditVisible}
            /> */}
            <ChatInputContainer chatId={chat._id} />
          </>
        )}
        <ImageView
          images={viewImage}
          imageIndex={viewImage[0]?.index}
          visible={viewImage?.length !== 0}
          onRequestClose={() => setViewImage([])}
        />

        {forwardInfo?.forwardModalVisible && <MessageForwardModal />}
        {newEventData?.isModalVisible && <AddNewEventModalV2 />}
      </View>
    </KeyboardAvoidingView>
  );
};

export default React.memo(MessageScreen);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    readOnlyText: {
      color: Colors.Red,
    },
    readOnlyContainer: {
      backgroundColor: Colors.LightRed,
      padding: 10,
      borderRadius: 10,
      margin: 10,
      marginBottom: 20,
      alignItems: 'center',
    },
    flatListContainer: {
      backgroundColor: Colors.Foreground,
      flex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
    },

    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    initialFooter: {
      height: responsiveScreenHeight(80),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {MaterialIcon} from '../../constants/Icons';
// import {useNavigation} from '@react-navigation/native';

// const MessageScreen = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       <MaterialIcon
//         onPress={() => {
//           navigation.goBack();
//         }}
//         name="cancel"
//         size={30}
//       />
//       <Text>MessageScreen</Text>
//     </View>
//   );
// };

// export default MessageScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
