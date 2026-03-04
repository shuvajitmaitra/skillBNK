import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import FileIcon from '../../assets/Icons/FileIcon';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';
import AudioMessage from '../ChatCom/AudioMessage';

type ProgramAttachmentsContainerProps = {
  files: any[];
  setViewImage?: React.Dispatch<
    React.SetStateAction<{uri: string; index: number}[]>
  >;
};

const ProgramAttachmentsContainer = ({
  files,
  setViewImage,
}: ProgramAttachmentsContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: {aspectRatio: number};
  }>({});
  const handleImageLayout = (uri: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  const imageRender = ({item, index}: {item: {url: string}; index: number}) => {
    const {aspectRatio} = imageDimensions[item?.url] || {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          setViewImage && setViewImage(files.map(i => ({uri: i.url, index})))
        }>
        <Image
          source={{
            uri: item?.url,
          }}
          style={[
            styles.image,
            aspectRatio ? {aspectRatio} : {height: responsiveScreenHeight(20)},
          ]}
          onLoad={({nativeEvent}) =>
            handleImageLayout(
              item.url,
              nativeEvent.source.width,
              nativeEvent.source.height,
            )
          }
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
          // paddingVertical: 5,
          width: '100%',
          flexDirection: 'row',
        }}>
        <AudioMessage
          audioUrl={item.url}
          background={'transparent'}
          color={Colors.BodyText}
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
        {/* <MaterialIcons name={iconName} size={40} color={Colors.Gray2} /> */}
        <FileIcon file={{type: iconName}} />
        <View style={styles.documentInfo}>
          <Text style={styles.fileName}>{item.name}</Text>
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
      </View>
    );
  };

  const handleDownload = (url: string) => {
    Linking.openURL(url);
    console.log(`Downloading file from: ${url}`);
  };

  return (
    <FlatList
      data={files}
      renderItem={({item, index}) =>
        item?.type?.startsWith('audio')
          ? renderAudio({item})
          : item?.type?.startsWith('image')
          ? imageRender({item, index})
          : renderDocument({item})
      }
      keyExtractor={item => item.url}
      contentContainerStyle={styles.container}
    />
  );
};

export default ProgramAttachmentsContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      // padding: 10,
      // backgroundColor: 'red',
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
      marginBottom: 5,
      marginTop: 5,
      borderRadius: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      paddingVertical: 5,
      borderRadius: 8,
      marginVertical: 5,
      paddingRight: 10,
      width: '100%',
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
      // backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1,
    },
  });
