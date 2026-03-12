import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AudioWaveform from './AudioWaveform';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import CheckIconTwo from '../../../assets/Icons/CheckIconTwo';

import {useTheme} from '../../../context/ThemeContext';
import axiosInstance from '../../../utility/axiosInstance';

import {TColors} from '../../../types';
import {showToast} from '../../HelperFunction';
import Sound from 'react-native-nitro-sound';
import {chatInfoProps} from '../ChatInputContainer';
import {withOpacity} from '../Mention/utils';
import {MaterialIcon} from '../../../constants/Icons';

type AudioUploadModalProps = {
  setChatInfo: React.Dispatch<React.SetStateAction<chatInfoProps>>;
  chatInfo: chatInfoProps;
};

const AudioUploadModal = ({chatInfo, setChatInfo}: AudioUploadModalProps) => {
  const [recording, setRecording] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);

  const startAudioRecording = async () => {
    try {
      const result = await Sound.startRecorder();
      setRecording(true);
      Sound.addRecordBackListener(e => {
        console.log('audio record');
        console.log('Recording', e);
        return;
      });
      console.log('Recording started', result);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      setRecording(false);
      Sound.removeRecordBackListener();
      console.log('Recording stopped, file saved at:', result);
      setUploading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: result,
        name: 'recording.mp3',
        type: 'audio/mpeg',
      });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      let response = await axiosInstance.post(
        'settings/video-audio-upload',
        formData,
        config,
      );
      let url = response?.data.url;
      if (!url) {
        return showToast({message: "Audio can't upload"});
      }
      let files = [
        {
          name: 'recording.mp3',
          type: 'audio/mp3',
          size: 2000,
          url: url.slice(8),
        },
      ];
      setChatInfo({...chatInfo, files: [...files, ...chatInfo.files]});
      setRecordModalVisible(!recordModalVisible);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setUploading(false);
    }
  };
  const cancelRecording = async () => {
    try {
      await Sound.stopRecorder();
      setRecording(false);
      Sound.removeRecordBackListener();
      console.log('Recording canceled');
      setRecordModalVisible(!recordModalVisible);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setRecordModalVisible(true);
          startAudioRecording();
        }}
        style={styles.buttonContainer}>
        <MaterialIcon name={'mic'} size={22} color={Colors.BodyText} />
      </TouchableOpacity>
      <Modal
        onRequestClose={() => {
          setRecordModalVisible(!recordModalVisible);
        }}
        visible={recordModalVisible}
        animationType="slide"
        transparent>
        <View style={styles.container}>
          {uploading && (
            <View
              style={{
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.Background_color,
                padding: 25,
              }}>
              <ActivityIndicator />
            </View>
          )}
          {recording && (
            <View
              style={{
                backgroundColor: Colors.Background_color,
                padding: 25,
              }}>
              <View style={styles.containerTwo}>
                <Pressable onPress={cancelRecording}>
                  <CrossCircle color={Colors.Red} size={30} />
                </Pressable>
                <AudioWaveform />
                <Pressable onPress={stopRecording}>
                  <CheckIconTwo />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default AudioUploadModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      padding: 8,
      backgroundColor: withOpacity(Colors.Primary, 0.2),
      borderColor: withOpacity(Colors.Primary, 0.3),
      borderWidth: 1,
      borderRadius: 100,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // paddingVertical: 10,
      // minHeight: 80,
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
      // marginTop: 10,
    },
    containerTwo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors.BodyTextOpacity,
      borderRadius: 40,
    },
    container: {
      flex: 1,
      marginHorizontal: 0,
      padding: 0,
      justifyContent: 'flex-end',
      backgroundColor: withOpacity(Colors.BackDropColor, 0.5),
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#1E90FF',
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
