import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {useDispatch, useSelector} from 'react-redux';
import {fontSizes, gGap} from '../../constants/Sizes';
import {updateMQ} from '../../store/reducer/chatSlice';
import ImageView from 'react-native-image-viewing';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {TFile} from '../../types/chat/messageTypes';
import Images from '../../constants/Images';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import Loading from '../SharedComponent/Loading';

const UserModalImageGallery = () => {
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const {chatImagesInfo} = useSelector((state: RootState) => state.chatSlice);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleSeeMore = useCallback(() => {
    dispatch(
      updateMQ({
        tab: 'image',
        type: 'image',
        page: chatImagesInfo.page + 1,
        limit: 9,
        query: '',
        chatId: chatImagesInfo.chatId,
      }),
    );
  }, [chatImagesInfo?.chatId, chatImagesInfo?.page, dispatch]);

  const handleImageSelect = useCallback((itemUrl: string) => {
    setSelectedImages([{uri: itemUrl}]);
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const filteredMedias =
    chatImagesInfo?.medias?.filter((item: TFile) => {
      const searchLower = searchText.toLowerCase();
      return (
        item?.name?.toLowerCase().includes(searchLower) ||
        item?.sender?.fullName?.toLowerCase().includes(searchLower)
      );
    }) || [];

  return (
    <>
      {chatImagesInfo !== null && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by image name or sender..."
            placeholderTextColor={Colors.BodyText}
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <CrossCircle />
            </TouchableOpacity>
          )}
        </View>
      )}
      {chatImagesInfo === null ? (
        <Loading />
      ) : (
        <>
          {filteredMedias.length > 0 ? (
            <View style={styles.galleryContainer}>
              <View style={styles.imageGrid}>
                {filteredMedias.map((item: TFile) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.imageWrapper}
                    onPress={() => handleImageSelect(item.url)}>
                    <Image
                      style={styles.image}
                      source={{uri: item.url}}
                      onError={error => {
                        console.error(
                          `Failed to load image ${item.url}`,
                          error,
                        );
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: gGap(5),
                        position: 'absolute',
                        bottom: gGap(5),
                        paddingTop: gGap(2),
                        left: gGap(5),
                        backgroundColor: Colors.BackDropColor,
                        borderBottomRightRadius: gGap(10),
                        borderBottomLeftRadius: gGap(10),
                        width: '100%',
                      }}>
                      <Image
                        style={{
                          width: gGap(20),
                          height: gGap(20),
                          backgroundColor: Colors.Foreground,
                          borderRadius: 100,
                          margin: gGap(3),
                        }}
                        source={
                          item?.sender?.profilePicture
                            ? {uri: item.sender.profilePicture}
                            : Images.DEFAULT_IMAGE
                        }
                      />
                      <Text
                        style={{
                          color: Colors.PureWhite,
                          fontFamily: CustomFonts.REGULAR,
                          fontSize: fontSizes.small,
                        }}>
                        {moment(item.createdAt).format('ll')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <NoDataIcon />
            </View>
          )}
        </>
      )}

      {!searchText &&
        chatImagesInfo?.medias?.length < chatImagesInfo?.totalCount && (
          <GlobalSeeMoreButton
            onPress={handleSeeMore}
            buttonStatus={false}
            buttonContainerStyle={{marginTop: gGap(10)}}
          />
        )}

      <ImageView
        images={selectedImages}
        imageIndex={0}
        visible={selectedImages.length > 0}
        onRequestClose={() => setSelectedImages([])}
      />
    </>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    searchContainer: {
      width: '100%',
      justifyContent: 'center',
    },
    searchInput: {
      backgroundColor: Colors.Foreground,
      height: 40,
      borderRadius: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingHorizontal: gGap(15),
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },
    clearButton: {
      position: 'absolute',
      right: gGap(10),
    },
    galleryContainer: {
      paddingTop: responsiveScreenHeight(1),
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -gGap(5),
    },
    imageWrapper: {
      width: '33.33%',
      aspectRatio: 1,
      padding: gGap(5),
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: gGap(8),
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    noDataContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 10,
      marginVertical: responsiveScreenHeight(2),
    },
  });

export default UserModalImageGallery;
