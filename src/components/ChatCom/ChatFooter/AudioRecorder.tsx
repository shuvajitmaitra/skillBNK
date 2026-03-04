import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioWaveform from './AudioWaveform';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import CheckIconTwo from '../../../assets/Icons/CheckIconTwo';
import AudioMessage from '../AudioMessage';
import MicIcon from '../../../assets/Icons/MicIcon';
import ChatMessageInput from '../ChatMessageInput';
import {useTheme} from '../../../context/ThemeContext';
import axiosInstance from '../../../utility/axiosInstance';
import SendIcon from '../../../assets/Icons/SendIcon';
// import LoadingSmall from '../../SharedComponent/LoadingSmall';
import {TColors} from '../../../types';
import AiIcon2 from '../../../assets/Icons/AiIcon2';
import AiModal from '../../SharedComponent/AiModal/AiModal';
import {showToast} from '../../HelperFunction';

const audioRecorderPlayer = new AudioRecorderPlayer();

type FilesProps = {
  name: string;
  type: string;
  size: number;
  url: string;
};

type AudioRecorderProps = {
  setStartRecording: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (txt: string, files: FilesProps[]) => void;
  handleKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chat: any;
  isChannel: boolean;
  parentId: string;
};

const AudioRecorder = ({
  setStartRecording,
  sendMessage,
  handleKey,
  chat,
  isChannel,
  parentId,
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState('');
  const [text, setText] = useState('');
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);

  const sendAudioMessage = async (txt: string, RecordedURI: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: RecordedURI,
      name: 'recording.mp3',
      type: 'audio/mpeg',
    });
    try {
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
      sendMessage(txt, files);
    } catch (error: any) {
      // showAlert({
      //   title: 'Error',
      //   type: 'error',
      //   message: err?.response?.data?.error,
      // });
      // setIsSendingAudio(false);
      console.log(
        'error.response.data',
        JSON.stringify(error.response.data, null, 2),
      );
    }
  };
  const startAudioRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      setStartRecording(true);
      audioRecorderPlayer.addRecordBackListener(e => {
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
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setRecordedAudioPath(result);
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording stopped, file saved at:', result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  const cancelRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setStartRecording(false);
      setRecordedAudioPath('');
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording canceled');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  if (aiModalVisible) {
    return (
      <AiModal
        setState={(txt: string) => setText(txt)}
        state={text}
        isVisible={aiModalVisible}
        onCancelPress={() => setAiModalVisible(prev => !prev)}
      />
    );
  }

  const onAiPress = () => {
    setAiModalVisible(!aiModalVisible);
  };
  return (
    <View
      style={[
        !recording && !recordedAudioPath
          ? {
              position: 'absolute',
              right: '5%',
              // top: '30%',
              // backgroundColor: Colors.CyanOpacity,
              alignItems: 'center',
              justifyContent: 'center',
              // padding: 20,
              // borderRadius: 100,
            }
          : styles.container,
      ]}>
      {!recording && recordedAudioPath && (
        <View style={styles.inputContainer}>
          <ChatMessageInput
            chat={chat}
            handleKey={handleKey}
            isChannel={isChannel}
            text={text}
            setText={setText}
            parentId={parentId}
            maxHeight={200}
            from="audio"
          />
          {
            <View style={text?.length > 0 ? {gap: 10, paddingTop: 10} : {}}>
              {text?.length > 0 && (
                <TouchableOpacity onPress={onAiPress}>
                  <AiIcon2 color={Colors.Primary} size={30} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  sendAudioMessage(text, recordedAudioPath);
                  setRecordedAudioPath('');
                  setText('');
                  setRecording(false);
                  setStartRecording(false);
                }}>
                <SendIcon size={30} />
              </TouchableOpacity>
            </View>
          }
        </View>
      )}
      {!recording && !recordedAudioPath && (
        <>
          {/* {Uploading ? (
            <LoadingSmall size={20} color={Colors.Primary} />
          ) : (
            <TouchableOpacity
              // style={{backgroundColor: 'red', padding: 20}}
              onPress={startAudioRecording}>
              <MicIcon size={25} />
            </TouchableOpacity>
          )} */}
          <TouchableOpacity
            style={{marginBottom: 15}}
            onPress={startAudioRecording}>
            <MicIcon size={25} />
          </TouchableOpacity>
        </>
      )}
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
              setStartRecording(false);
            }}>
            <CrossCircle />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default AudioRecorder;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
      backgroundColor: Colors.Foreground,
      borderRadius: 25,
      // minHeight: 60,
      // gap: 20,
      // paddingHorizontal: 10,
      marginHorizontal: 10,
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
