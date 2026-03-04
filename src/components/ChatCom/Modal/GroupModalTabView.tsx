import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../../constants/CustomFonts';
import UserModalImageGallary from '../UserModalImageGallary';
import GroupModalMembers from './GroupModalMembers';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import UserModalVoice from '../UserModalVoice';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import {updateMQ} from '../../../store/reducer/chatSlice';
import UserModalUploadedFile from '../UserModalUploadedFile';
import {gGap} from '../../../constants/Sizes';
import ChatProfileLinks from '../ChatProfileLinks';
import {showToast} from '../../HelperFunction';
import {setSingleChat} from '../../../store/reducer/chatReducer';
import axiosInstance from '../../../utility/axiosInstance';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';

const GroupModalTabView = () => {
  const {singleChat: chat, chatsObj} = useSelector(
    (state: RootState) => state.chat,
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState<string>(
    chat?.isChannel ? 'Members' : 'Images',
  );
  useEffect(() => {
    if (!chat.isChannel) {
      dispatch(
        updateMQ({
          tab: 'image',
          type: 'image',
          page: 1,
          limit: 9,
          query: '',
          chatId: chat._id,
        }),
      );
    }
  }, [chat._id, chat.isChannel, dispatch]);

  const handleTabStatus = (stat: string) => {
    setStatus(stat);
    if (stat === 'Images') {
      dispatch(
        updateMQ({
          tab: 'image',
          type: 'image',
          page: 1,
          limit: 9,
          query: '',
          chatId: chat._id,
        }),
      );
    } else if (stat === 'Voices') {
      dispatch(
        updateMQ({
          tab: 'voice',
          type: 'voice',
          page: 1,
          limit: 5,
          query: '',
          chatId: chat._id,
        }),
      );
    } else if (stat === 'Files') {
      dispatch(
        updateMQ({
          tab: 'file',
          type: 'file',
          page: 1,
          limit: 5,
          query: '',
          chatId: chat._id,
        }),
      );
    } else if (stat === 'Links') {
      dispatch(
        updateMQ({
          tab: 'link',
          type: 'link',
          page: 1,
          limit: 5,
          query: '',
          chatId: chat._id,
        }),
      );
    }
  };
  const GroupTabLists = chat?.isChannel
    ? [
        {
          status: 'Members',
        },
        {
          status: 'Images',
        },
        {
          status: 'Files',
        },
        {
          status: 'Voices',
        },
        {
          status: 'Links',
        },
      ]
    : [
        // {
        //   status: 'Members',
        // },
        {
          status: 'Images',
        },
        {
          status: 'Files',
        },
        {
          status: 'Voices',
        },
        {
          status: 'Links',
        },
      ];
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'MessageScreen'>
    >();
  const handleCreateChat = async (item: {
    profilePicture: string;
    _id: string;
    fullName: string;
  }) => {
    if (user?._id === item._id) {
      return showToast({message: "It's you"});
    }
    if (chatsObj[item._id]) {
      return dispatch(setSingleChat(chatsObj[item._id]));
    }
    try {
      const res = await axiosInstance.post(`/chat/findorcreate/${item._id}`);
      if (res.data.success) {
        dispatch(
          setSingleChat({
            ...res.data.chat,
            ...chatsObj[res.data.chat?._id],
          }),
        );
        navigation.push('MessageScreen', {from: 'chatProfile'});
      }
    } catch (err: any) {
      console.error('Error creating chat:', err?.response?.data);
    }
  };
  return (
    <View style={[styles.tabViewcontainer]}>
      <View style={styles.tabContainer}>
        {GroupTabLists.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabStatus(tab.status)}>
            <Text
              style={[
                {
                  fontFamily: CustomFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(1.8),
                  color: Colors.BodyText,
                },
                status === tab.status && styles.tabActive,
              ]}>
              {tab.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {status === 'Members' && <GroupModalMembers />}
      {status === 'Images' && <UserModalImageGallary />}
      {status === 'Files' && (
        <UserModalUploadedFile handleCreateChat={handleCreateChat} />
      )}
      {status === 'Voices' && (
        <UserModalVoice handleCreateChat={handleCreateChat} />
      )}
      {status === 'Links' && (
        <ChatProfileLinks handleCreateChat={handleCreateChat} />
      )}
    </View>
  );
};
export default React.memo(GroupModalTabView);
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabViewcontainer: {
      minHeight: responsiveScreenHeight(10),
    },

    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: gGap(20),
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(1),
    },
    tabActive: {
      color: Colors.Primary,
      borderBottomColor: Colors.Primary,
      borderBottomWidth: 2,
      paddingVertical: responsiveScreenWidth(1),
    },
  });
