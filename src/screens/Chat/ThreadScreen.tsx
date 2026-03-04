import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setThreadMessages} from '../../store/reducer/chatSlice';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';
import ScreenHeader from '../../components/SharedComponent/ScreenHeader';
import ThreadMessageItem from '../../components/ChatCom/ThreadMessageItem';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';
import Loading from '../../components/SharedComponent/Loading';
import {getReplies, getSingleMessage} from '../../actions/apiCall';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import {setSingleMessage} from '../../store/reducer/chatReducer';
import {RootState} from '../../types/redux/root';
import {IMessage} from '../../types/chat/messageTypes';
import Message from '../../components/ChatCom/Message';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import AddNewEventModalV2 from '../../components/CalendarV2/AddNewEventModalV2';

const ThreadScreen = ({
  route,
}: {
  route: {
    params: {parentMessage?: string; chat?: string};
  };
}) => {
  const {parentMessage, chat} = route.params;
  const dispatch = useDispatch();
  const {threadMessages} = useSelector((state: RootState) => state.chatSlice);
  const {singleMessage: chatMessage, singleChat} = useSelector(
    (state: RootState) => state.chat,
  );
  const {newEventData} = useSelector((state: RootState) => state.calendarV2);
  const {messageOptionData} = useSelector((state: RootState) => state.modal);
  const Colors = useTheme();
  const {top} = useSafeAreaInsets();
  const scrollViewRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageEditVisible, setMessageEditVisible] = useState(false);

  useEffect(() => {
    getReplies({setIsLoading, page: 1, chat, parentMessage});
    getSingleMessage(parentMessage);

    return () => {
      dispatch(setThreadMessages([]));
      dispatch(setMessageOptionData(null));
      dispatch(setSingleMessage(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleScrollToEnd = () => {
  //   setTimeout(() => {
  //     scrollViewRef.current?.scrollToEnd({animated: true});
  //   }, 100);
  // };

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const nextMessage = threadMessages[index - 1];
    const isSameDate =
      new Date(item?.createdAt).toDateString() ===
      new Date(nextMessage?.createdAt).toDateString();

    return (
      <>
        <Message key={item._id} item={{...item, isSameDate}} />
      </>
    );
  };

  const renderLoading = () => {
    if (isLoading) {
      return (
        <View style={{height: 500}}>
          <Loading backgroundColor={'transparent'} />
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <NoDataAvailable />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <ThreadMessageItem
        message={chatMessage}
        replyCount={threadMessages.length || chatMessage?.replyCount || 0}
        isLoading={isLoading}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Foreground,
        paddingTop: top / 1.1,
        paddingBottom: 5,
      }}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: Colors.Foreground}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        {messageOptionData?._id && (
          <MessageOptionModal
            handlePin={() => {}}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
            isThread={parentMessage}
          />
        )}
        <ScreenHeader />

        <FlatList
          ref={scrollViewRef}
          ListHeaderComponent={renderHeader}
          data={threadMessages}
          renderItem={renderItem}
          ListEmptyComponent={renderLoading}
          keyExtractor={item => item._id}
          // onContentSizeChange={
          //   threadMessages.length > 0 ? handleScrollToEnd : () => {}
          // }
          // onLayout={threadMessages.length > 0 ? handleScrollToEnd : () => {}}
          // maintainVisibleContentPosition={{minIndexForVisible: 0}}
        />

        {singleChat?.myData?.role !== 'owner' && singleChat?.isReadOnly ? (
          <View
            style={{
              backgroundColor: Colors.LightRed,
              padding: 10,
              borderRadius: 10,
              margin: 10,
              marginBottom: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.Red,
              }}>
              This is read only crowd
            </Text>
          </View>
        ) : singleChat?.isArchived ? (
          <View
            style={{
              backgroundColor: Colors.LightRed,
              padding: 10,
              borderRadius: 10,
              margin: 10,
              marginBottom: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.Red,
              }}>
              Channel archived
            </Text>
          </View>
        ) : (
          <ChatFooter2
            parentId={parentMessage}
            chatId={chat}
            messageEditVisible={messageEditVisible}
            setMessageEditVisible={setMessageEditVisible}
            // onNewMessageSent={getReplies}
          />
        )}

        {newEventData?.isModalVisible && <AddNewEventModalV2 />}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ThreadScreen;
