// src/components/FileUploader.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import { useGlobalAlert } from './GlobalAlertContext';
import { useTheme } from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import { getFileTypeFromUri } from '../TechnicalTestCom/TestNow'; // Adjusted import path
import axiosInstance from '../../utility/axiosInstance';
import { TColors } from '../../types';

// Define the props type for FileUploader
interface FileUploaderProps {
  setAttachments: React.Dispatch<React.SetStateAction<string[]>>;
  attachments: string[];
  maxFiles?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  setAttachments,
  attachments,
  maxFiles = 5,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { showAlert } = useGlobalAlert();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const UploadAnyFile = async () => {
    try {
      const results = await pick({
        type: [types.images, types.pdf, types.doc, types.docx],
        allowMultiSelection: true, // Multi-selection support
      });

      if (results.length + attachments.length > maxFiles) {
        return showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: `Maximum ${maxFiles} files can be uploaded`,
        });
      }

      console.log('Selected files:', JSON.stringify(results, null, 2));

      setIsUploading(true);

      const uploadPromises = results.map(async file => {
        try {
          console.log('Processing file:', JSON.stringify(file, null, 2));

          const data = {
            uri: file.uri,
            name:
              file.name ||
              `uploaded_file.${file.name?.split('.').pop() || 'bin'}`,
            type: file.type || 'application/octet-stream',
          };

          console.log('Form Data:', JSON.stringify(data, null, 2));

          const formData = new FormData();
          formData.append('file', data as any); // Casting if necessary

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post(
            '/document/userdocumentfile',
            formData,
            config,
          );

          if (res?.data?.fileUrl) {
            return res.data.fileUrl;
          } else {
            console.error('No file URL returned from server');
            return null;
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          return null;
        }
      });

      let uploadedFiles = await Promise.all(uploadPromises);
      uploadedFiles = uploadedFiles.filter(
        (file): file is string => file !== null,
      );

      // Now setAttachments accepts a callback updater function.
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err: any) {
      if (err) {
        console.log('User cancelled document picker');
      } else {
        console.error('Unknown error:', err);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = (uri: string) => {
    setAttachments(prev => prev.filter(item => item !== uri));
  };

  return (
    <View>
      <View style={styles.fieldContainer}>
        <Text style={styles.idStyle}>Upload Attachment (Optional)</Text>
        <TouchableOpacity
          onPress={UploadAnyFile}
          style={styles.attachment}
          disabled={isUploading}
        >
          <Text style={styles.uploadText}>Upload Attachment</Text>
          {isUploading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator color={Colors.Primary} size="large" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.attachmentText}>Upload JPEG/PNG/PDF/Docs file</Text>
      </View>

      <View
        style={[
          styles.docPreview,
          {
            marginVertical: responsiveScreenHeight(
              attachments.length ? 1.5 : 0,
            ),
          },
        ]}
      >
        {attachments.map(item => (
          <View key={item} style={{ position: 'relative' }}>
            {getFileTypeFromUri(item) === 'image' ? (
              <Image
                style={styles.previewImage}
                source={{ uri: item }}
                resizeMode="cover"
              />
            ) : getFileTypeFromUri(item) === 'pdf' ? (
              <Image
                style={styles.previewImage}
                source={require('../../assets/Images/pdf.png')}
                resizeMode="cover"
              />
            ) : (
              <Image
                style={styles.previewImage}
                source={require('../../assets/Images/doc.png')}
                resizeMode="cover"
              />
            )}
            <TouchableOpacity
              onPress={() => removeDocument(item)}
              style={styles.crossCircle}
            >
              <CrossCircle color={Colors.Red} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
    },
    idStyle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      marginTop: responsiveScreenWidth(3),
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: 'dashed',
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    attachmentText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    docPreview: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    crossCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.Background_color,
      position: 'absolute',
      top: -10,
      right: -10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activityIndicator: {
      position: 'absolute',
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImage: {
      height: 100,
      width: 100,
      borderRadius: 8,
    },
  });

export default FileUploader;
