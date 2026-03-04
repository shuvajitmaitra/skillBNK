import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ArrowDown from '../../assets/Icons/ArrowDown';
import CustomFonts from '../../constants/CustomFonts';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
import {useTheme} from '../../context/ThemeContext';
import FileIcon from '../../assets/Icons/FileIcon';
import Loading from '../SharedComponent/Loading';
import {bytesToSize} from './MessageHelper';
import {useDispatch, useSelector} from 'react-redux';
import {borderRadius, fontSizes, gGap, gWidth} from '../../constants/Sizes';
import {updateMQ} from '../../store/reducer/chatSlice';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {RootState} from '../../types/redux/root';
import Images from '../../constants/Images';
import moment from 'moment';
import TextRender from '../SharedComponent/TextRender';
import {truncateMarkdown} from '../../utility/markdownUtils';
import {TColors} from '../../types';

export default function UserModalUploadedFile({
  handleCreateChat,
}: {
  handleCreateChat: (item: {
    _id: string;
    profilePicture: string;
    fullName: string;
  }) => void;
}) {
  const {chatFilesInfo} = useSelector((state: RootState) => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [files, setFiles] = useState<any | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setFiles(chatFilesInfo);
    return () => setFiles(null);
  }, [chatFilesInfo]);

  const handleSeeMore = useCallback(() => {
    dispatch(
      updateMQ({
        tab: 'file',
        type: 'file',
        page: files?.page + 1,
        limit: 5,
        query: '',
        chatId: files?.chatId,
      }),
    );
  }, [files?.chatId, files?.page, dispatch]);

  const handleSearch = (val: string) => {
    setSearchText(val);
    if (!val) {
      setFiles(chatFilesInfo);
      return;
    }

    const filteredMedias = chatFilesInfo.medias.filter((item: any) => {
      const searchLower = val.toLowerCase();
      return (
        item?.text?.toLowerCase().includes(searchLower) ||
        item?.sender?.fullName?.toLowerCase().includes(searchLower)
      );
    });

    setFiles({
      ...chatFilesInfo,
      medias: filteredMedias,
    });
  };

  const clearSearch = () => {
    setSearchText('');
    setFiles(chatFilesInfo);
  };

  return (
    <View>
      {files !== null && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by file name or sender..."
            onChangeText={handleSearch}
            value={searchText}
            placeholderTextColor={Colors.BodyText}
          />
          {searchText && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <CrossCircle />
            </TouchableOpacity>
          )}
        </View>
      )}

      {files === null ? (
        <Loading />
      ) : (
        <View style={{gap: gGap(5)}}>
          {files?.medias?.length > 0 ? (
            files?.medias?.map((item: any, index: number) => (
              <View key={index} style={styles.subContainer}>
                <TouchableOpacity
                  onPress={() => {
                    handleCreateChat({
                      _id: item?.sender?._id,
                      profilePicture: item?.sender.profilePicture,
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
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: gWidth(50), justifyContent: 'center'}}>
                    <FileIcon />
                  </View>

                  <View style={styles.textContainer}>
                    <TextRender text={truncateMarkdown(item?.text, 10) || ''} />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.fileName}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        item.url && Linking.openURL(item.url);
                      }}
                      style={styles.sizeAndDateContainer}>
                      <ArrowDown />
                      <Text style={styles.sizeTimeText}>
                        {bytesToSize(item?.size)}
                      </Text>
                      <Text style={styles.sizeTimeText}>
                        {/* {timeFormate(item?.createdAt)} */}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <NoDataIcon />
            </View>
          )}
        </View>
      )}

      {!searchText && files?.medias?.length < files?.totalCount && (
        <GlobalSeeMoreButton
          buttonContainerStyle={{marginTop: gGap(10)}}
          onPress={handleSeeMore}
          buttonStatus={false}
        />
      )}
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    searchContainer: {
      justifyContent: 'center',
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: gGap(5),
    },
    searchInput: {
      backgroundColor: Colors.Foreground,
      width: '100%',
      height: 40,
      borderRadius: gGap(10),
      borderWidth: 1,
      paddingHorizontal: gGap(10),
      borderColor: Colors.BorderColor,
      color: Colors.Heading,
    },
    clearButton: {
      position: 'absolute',
      right: gGap(10),
    },
    subContainer: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      borderRadius: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    textContainer: {flex: 1, maxWidth: gWidth(275)},
    fileName: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      width: responsiveScreenWidth(60),
      color: Colors.Heading,
      marginBottom: gGap(5),
    },
    sizeAndDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1),
      flexWrap: 'wrap',
      backgroundColor: Colors.Background_color,
      padding: gGap(3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      justifyContent: 'center',
      borderRadius: borderRadius.small,
      marginRight: 'auto',
    },
    sizeTimeText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
    },
    noDataContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 10,
      marginVertical: gGap(15),
    },
  });
