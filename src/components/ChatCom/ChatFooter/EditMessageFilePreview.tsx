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

import {TColors} from '../../../types';
import {useTheme} from '../../../context/ThemeContext';
import AudioMessage from '../AudioMessage';
import FileIcon from '../ThreadCom/FileIcon';
import {RegularFonts} from '../../../constants/Fonts';

type EditMessageFilePreviewProps = {
  files: any[];
  setViewImage?: React.Dispatch<React.SetStateAction<{uri: string}[]>>;
};

const EditMessageFilePreview = ({
  files,
  setViewImage,
}: EditMessageFilePreviewProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const imageRender = ({item}: {item: {url: string}}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{paddingVertical: 10}}
        onPress={() => setViewImage && setViewImage([{uri: item?.url}])}>
        <Image
          source={{
            uri: item?.url,
          }}
          style={[styles.image]}
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
          marginVertical: 5,
          paddingVertical: 5,
          width: '100%',
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
    <View style={styles.mainContainer}>
      <FlatList
        data={files}
        renderItem={({item}) =>
          item?.type?.startsWith('audio')
            ? renderAudio({item})
            : item?.type?.startsWith('image')
            ? imageRender({item})
            : renderDocument({item})
        }
        keyExtractor={item => item.url}
        contentContainerStyle={styles.container}
        horizontal={files[0]?.type?.startsWith('image') ? true : false}
      />
    </View>
  );
};

export default EditMessageFilePreview;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    container: {
      gap: 10,
    },
    image: {
      width: 70,
      height: 70,
      resizeMode: 'cover',
      borderRadius: 10,
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      padding: 5,
      borderRadius: 8,
      marginVertical: 5,
      paddingRight: 10,
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
