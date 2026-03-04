import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
import AudioMessage from './AudioMessage';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Images from '../../constants/Images';
import {RootState} from '../../types/redux/root';
import {TFile} from '../../types/chat/messageTypes';
import Loading from '../SharedComponent/Loading';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {updateMQ} from '../../store/reducer/chatSlice';
import TextRender from '../SharedComponent/TextRender';
import {fontSizes, gGap} from '../../constants/Sizes';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';

export default function UserModalVoice({
  handleCreateChat,
}: {
  handleCreateChat: (item: {
    _id: string;
    profilePicture: string;
    fullName: string;
  }) => void;
}) {
  const {chatVoicesInfo} = useSelector((state: RootState) => state.chatSlice);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const [voices, setVoices] = useState<any | null>(null);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    setVoices(chatVoicesInfo);
    return () => setVoices(null);
  }, [chatVoicesInfo]);

  const handleSeeMore = useCallback(() => {
    dispatch(
      updateMQ({
        tab: 'voice',
        type: 'voice',
        page: voices?.page + 1,
        limit: 5,
        query: '',
        chatId: voices?.chatId,
      }),
    );
  }, [voices?.chatId, voices?.page, dispatch]);

  const handleSearch = (val: string) => {
    setSearchText(val);
    if (!val) {
      setVoices(chatVoicesInfo);
      return;
    }

    const filteredMedias = chatVoicesInfo.medias.filter((item: TFile) => {
      const searchLower = val.toLowerCase();
      return (
        item?.text?.toLowerCase().includes(searchLower) ||
        item?.sender?.fullName?.toLowerCase().includes(searchLower)
      );
    });

    setVoices({
      ...chatVoicesInfo,
      medias: filteredMedias,
    });
  };

  const clearSearch = () => {
    setSearchText('');
    setVoices(chatVoicesInfo);
  };

  return (
    <View style={{minWidth: '100%', paddingTop: 10} as any}>
      {voices !== null && (
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            alignItems: 'flex-end',
            marginBottom: gGap(10),
          }}>
          <TextInput
            style={{
              backgroundColor: Colors.Foreground,
              width: '100%',
              height: 40,
              borderRadius: gGap(10),
              borderWidth: 1,
              paddingHorizontal: gGap(10),
              borderColor: Colors.BorderColor,
              color: Colors.BodyText,
            }}
            placeholder="Search by sender name or text..."
            placeholderTextColor={Colors.BodyText}
            onChangeText={handleSearch}
            value={searchText}
          />
          {searchText && (
            <TouchableOpacity
              onPress={clearSearch}
              style={{position: 'absolute', right: gGap(10)}}>
              <CrossCircle />
            </TouchableOpacity>
          )}
        </View>
      )}

      {voices === null ? (
        <Loading />
      ) : (
        <>
          {voices.medias?.length > 0 ? (
            voices.medias.map((item: TFile) => (
              <View
                key={item._id}
                style={{
                  minWidth: '100%',
                  justifyContent: 'center',
                  marginBottom: gGap(10),
                  backgroundColor: Colors.Foreground,
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                  padding: gGap(10),
                  borderRadius: gGap(10),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    item?.sender?._id &&
                      handleCreateChat({
                        _id: item?.sender?._id,
                        profilePicture: item?.sender?.profilePicture || '',
                        fullName: item?.sender?.fullName,
                      });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: gGap(10),
                  }}>
                  <Image
                    style={{
                      width: gGap(30),
                      height: gGap(30),
                      backgroundColor: Colors.Foreground,
                      borderRadius: 100,
                    }}
                    source={
                      item?.sender?.profilePicture
                        ? {uri: item.sender.profilePicture}
                        : Images.DEFAULT_IMAGE
                    }
                  />
                  <Text
                    style={{
                      color: Colors.Heading,
                      fontFamily: CustomFonts.SEMI_BOLD,
                      fontSize: fontSizes.body,
                    }}>
                    {item.sender?.fullName}
                  </Text>
                  <Text
                    style={{
                      color: Colors.BodyText,
                      fontSize: fontSizes.small,
                    }}>
                    {moment(item?.createdAt).format('LLL')}
                  </Text>
                </TouchableOpacity>

                <TextRender text={item?.text} />
                <View style={{marginTop: !item.text ? gGap(8) : undefined}}>
                  <AudioMessage
                    background={Colors.Primary}
                    audioUrl={item.url}
                  />
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                minHeight: responsiveScreenHeight(30),
                minWidth: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.PrimaryOpacityColor,
                borderRadius: 10,
                marginBottom: responsiveScreenHeight(2),
              }}>
              <NoDataIcon />
            </View>
          )}
        </>
      )}

      {!searchText && voices?.medias?.length < voices?.totalCount && (
        <GlobalSeeMoreButton onPress={handleSeeMore} buttonStatus={false} />
      )}
    </View>
  );
}
