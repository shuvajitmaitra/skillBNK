import React, {useState, useEffect, useCallback, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setGalleryOpen} from '../../store/reducer/chatReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import HorizontalLineIcon from '../../assets/Icons/HorizontalLine';
import SendIcon from '../../assets/Icons/SendIcon';
import ChatMessageInput from './ChatMessageInput';

const Gallery = ({
  // setSelectedImage,
  UploadFile,
  selected,
  setSelected,
  setAllFiles,
  chat,
  isChannel,
  text,
  setText,
  handleKey,
  sendMessage,
}) => {
  const {galleryOpen} = useSelector(state => state.chat);
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [allMedias, setAllMedias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const {showAlert} = useGlobalAlert();
  const [selectedImages, setSelectedImages] = useState([]);
  const translateY = useState(new Animated.Value(0))[0];
  const [onFocus, setOnFocus] = useState(true);

  const getAlbums = useCallback(async afterId => {
    setLoading(true);
    let {status} = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      let media = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo'],
        sortBy: 'creationTime',
        first: 52,
        after: afterId,
      });

      setAfter(media.endCursor);
      setHasMore(media.hasNextPage);

      if (media?.assets?.length) {
        const assetsWithFilePaths = await Promise.all(
          media.assets.map(async asset => {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            return {
              ...asset,
              uri: assetInfo.localUri || assetInfo.uri,
            };
          }),
        );
        setAllMedias(prevMedias => [...prevMedias, ...assetsWithFilePaths]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (galleryOpen) {
      getAlbums(null);
    }
  }, [galleryOpen, getAlbums]);

  const loadMoreImages = () => {
    if (hasMore && !loading) {
      getAlbums(after);
    }
  };

  const closeGallery = () => {
    dispatch(setGalleryOpen(false));
  };

  const toggleSelectImage = (item, index) => {
    const isSelected = selectedImages.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedImages(selectedImages.filter(i => i.id !== item.id));
      setAllFiles(prev => prev.filter((item, i) => i !== index));
    } else {
      setSelectedImages([
        ...selectedImages,
        {...item, index: selectedImages.length + 1},
      ]);
      UploadFile([item]);
    }
  };

  const renderItem = ({item, index}) => {
    const isSelected = selectedImages.find(i => i.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.imageContainer, isSelected && styles.selectedImage]}
        onPress={() => toggleSelectImage(item, index)}>
        <Image source={{uri: item.uri}} style={styles.image} />
        {isSelected && (
          <View style={styles.indexOverlay}>
            <Text style={styles.indexText}>
              {selectedImages.findIndex(i => i.id === item.id) + 1}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderImagePreview = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.imagePreviewContainer}
        onPress={() => toggleSelectImage(item, index)}>
        <Image source={{uri: item.uri}} style={styles.imagePreview} />
        <TouchableOpacity
          onPress={() => toggleSelectImage(item, index)}
          style={styles.crossIconContainer}>
          <CrossCircle color={Colors.BodyText} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationY: translateY}}],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationY > 150) {
        closeGallery();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
        <View style={styles.closeContainer}>
          <HorizontalLineIcon />
        </View>
        {loading && allMedias.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.Primary} />
        ) : (
          <>
            {onFocus && (
              <FlatList
                data={allMedias}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={4}
                onEndReached={loadMoreImages}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loading ? (
                    <ActivityIndicator size="small" color={Colors.Primary} />
                  ) : null
                }
              />
            )}
          </>
        )}
        {selectedImages.length > 0 && (
          <View>
            <FlatList
              horizontal={true}
              data={selectedImages}
              renderItem={renderImagePreview}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={<View style={{width: 10}}></View>}
            />

            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => closeGallery()}>
                <CrossCircle color={Colors.SecondaryButtonBackgroundColor} />
              </TouchableOpacity>
              <View style={styles.inputField}>
                <ChatMessageInput
                  chat={chat}
                  isChannel={isChannel}
                  text={text}
                  setText={setText}
                  handleKey={handleKey}
                  maxHeight={200}
                />
              </View>
              {/* <TextInput onFocus={() => setOnFocus(false)} style={styles.inputField} /> */}
              <TouchableOpacity
                onPress={() => sendMessage()}
                style={styles.buttonContainer}>
                <SendIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default memo(Gallery);

const getStyles = Colors =>
  StyleSheet.create({
    closeContainer: {
      backgroundColor: Colors.BodyText,
      alignItems: 'center',
    },
    inputField: {
      backgroundColor: Colors.Foreground,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0.8,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 100,
    },
    bottomSection: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: 'skyblue',
      bottom: 0,
      position: 'absolute',
    },
    buttonContainer: {
      // backgroundColor: Colors.Primary,
      alignSelf: 'center',
      borderRadius: 10,
      flex: 0.1,
    },
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: RegularFonts.HR,
    },
    container: {
      height: 500,
      position: 'relative',
    },
    imageContainer: {
      flex: 1,
      margin: 2,
      position: 'relative',
    },
    selectedImage: {
      opacity: 0.6,
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    imagePreview: {
      width: 80,
      height: 100,
      resizeMode: 'cover',
    },
    imagePreviewContainer: {
      backgroundColor: Colors.Background_color,
      paddingTop: 10,
      position: 'relative',
      marginBottom: 50,
    },
    crossIconContainer: {
      position: 'absolute',
      top: 0,
      right: -10,
    },
    indexOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    indexText: {
      color: Colors.PureWhite,
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
