import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import {RootState} from '../../../types/redux/root';
import {useTheme} from '../../../context/ThemeContext';
import {setMessageOptionData} from '../../../store/reducer/ModalReducer';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import MessageIcon from '../../../assets/Icons/MessageIcon';
import BinIcon from '../../../assets/Icons/BinIcon';
import {handleDelete, onEmojiClick} from '../../../actions/apiCall';
import EditIconTwo from '../../../assets/Icons/EditIcon2';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import Divider from '../../SharedComponent/Divider';
import {TColors} from '../../../types';
// type MessageOptionSheetProps = {
//   handlePin: (id: string) => void;
//   setMessageEditVisible: (message: any | null) => void;
//   messageOptionData: any;
//   isThread?: string;
// };
const MessageOptionSheet = () => {
  const {messageOptionData} = useSelector((s: RootState) => s.modal);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const copyToClipboard = () => {
    Clipboard.setString(messageOptionData?.text);
  };
  const navigation = useNavigation<any>();
  const handlePin = (id: string) => {
    console.log('id', JSON.stringify(id, null, 2));
  };

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
      label: 'Delete this message',
      value: 'delete',
      icon: <BinIcon />,
      function: () => {
        handleDelete(messageOptionData._id);
        dispatch(setMessageOptionData(null));
      },
    },
    {
      label: 'Edit this message',
      value: 'edit',
      icon: <EditIconTwo />,
      function: () => {
        // setMessageEditVisible(messageOptionData);
        dispatch(setMessageOptionData({...messageOptionData, MEVisible: true}));
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

  const optionData = messageOptionData.isThread
    ? data.filter(item => item.value !== 'thread' && item.value !== 'pin')
    : data;

  let emojies = [
    {
      name: 'like',
      symbol: '👍',
    },
    {
      name: 'lovely',
      symbol: '😍',
    },
    {
      name: 'love',
      symbol: '❤️',
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

  const opponentOption = optionData.filter(
    item => item.value !== 'delete' && item.value !== 'edit',
  );
  const filteredOption = !messageOptionData?.my
    ? opponentOption
    : messageOptionData?.text?.length === 0
    ? optionData?.filter(item => item.value !== 'edit' && item.value !== 'copy')
    : optionData;

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
      isVisible={Boolean(messageOptionData.isVisible)}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={() =>
        dispatch(setMessageOptionData({...messageOptionData, isVisible: false}))
      }
      onSwipeStart={() => {
        dispatch(setMessageOptionData(null));
      }}>
      <View style={styles.container}>
        <View style={styles.header} />
        {!messageOptionData.isThread && (
          <View style={styles.emojiBox}>
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
                style={[
                  styles.emoji,
                  messageOptionData.my && {
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  },
                ]}
                key={item.name}>
                <Text style={{fontSize: 25}}>{item.symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <FlatList
          data={filteredOption}
          renderItem={renderItem}
          keyExtractor={() => Math.random().toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </ReactNativeModal>
  );
};

export default MessageOptionSheet;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: Colors.Background_color,
      height: 8,
      borderRadius: 100,
      width: 50,
      marginBottom: 10,
      alignSelf: 'center',
    },
    container: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
    },
    emojiBox: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between',
      // backgroundColor: 'blue',
      marginBottom: 20,
    },
    emoji: {
      padding: responsiveScreenWidth(3),
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
    },
  });
