// InputFilePreview.tsx - Updated implementation
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import React from 'react';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import AudioMessage from '../AudioMessage';
import FileIcon from '../ThreadCom/FileIcon';
import {TColors} from '../../../types';
import {RegularFonts} from '../../../constants/Fonts';
import {gGap} from '../../../constants/Sizes';
import {OcticonsIcon} from '../../../constants/Icons';
import {RootState} from '../../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {updateChatFooterInfo} from '../../../store/reducer/chatFooterReducer';
import LoadingSmall from '../../SharedComponent/LoadingSmall';

const InputFilePreview = () => {
  const {chatFooterInfo} = useSelector((state: RootState) => state.chatFooter);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const imageRender = ({item}: {item: {url?: string}; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        onPressIn={e => {
          e.stopPropagation();
        }}>
        <Image
          source={{
            uri: item?.url || item?.url,
          }}
          style={[styles.image]}
        />
        <OcticonsIcon
          onPress={(e: any) => {
            e.stopPropagation();
            // if (inputRef && inputRef.current) {
            //   inputRef.current.focus();
            // }

            // Update state after ensuring focus is maintained
            const updated = chatFooterInfo?.files.filter(
              i => i.url !== item.url,
            );
            dispatch(updateChatFooterInfo({files: updated}));
            // // Schedule another focus attempt after the state update completes
            // InteractionManager.runAfterInteractions(() => {
            //   if (inputRef && inputRef.current) {
            //     inputRef.current.focus();
            //   }
            // });
          }}
          name="x-circle"
          size={20}
          color={Colors.Red}
          style={{
            position: 'absolute',
            top: gGap(-5),
            right: gGap(-5),
            zIndex: 111,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderAudio = ({item}: {item: {url: string}}) => {
    return (
      <View
        style={{
          backgroundColor: Colors.Foreground,
          paddingHorizontal: 10,
          borderRadius: 100,
          marginTop: 5,
          width: responsiveScreenWidth(70),
          flexDirection: 'row',
          height: gGap(40),
        }}>
        <AudioMessage
          audioUrl={item.url}
          background={'transparent'}
          color={Colors.BodyText}
        />
        <OcticonsIcon
          onPress={(e: any) => {
            e.stopPropagation();
            // if (inputRef && inputRef.current) {
            //   inputRef.current.focus();
            // }

            // Update state after ensuring focus is maintained
            const updated = chatFooterInfo?.files.filter(
              i => i.url !== item.url,
            );
            dispatch(updateChatFooterInfo({files: updated}));
            // // Schedule another focus attempt after the state update completes
            // InteractionManager.runAfterInteractions(() => {
            //   if (inputRef && inputRef.current) {
            //     inputRef.current.focus();
            //   }
            // });
          }}
          name="x-circle"
          size={20}
          color={Colors.Red}
          style={{
            position: 'absolute',
            top: gGap(-5),
            right: gGap(-5),
            zIndex: 111,
          }}
        />
      </View>
    );
  };

  const renderDocument = ({
    item,
  }: {
    item: {url: string; name: string; size: number};
  }) => {
    // Define a mapping for file types to icons
    const fileIcons = {
      pdf: 'picture-as-pdf',
      doc: 'description',
      docx: 'description',
      xls: 'grid-view',
      xlsx: 'grid-view',
      ppt: 'slideshow',
      pptx: 'slideshow',
      txt: 'text-snippet',
    };

    const fileExtension = item.url.split('.').pop();
    const iconName =
      fileIcons[fileExtension as keyof typeof fileIcons] || 'attach-file';
    const fileSizeInKb = (item.size / 1024).toFixed(2);

    return (
      <View style={styles.documentContainer}>
        <FileIcon file={{type: iconName}} />
        <View style={styles.documentInfo}>
          <Text numberOfLines={1} style={styles.fileName}>
            {item.name}
          </Text>
          <Text
            style={
              styles.fileDetails
            }>{`Type: ${fileExtension?.toUpperCase()}`}</Text>
          <Text style={styles.fileDetails}>{`Size: ${fileSizeInKb} KB`}</Text>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item.url)}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
        <OcticonsIcon
          onPress={(e: any) => {
            e.stopPropagation();
            // if (inputRef && inputRef.current) {
            //   inputRef.current.focus();
            // }

            // Update state after ensuring focus is maintained
            const updated = chatFooterInfo?.files.filter(
              i => i.url !== item.url,
            );
            dispatch(updateChatFooterInfo({files: updated}));
            // // Schedule another focus attempt after the state update completes
            // InteractionManager.runAfterInteractions(() => {
            //   if (inputRef && inputRef.current) {
            //     inputRef.current.focus();
            //   }
            // });
          }}
          name="x-circle"
          size={20}
          color={Colors.Red}
          style={{
            position: 'absolute',
            top: gGap(-5),
            right: gGap(-5),
            zIndex: 111,
          }}
        />
      </View>
    );
  };

  const handleDownload = (url: string) => {
    Linking.openURL(url);
    console.log(`Downloading file from: ${url}`);
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: gGap(20)}}>
      {chatFooterInfo?.isUploading && (
        <LoadingSmall size={30} color={Colors.Primary} />
      )}
      <FlatList
        data={chatFooterInfo?.files}
        renderItem={({item, index}) =>
          item?.type?.startsWith('audio')
            ? renderAudio({item: {url: item.url}})
            : item?.type?.startsWith('image')
            ? imageRender({item, index})
            : renderDocument({item})
        }
        keyExtractor={() => Math.random().toString()}
        contentContainerStyle={styles.container}
        horizontal={true}
        // Maintain focus on key interactions
        keyboardShouldPersistTaps="always"
        // Prevent scroll gestures from triggering keyboard dismiss
        scrollEnabled={(chatFooterInfo?.files ?? []).length > 1}
      />
    </View>
  );
};

export default React.memo(InputFilePreview);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: gGap(10),
      // marginBottom: gGap(10),
      // paddingTop: gGap(10),
      alignItems: 'center',
      // backgroundColor: 'red',
      paddingVertical: gGap(5),
      // zIndex: 1,
    },
    image: {
      width: gGap(70),
      height: gGap(70),
      resizeMode: 'cover',
      borderRadius: 10,
      backgroundColor: Colors.Primary,
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      paddingVertical: 5,
      borderRadius: 8,
      marginVertical: 5,
      paddingHorizontal: 10,
      width: responsiveScreenWidth(70),
    },
    documentInfo: {
      flex: 1,
      marginLeft: 10,
    },
    fileName: {
      fontWeight: '500',
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
    fileDetails: {
      color: Colors.BodyText,
    },
    downloadButton: {
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    downloadButtonText: {
      color: Colors.PureWhite,
      fontWeight: 'bold',
    },
    ImageDownloadIconContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
      backgroundColor: Colors.PureWhite,
      padding: 5,
      borderRadius: 5,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });
