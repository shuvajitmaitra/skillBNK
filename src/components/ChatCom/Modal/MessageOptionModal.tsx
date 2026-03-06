import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setMessageOptionData} from '../../../store/reducer/ModalReducer';
import {handleDelete, onEmojiClick} from '../../../actions/apiCall';
import BinIcon from '../../../assets/Icons/BinIcon';
import EditIconTwo from '../../../assets/Icons/EditIcon2';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import Divider from '../../SharedComponent/Divider';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTheme} from '../../../context/ThemeContext';
import MessageIcon from '../../../assets/Icons/MessageIcon';
import {useNavigation} from '@react-navigation/native';
import ReactNativeModal from 'react-native-modal';
import {TColors} from '../../../types';
import {
  setForwardInfo,
  setSelectedMessage,
} from '../../../store/reducer/chatSlice';
import ConfirmationModal from '../../SharedComponent/ConfirmationModal';
import ForwardIcon from '../../../assets/Icons/ForwardIcon';
import {gFontSize, gGap} from '../../../constants/Sizes';
import {removeLinkMarkdown} from '../../HelperFunction';
import {RootState} from '../../../types/redux/root';

type MessageOptionModalProps = {
  handlePin: (id: string) => void;
  setMessageEditVisible: (message: any | null) => void;
  messageOptionData: any;
  isThread?: string;
};
const MessageOptionModal = ({
  handlePin,
  setMessageEditVisible,
  messageOptionData = {},
  isThread = '',
}: MessageOptionModalProps) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleChat} = useSelector((state: RootState) => state.chat);
  const copyToClipboard = () => {
    Clipboard.setString(removeLinkMarkdown(messageOptionData?.text));
  };
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  if (!singleChat._id || !messageOptionData._id) {
    return;
  }
  const data = [
    {
      label: 'Reply in thread',
      value: 'thread',
      icon: <MessageIcon />,
      function: () => {
        navigation.navigate('ThreadScreen', {
          parentMessage: messageOptionData._id,
          chat: messageOptionData.chat,
        });
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: messageOptionData?.pinnedBy ? 'Unpin Message' : 'Pin Message',
      value: 'pin',
      icon: <NewPinIcon />,
      function: () => handlePin(messageOptionData._id),
    },
    {
      label: 'Forward this message',
      value: 'forward',
      icon: <ForwardIcon />,
      function: () => {
        setTimeout(() => {
          dispatch(
            setForwardInfo({...messageOptionData, forwardModalVisible: true}),
          );
        }, 10);
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Delete this message',
      value: 'delete',
      icon: <BinIcon />,
      function: () => {
        setIsDeleteModalVisible(!isDeleteModalVisible);
      },
    },
    {
      label: 'Edit this message',
      value: 'edit',
      icon: <EditIconTwo />,
      function: () => {
        dispatch(setSelectedMessage(messageOptionData));
        setMessageEditVisible(messageOptionData);
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Copy this message',
      value: 'copy',
      icon: <CopyIcon />,
      function: () => {
        copyToClipboard();
        dispatch(setMessageOptionData(null));
      },
    },
  ];

  const optionData1 = isThread
    ? data.filter(
        item =>
          item.value !== 'thread' &&
          item.value !== 'pin' &&
          item.value !== 'forward',
      )
    : singleChat.isReadOnly
    ? data.filter(item => item.value !== 'thread')
    : data;
  const optionData2 = messageOptionData.pinnedScreenVisible
    ? optionData1.filter(item => item.value !== 'edit')
    : optionData1;

  let emojies = [
    {
      name: 'like',
      symbol: '👍',
    },
    {
      name: 'lovely',
      symbol: '😍',
    },
    // {
    //   name: 'love',
    //   symbol: '❤️', //From app
    // },
    {
      name: 'love',
      symbol: '❤', // From portal
    },
    {
      name: 'luffing',
      symbol: '😂',
    },
    {
      name: 'cute',
      symbol: '🥰',
    },
    {
      name: 'wow',
      symbol: '😯',
    },
  ];

  const withMyEmoji = emojies.map(item =>
    item.symbol === messageOptionData?.myReaction ? {...item, my: true} : item,
  );

  const opponentOption = optionData2.filter(
    item => item.value !== 'delete' && item.value !== 'edit',
  );
  const filteredOption = !messageOptionData?.my
    ? opponentOption
    : messageOptionData?.text?.length === 0
    ? optionData2?.filter(
        item => item.value !== 'edit' && item.value !== 'copy',
      )
    : optionData2;

  const renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        onPress={item.function}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        {item?.icon}
        <Text style={{color: Colors.BodyText, fontSize: 20}}>
          {item?.label || 'Unavailable'}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderSeparator = () => {
    return (
      <Divider
        style={{backgroundColor: Colors.BodyText}}
        marginTop={1.5}
        marginBottom={1.5}
      />
    );
  };
  return (
    <ReactNativeModal
      isVisible={Boolean(messageOptionData)}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={() => dispatch(setMessageOptionData(null))}
      animationIn="slideInUp"
      // swipeDirection={'down'}
      animationInTiming={500}
      onSwipeStart={() => {
        dispatch(setMessageOptionData(null));
      }}
      statusBarTranslucent={true}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => dispatch(setMessageOptionData(null))}>
          <View style={styles.header} />
        </TouchableOpacity>
        {
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: 'blue',
              marginBottom: 20,
              width: '100%',
            }}>
            {withMyEmoji.map(item => (
              <TouchableOpacity
                onPress={() => {
                  onEmojiClick(
                    item.symbol,
                    messageOptionData._id,
                    messageOptionData,
                  );
                  dispatch(setMessageOptionData(null));
                }}
                style={{
                  backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  borderRadius: 100,
                  width: gGap(50), // Fixed width for each box
                  height: gGap(50), // Equal height to maintain square shape
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                key={item.name}>
                <Text style={{fontSize: gFontSize(25)}}>{item.symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        <FlatList
          data={filteredOption}
          renderItem={renderItem}
          keyExtractor={() => Math.random().toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
      {isDeleteModalVisible && (
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          title={'Delete Message!'}
          description={
            'Do you want to delete the Message? This cannot be undone.'
          }
          okPress={() => {
            setIsDeleteModalVisible(!isDeleteModalVisible);
            if (
              messageOptionData.pinnedBy !== null &&
              messageOptionData?.pinnedScreenVisible
            ) {
              handlePin(messageOptionData._id);
            }
            handleDelete(messageOptionData._id);
            dispatch(setMessageOptionData(null));
          }}
          cancelPress={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
        />
      )}
    </ReactNativeModal>
  );
};

export default MessageOptionModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: Colors.LineColor,
      height: 8,
      borderRadius: 100,
      width: 50,
      marginBottom: 10,
      alignSelf: 'center',
    },
    container: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      paddingTop: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
    },
    emojiBox: {},
    emoji: {},
  });
