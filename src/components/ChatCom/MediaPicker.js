import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {useTheme} from '../../context/ThemeContext';
import CheckIconTwo from '../../assets/Icons/CheckIconTwo';
import ImageView from 'react-native-image-viewing';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import LoadingSmall from '../SharedComponent/LoadingSmall';

const MediaPicker = ({
  UploadFile,
  setSelectedImage,
  setSelected,
  selected,
  modalVisible,
  setModalVisible,
}) => {
  const [after, setAfter] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [allMedias, setAllMedias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewImage, setViewImage] = useState([]);

  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const handleModalClose = useCallback(
    () => setModalVisible(false),
    [setModalVisible],
  );

  const changeSelection = useCallback(
    uri => {
      setLoading(true);
      if (!selected.includes(uri)) {
        if (selected.length < 5) {
          setSelected(prev => [...prev, uri]);
          setSelectedImage(prev => [...prev, uri]);
        } else {
          Alert.alert('Cannot select more than 5');
        }
      } else {
        setSelected(prev => prev.filter(x => x !== uri));
        setSelectedImage(prev => prev.filter(x => x !== uri));
      }
      setLoading(false);
    },
    [selected, setSelected, setSelectedImage],
  );

  const getAlbums = useCallback(async afterId => {
    setLoading(true);
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied!');
      setLoading(false);
      return;
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ['photo'],
      sortBy: 'creationTime',
      first: 52,
      after: afterId,
    });

    setAfter(media.endCursor);
    setHasMore(media.hasNextPage);

    const assetsWithFilePaths = await Promise.all(
      media.assets.map(async asset => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
        return {...asset, uri: assetInfo.localUri || assetInfo.uri};
      }),
    );

    setAllMedias(prevMedias => [...prevMedias, ...assetsWithFilePaths]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (modalVisible) getAlbums();
  }, [modalVisible, getAlbums]);

  const handleEndReached = useCallback(() => {
    if (hasMore) getAlbums(after);
  }, [hasMore, after, getAlbums]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => changeSelection(item.uri)}
        style={styles.imageContainer}>
        <Image
          source={{uri: item.uri}}
          containerStyle={styles.media}
          PlaceholderContent={<ActivityIndicator />}
        />
        {selected.includes(item.uri) && (
          <View style={styles.selectedOverlay}>
            <View
              style={{
                backgroundColor: Colors.Primary,
                borderRadius: 100,
                paddingHorizontal: responsiveScreenHeight(0.7),
              }}>
              <Text style={styles.selectedCount}>
                {selected.indexOf(item.uri) + 1}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    ),
    [selected, changeSelection, styles],
  );

  return (
    <>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleModalClose}>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {loading ? (
                  <View style={styles.center}>
                    <LoadingSmall size={50} color={Colors.Primary} />
                  </View>
                ) : (
                  <View style={{flex: 1}}>
                    {selected.length > 0 && (
                      <View style={styles.selectedContainer}>
                        <FlatList
                          data={selected}
                          renderItem={({item}) => (
                            <Image style={styles.image} source={{uri: item}} />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.ImageList}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            UploadFile(selected);
                            handleModalClose();
                          }}
                          activeOpacity={0.5}
                          style={styles.sendButton}>
                          <Text style={styles.sendButtonText}>
                            {selected.length}
                          </Text>
                          <CheckIconTwo />
                        </TouchableOpacity>
                      </View>
                    )}
                    <FlatList
                      data={allMedias}
                      style={styles.list}
                      numColumns={3}
                      keyExtractor={item => item.id}
                      initialNumToRender={24}
                      onEndReachedThreshold={0.2}
                      onEndReached={handleEndReached}
                      renderItem={renderItem}
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ImageView
        images={viewImage}
        imageIndex={0}
        visible={viewImage.length !== 0}
        onRequestClose={() => setViewImage([])}
      />
    </>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      height: '75%',
      backgroundColor: Colors.Background_color,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      padding: 10,
    },
    center: {
      justifyContent: 'center',
      flex: 1,
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
    },
    ImageList: {
      flexGrow: 1,
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginVertical: responsiveScreenHeight(1),
      marginHorizontal: responsiveScreenWidth(2),
    },
    imageContainer: {
      height: 120,
      width: responsiveScreenWidth(33),
      position: 'relative',
      flex: 1,
    },
    media: {
      height: '100%',
      width: '100%',
    },
    selectedOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedCount: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    selectedContainer: {
      backgroundColor: Colors.Background_color,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: responsiveScreenWidth(3),
    },
    sendButtonText: {
      color: Colors.Heading,
      padding: 10,
      fontSize: 18,
      fontWeight: 'bold',
    },
    list: {
      width: '100%',
      backgroundColor: Colors.Background_color,
    },
  });

export default MediaPicker;
