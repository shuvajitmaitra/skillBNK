import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable} from 'react-native';
import AudioWaveform from './AudioWaveform';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import CheckIconTwo from '../../../assets/Icons/CheckIconTwo';
import AudioMessage from '../AudioMessage';

import {useTheme} from '../../../context/ThemeContext';
import axiosInstance from '../../../utility/axiosInstance';

import {TColors} from '../../../types';
import {showToast} from '../../HelperFunction';
import Sound from 'react-native-nitro-sound';
import ReactNativeModal from 'react-native-modal';
import {chatInfoProps} from '../ChatInputContainer';
import {withOpacity} from '../Mention/utils';
import {MaterialIcon} from '../../../constants/Icons';

type AudioUploadModalProps = {
  setChatInfo: React.Dispatch<React.SetStateAction<chatInfoProps>>;
  chatInfo: chatInfoProps;
};

const AudioUploadModal = ({chatInfo, setChatInfo}: AudioUploadModalProps) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState('');
  const [recordModalVisible, setRecordModalVisible] = useState<boolean>(false);

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
      setRecordedAudioPath(result);
      Sound.removeRecordBackListener();
      console.log('Recording stopped, file saved at:', result);
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
    }
  };
  const cancelRecording = async () => {
    try {
      await Sound.stopRecorder();
      setRecording(false);
      setRecordedAudioPath('');
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
      <ReactNativeModal
        onBackdropPress={() => {
          setRecordModalVisible(!recordModalVisible);
        }}
        isVisible={recordModalVisible}
        style={{margin: 0, justifyContent: 'flex-end'}}>
        <View style={styles.container}>
          {recording && (
            <View style={styles.containerTwo}>
              <Pressable onPress={cancelRecording}>
                <CrossCircle color={Colors.Red} size={30} />
              </Pressable>
              <AudioWaveform />
              <Pressable onPress={stopRecording}>
                <CheckIconTwo />
              </Pressable>
            </View>
          )}
          {recordedAudioPath && (
            <View style={styles.containerTwo}>
              <AudioMessage
                audioUrl={recordedAudioPath}
                color={Colors.BodyText}
                background={'transparent'}
              />
              <Pressable
                onPress={() => {
                  setRecordedAudioPath('');
                  setRecordModalVisible(false);
                }}>
                <CrossCircle />
              </Pressable>
            </View>
          )}
        </View>
      </ReactNativeModal>
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
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Red,
      // borderRadius: 25,
      // minHeight: 60,
      // gap: 20,
      // paddingHorizontal: 10,
      marginHorizontal: 10,
      padding: 20,
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
