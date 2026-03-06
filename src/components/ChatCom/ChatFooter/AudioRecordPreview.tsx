import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateChatFooterInfo } from '../../../store/reducer/chatFooterReducer';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { MaterialIcon, IoniconsIcon } from '../../../constants/Icons';
import { useTheme } from '../../../context/ThemeContext';
import AudioWaveform from './AudioWaveform';
import { borderRadius, fontSizes, gGap } from '../../../constants/Sizes';
import { RootState } from '../../../types/redux/root';
// import { showToast } from '../../HelperFunction';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecordPreview = ({
  uploadChatsFiles,
}: {
  uploadChatsFiles: (agr: any) => void;
}) => {
  const Colors = useTheme();
  const { chatFooterInfo } = useSelector(
    (state: RootState) => state.chatFooter,
  );
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { bottom } = useSafeAreaInsets();
  // Format duration from milliseconds to MM:SS
  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log(
      'chatFooterInfo',
      JSON.stringify(chatFooterInfo?.audioRecordModal, null, 2),
    );
  }, [chatFooterInfo?.audioRecordModal]);

  // Start recording when audioRecordModal is true
  useEffect(() => {
    if (chatFooterInfo?.audioRecordModal && !isRecording) {
      startAudioRecording();
    }

    // Cleanup function to stop recording and remove listeners
    return () => {
      if (isRecording) {
        // audioRecorderPlayer.stopRecorder().catch(error => {
        //   console.error('Cleanup: Failed to stop recording:', error);
        // });
        // audioRecorderPlayer.removeRecordBackListener();
        // setIsRecording(false);
        // setRecordingDuration(0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFooterInfo?.audioRecordModal, isRecording]);

  const startAudioRecording = async () => {
    try {
      // if (isRecording) {
      //   console.log('Recording already in progress');
      //   return;
      // }
      // await audioRecorderPlayer.startRecorder();
      // setIsRecording(true);
      // audioRecorderPlayer.addRecordBackListener(e => {
      //   console.log('Recording update:', JSON.stringify(e, null, 2));
      //   setRecordingDuration(e.currentPosition); // Update duration
      // });
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!isRecording) {
        console.log('No active recording to stop');
        return;
      }

      // const result = await audioRecorderPlayer.stopRecorder();
      // audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);

      // console.log('Recording stopped, file saved at:', result);

      // const formData = new FormData();
      // formData.append('file', {
      //   uri: result,
      //   name: 'recording.mp3',
      //   type: 'audio/mp3',
      // });
      // setRecordingDuration(0);
      // dispatch(updateChatFooterInfo({audioRecordModal: false}));
      // dispatch(updateChatFooterInfo({isUploading: true}));
      // const uploadedFile = await uploadChatsFiles(formData);
      // if (uploadedFile !== undefined && uploadedFile !== null) {
      //   console.log('uploadedFile', JSON.stringify(uploadedFile, null, 2));
      //   dispatch(
      //     updateChatFooterInfo({
      //       files: [...(chatFooterInfo?.files || []), uploadedFile],
      //     }),
      //   );
      //   console.log('Audio uploaded successfully:', uploadedFile);
      // } else {
      //   showToast({message: 'Failed to upload audio file'});
      // }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  const cancelRecording = async () => {
    try {
      if (!isRecording) {
        console.log('No active recording to cancel');
        dispatch(updateChatFooterInfo({ audioRecordModal: false }));
        return;
      }

      // await audioRecorderPlayer.stopRecorder();
      // audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordingDuration(0); // Reset duration
      dispatch(updateChatFooterInfo({ audioRecordModal: false }));

      console.log('Recording canceled');
    } catch (error) {
      console.error('Failed to cancel recording:', error);
      setIsRecording(false);
    }
  };

  return (
    <ReactNativeModal
      onBackdropPress={() => cancelRecording()}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      isVisible={Boolean(chatFooterInfo?.audioRecordModal)}
    >
      <View
        style={{
          backgroundColor: Colors.Background_color,
          paddingBottom: bottom,
          paddingTop: gGap(10),
          gap: gGap(10),
          borderTopRightRadius: gGap(10),
          borderTopLeftRadius: gGap(10),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: gGap(5),
            justifyContent: 'center',
          }}
        >
          <MaterialIcon
            name="keyboard-voice"
            size={25}
            color={Colors.BodyText}
          />
          <Text style={{ color: Colors.Heading, fontSize: fontSizes.body }}>
            Recording an audio clip...
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.Foreground,
            marginHorizontal: gGap(10),
            paddingHorizontal: gGap(10),
            flexDirection: 'row',
            alignItems: 'center',
            gap: gGap(10),
            borderRadius: borderRadius.circle,
            justifyContent: 'space-between',
          }}
        >
          <MaterialIcon
            name="cancel"
            size={25}
            color={Colors.BodyText}
            onPress={cancelRecording}
          />
          <AudioWaveform />
          <Text style={{ color: Colors.BodyText, fontSize: 16 }}>
            {formatDuration(recordingDuration)}
          </Text>
          <IoniconsIcon
            name="checkmark-circle"
            size={25}
            color={Colors.BodyText}
            onPress={stopRecording}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default AudioRecordPreview;
