import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {TFile} from '../../types/chat/messageTypes';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import FileIcon from './ThreadCom/FileIcon';
import {RegularFonts} from '../../constants/Fonts';

const DocumentMessage = ({
  containerStyle,
  file,
}: {
  containerStyle?: ViewStyle;
  file: TFile;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
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

  const fileExtension = file.url.split('.').pop();
  const iconName =
    fileIcons[fileExtension as keyof typeof fileIcons] || 'attach-file';
  const fileSizeInKb = (file.size / 1024).toFixed(2);

  const handleDownload = (url: string) => {
    Linking.openURL(url);
    console.log(`Downloading file from: ${url}`);
  };

  return (
    <View style={{...styles.documentContainer, ...containerStyle}}>
      {/* <MaterialIcons name={iconName} size={40} color={Colors.Gray2} /> */}
      <FileIcon file={{type: iconName}} />
      <View style={styles.documentInfo}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text
          style={
            styles.fileDetails
          }>{`Type: ${fileExtension?.toUpperCase()}`}</Text>
        <Text style={styles.fileDetails}>{`Size: ${fileSizeInKb} KB`}</Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(file.url)}>
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DocumentMessage;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      paddingVertical: 5,
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
  });
