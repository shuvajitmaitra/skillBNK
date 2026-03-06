import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {gGap} from '../../../constants/Sizes';
import {RootState} from '../../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {MaterialIcon} from '../../../constants/Icons';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import AiBotIcon from '../../../assets/Icons/AiBotIcon';
import UserIcon from '../../../assets/Icons/UserIcon';
import {TChat} from '../../../types/chat/chatTypes';
import {setForwardInfo} from '../../../store/reducer/chatSlice';
import {handleForwardMessage} from '../../../actions/chatApiCall';
import TextRender from '../../SharedComponent/TextRender';
import {truncateMarkdown} from '../../../utility/markdownUtils';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {markRead, setSingleChat} from '../../../store/reducer/chatReducer';
import {withOpacity} from '../Mention/utils';
import {randomHexColor} from '../../../utility/commonFunction';

const MessageForwardModal = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {forwardInfo} = useSelector((state: RootState) => state.chatSlice);
  console.log('forwardInfo', JSON.stringify(forwardInfo, null, 2));
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {chats} = useSelector((state: RootState) => state.chat);
  const [allChats, setAllChats] = useState<TChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<TChat[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selected, setSelected] = useState<TChat[]>([]);

  useEffect(() => {
    const filteredData = chats.filter(
      (item: TChat) =>
        item._id !== forwardInfo?.chat ||
        !item.isArchived ||
        item?.memberScope === 'custom' ||
        item?.otherUser?.type === 'bot',
    );

    // Map to add isChecked property
    const mappedChats = filteredData.map(chat => ({
      ...chat,
      isChecked: false,
    }));

    setAllChats(mappedChats);
    setFilteredChats(mappedChats);
  }, [chats, forwardInfo?.chat]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredChats(allChats);
    } else {
      const filtered = allChats.filter((chat: TChat) => {
        const name = chat?.isChannel
          ? chat?.name
          : chat?.otherUser?.fullName || 'Bootcampshub User';
        return name.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredChats(filtered);
    }
  }, [searchText, allChats]);

  const handleCheckChat = (id: string, i: TChat) => {
    setFilteredChats(
      filteredChats.map(chat =>
        chat._id === id ? {...chat, isChecked: !chat.isChecked} : chat,
      ),
    );

    setAllChats(
      allChats.map(chat =>
        chat._id === id ? {...chat, isChecked: !chat.isChecked} : chat,
      ),
    );

    if (selectedChats.includes(id)) {
      setSelectedChats(selectedChats.filter(chatId => chatId !== id));
      setSelected(selected.filter(item => item._id !== id));
    } else {
      setSelectedChats([...selectedChats, id]);
      setSelected([...selected, i]);
    }
  };

  const handleForward = () => {
    forwardInfo?.chat && handleForwardMessage(forwardInfo?._id, selectedChats);

    handleCloseModal();
    if (selectedChats.length === 1) {
      dispatch(setSingleChat(selected[0]));
      navigation.navigate('MessageScreen', {from: 'crowd'});
      dispatch(markRead({chatId: selected[0]?._id}));
    }
  };

  const handleCloseModal = () => {
    dispatch(setForwardInfo(null));
  };

  const renderItem = ({item}: {item: TChat}) => {
    const chatName = item?.isChannel
      ? item?.name
      : item?.otherUser?.fullName || 'Bootcampshub User';
    const chatType = item?.isChannel ? 'Crowd' : '';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleCheckChat(item._id, item)}>
        <View style={styles.chatInfo}>
          {item?.isChannel && item?.avatar ? (
            <Image style={styles.profileImage} source={{uri: item?.avatar}} />
          ) : item?.isChannel && !item?.avatar ? (
            <View style={styles.profileImage}>
              <CrowdIcon color={Colors.BodyText} size={24} />
            </View>
          ) : item?.otherUser?.type === 'bot' ? (
            <View style={styles.profileImage}>
              <AiBotIcon color={Colors.BodyText} size={24} />
            </View>
          ) : !item?.isChannel && item?.otherUser?.profilePicture ? (
            <Image
              style={styles.profileImage}
              source={{uri: item?.otherUser.profilePicture}}
            />
          ) : (
            <View style={styles.profileImage}>
              <UserIcon color={Colors.BodyText} size={24} />
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.chatName}>{chatName}</Text>
            {item?.isChannel && <Text style={styles.chatType}>{chatType}</Text>}
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleCheckChat(item._id, item)}>
          <MaterialIcon
            name={item?.isChecked ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color={item?.isChecked ? Colors.Primary : Colors.BodyText}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ReactNativeModal
      isVisible={forwardInfo?.forwardModalVisible}
      onBackdropPress={handleCloseModal}
      style={styles.modal}
      avoidKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Forward To</Text>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.closeButton}>
            <MaterialIcon name="close" size={24} color="#FF7043" />
          </TouchableOpacity>
        </View>

        <View style={styles.urlContainer}>
          <TextRender text={truncateMarkdown(forwardInfo?.text || '')} />
          {/* <Text style={styles.urlText}>[{urlToDisplay}]</Text> */}
          {/* <TouchableOpacity
            onPress={() => {
              // Clear URL action
              console.log('Clear URL');
            }}
            style={styles.clearUrlButton}>
            <MaterialIcon name="close" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          style={[
            styles.forwardButton,
            selectedChats.length === 0 && styles.disabledButton,
          ]}
          onPress={handleForward}
          disabled={selectedChats.length === 0}>
          <Text style={styles.forwardButtonText}>Forward</Text>
          <MaterialIcon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <MaterialIcon name="search" size={20} color={Colors.BodyText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users/crowds..."
            placeholderTextColor={Colors.BodyText}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <FlatList
          data={filteredChats}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          //   ItemSeparatorComponent={}
        />
      </View>
    </ReactNativeModal>
  );
};

export default MessageForwardModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: Colors.Background_color,
      maxHeight: '90%',
      overflow: 'hidden',
      gap: gGap(10),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: gGap(16),
      paddingVertical: gGap(10),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    title: {
      fontSize: gGap(18),
      fontWeight: '600',
      color: Colors.Heading,
    },
    closeButton: {
      width: gGap(30),
      height: gGap(30),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: gGap(15),
      backgroundColor: Colors.Background_color,
    },
    urlContainer: {
      marginHorizontal: gGap(16),
      // borderRadius: gGap(8),
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
    },
    urlText: {
      color: Colors.Heading,
      fontSize: gGap(14),
      flex: 1,
    },
    clearUrlButton: {
      width: gGap(24),
      height: gGap(24),
      borderRadius: gGap(12),
      backgroundColor: '#f44336',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: gGap(8),
    },
    forwardButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      marginHorizontal: gGap(16),
      padding: gGap(12),
      borderRadius: gGap(8),
    },
    disabledButton: {
      backgroundColor: Colors.BorderColor,
    },
    forwardButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: gGap(16),
      marginRight: gGap(8),
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      paddingHorizontal: gGap(12),
      marginHorizontal: gGap(16),
      borderRadius: gGap(8),
      height: gGap(40),
    },
    searchInput: {
      flex: 1,
      color: Colors.BodyText,
      marginLeft: gGap(8),
      height: '100%',
    },
    listContent: {
      paddingHorizontal: gGap(16),
      paddingBottom: gGap(20),
      gap: gGap(5),
    },
    chatItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileImage: {
      width: gGap(40),
      height: gGap(40),
      borderRadius: gGap(20),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: withOpacity(randomHexColor(), 0.2),
      borderColor: withOpacity(randomHexColor(), 0.3),
    },
    nameContainer: {
      marginLeft: gGap(12),
      flex: 1,
    },
    chatName: {
      fontSize: gGap(15),
      fontWeight: '600',
      color: Colors.Heading,
    },
    chatType: {
      fontSize: gGap(12),
      color: Colors.BodyText,
    },
    checkboxContainer: {
      padding: gGap(4),
    },
  });
