// StartInterviewModal.tsx

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import { useTheme } from '../../context/ThemeContext';
import Modal from 'react-native-modal';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import MyButton from '../AuthenticationCom/MyButton';
import VideoPlayer from '../ProgramCom/VideoPlayer';
import axios from '../../utility/axiosInstance';
import axiosInstance from '../../utility/axiosInstance';
import { useDispatch } from 'react-redux';
import { updateInterviewAnswer } from '../../store/reducer/InterviewReducer';
import { showAlertModal } from '../../utility/commonFunction';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioMessage from '../ChatCom/AudioMessage';
import CrossCircle from '../../assets/Icons/CrossCircle';
import AudioWaveform from '../ChatCom/ChatFooter/AudioWaveform';
import SendIcon from '../../assets/Icons/SendIcon';
import { TColors, TInterview } from '../../types';
import { showToast } from '../HelperFunction';

// const audioRecorderPlayer = new AudioRecorderPlayer();

type StartInterviewModalProps = {
  interview: TInterview;
  toggleStartModal: () => void;
  isStartModalVisible: boolean;
};

export default function StartInterviewModal({
  interview,
  toggleStartModal,
  isStartModalVisible,
}: StartInterviewModalProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // State variables
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedURI, setRecordedURI] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [uploaded, setUploaded] = useState<number[]>([]);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);

  // Ref to hold the timer interval ID
  const timerRef = useRef<number | null>(null);

  // Helper function to format seconds as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async (): Promise<void> => {
    // try {
    //   const result = await audioRecorderPlayer.startRecorder();
    //   setRecording(true);
    //   // Start the timer to update every second
    //   timerRef.current = setInterval(() => {
    //     setRecordingDuration(prev => prev + 1);
    //   }, 1000);
    //   audioRecorderPlayer.addRecordBackListener(e => {
    //     console.log('Recording', e);
    //     return;
    //   });
    //   console.log('Recording started', result);
    // } catch (error) {
    //   console.error('Failed to start recording:', error);
    // }
  };

  const stopRecording = async (): Promise<void> => {
    // try {
    //   const result = await audioRecorderPlayer.stopRecorder();
    //   setRecording(false);
    //   setRecordedURI(result);
    //   // Clear the timer when recording stops
    //   if (timerRef.current) {
    //     clearInterval(timerRef.current);
    //     timerRef.current = null;
    //   }
    //   audioRecorderPlayer.removeRecordBackListener();
    //   console.log('Recording stopped, file saved at:', result);
    // } catch (error) {
    //   console.error('Failed to stop recording:', error);
    // }
  };

  const cancelRecording = async (): Promise<void> => {
    // try {
    //   await audioRecorderPlayer.stopRecorder();
    //   audioRecorderPlayer.removeRecordBackListener();
    //   setRecording(false);
    //   setRecordedURI('');
    //   // Clear and reset the timer
    //   if (timerRef.current) {
    //     clearInterval(timerRef.current);
    //     timerRef.current = null;
    //   }
    //   setRecordingDuration(0);
    //   console.log('Recording canceled');
    // } catch (error) {
    //   console.error('Failed to cancel recording:', error);
    // }
  };

  const reRecord = (): void => {
    setRecordedURI('');
    setRecordingDuration(0);
  };

  const uploadAudio = async (uri: string): Promise<string | null> => {
    if (!interview?.questions[currentIndex]?._id) {
      showAlertModal({
        title: 'Interview Submitted',
        type: 'success',
        message: 'Your interview has been successfully submitted',
      });
      return null;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/mpeg',
      name: 'audio_recording.mp3',
    } as any);

    try {
      const response = await axios.post(
        'settings/video-audio-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Upload success', response.data);
      return response.data.url; // Assuming the API response contains the URL
    } catch (error) {
      console.error('Upload error', error);
      showAlertModal({
        title: 'Upload Error',
        type: 'error',
        message: 'There was an error uploading your audio. Please try again.',
      });
      return null;
    }
  };

  const getInterviewAnswer = (
    interviewId: string,
    questionId: string,
  ): void => {
    axiosInstance
      .get(`interview/answer/${interviewId}/${questionId}`)
      .then(res => {
        console.log('res', JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          dispatch(
            updateInterviewAnswer({
              answer: res.data.answer,
              interviewId: interview._id,
            }),
          );
          setUploaded(prev => [...prev, currentIndex]);
        }
      })
      .catch(error => {
        console.log(
          'error from interview/answer',
          JSON.stringify(error, null, 1),
        );
      });
  };

  const sendAudio = async (): Promise<void> => {
    if (recordedURI) {
      const audioUrl = await uploadAudio(recordedURI);
      if (audioUrl) {
        try {
          const response = await axiosInstance.put('interview/submit-answer', {
            interview: interview._id,
            audio: audioUrl,
            question: interview?.questions[currentIndex]?._id,
          });
          console.log('Answer submitted', response.data);
          if (response.data.success) {
            getInterviewAnswer(
              interview._id,
              interview?.questions[currentIndex]?._id,
            );
          }
        } catch (error: any) {
          console.error('Submit answer error', error.response?.data);
          showAlertModal({
            title: 'Submission Error',
            type: 'error',
            message:
              'There was an error submitting your answer. Please try again.',
          });
        }
      }
    }
  };

  const handleNext = (): void => {
    if (currentIndex < interview?.questions?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRecordedURI('');
      setRecordingDuration(0);
    }
  };

  const handleBack = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRecordedURI('');
      setRecordingDuration(0);
    }
  };

  const currentQuestion = interview?.questions?.[currentIndex];

  const submitInterview = async (): Promise<void> => {
    try {
      await axios.post('interview/finalsubmission', {
        interview: interview._id,
      });
      showToast({
        message: 'Interview submitted successfully!',
      });
      toggleStartModal();
    } catch (error) {
      console.error('Final submission error', error);
      showToast({
        message:
          'There was an error submitting your interview. Please try again.',
      });
    }
  };

  return (
    <Modal isVisible={isStartModalVisible}>
      <View style={styles.modalContainer}>
        <ModalBackAndCrossButton
          containerStyle={{
            paddingBottom: 5,
            marginBottom: 5,
          }}
          toggleModal={toggleStartModal}
        />
        <Text style={styles.heading}>Web Elements Interview</Text>
        <View style={styles.dateContainer}>
          {interview?.questions?.length ? (
            <Text style={styles.title}>
              Question {currentIndex + 1}/{interview?.questions?.length}
            </Text>
          ) : (
            <Text style={styles.title}>Question unavailable</Text>
          )}
          <View style={styles.btnContainer}>
            {currentIndex > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <ArrowLeftWhite />
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentIndex < interview?.questions?.length - 1 && (
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text
                  style={[
                    styles.btnText,
                    { color: Colors.SecondaryButtonTextColor },
                  ]}
                >
                  Next
                </Text>
                <ArrowRightWhite color={Colors.SecondaryButtonTextColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <VideoPlayer url={currentQuestion?.video} />
        <Text style={styles.text}>
          You haven’t submitted this interview yet.
        </Text>
        <Text style={styles.question}>
          Question: {interview?.questions[currentIndex]?.title || 'N/A'}
        </Text>
        <Text
          style={[
            styles.question,
            { color: Colors.BodyText, marginTop: responsiveScreenHeight(0) },
          ]}
        >
          Hints: {interview?.questions[currentIndex]?.hint || 'Try yourself'}
        </Text>
        <Text
          style={[styles.title, { marginBottom: responsiveScreenHeight(1) }]}
        >
          Record Audio
        </Text>
        {!uploaded.includes(currentIndex) ? (
          <View style={styles.recorderContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {!recording && !recordedURI && (
                <TouchableOpacity
                  style={styles.recordBtn}
                  onPress={startRecording}
                >
                  <Text style={styles.recordBtnText}>Start Recording</Text>
                </TouchableOpacity>
              )}
              {recording && (
                <TouchableOpacity
                  onPress={() => {
                    cancelRecording();
                  }}
                >
                  <CrossCircle size={30} />
                </TouchableOpacity>
              )}
              {recording && <AudioWaveform />}
              {recording && (
                <TouchableOpacity onPress={stopRecording}>
                  <SendIcon size={30} />
                </TouchableOpacity>
              )}
            </View>

            {/* Timer Display */}
            {recording && (
              <View>
                <Text style={styles.durationText}>
                  {formatTime(recordingDuration)}
                </Text>
              </View>
            )}

            {recordedURI && (
              <>
                <AudioMessage
                  audioUrl={recordedURI}
                  background={'transparent'}
                  color={Colors.BodyText}
                />
                <View style={styles.btnContainerLast}>
                  <TouchableOpacity
                    style={styles.reRecordBtn}
                    onPress={reRecord}
                  >
                    <Text style={styles.reRecordBtnText}>Re-record</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.uploadBtn,
                      { opacity: recordedURI ? 1 : 0.5 },
                    ]}
                    onPress={sendAudio}
                    disabled={!recordedURI}
                  >
                    <Text style={styles.uploadBtnText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={[styles.recorderContainer]}>
            <View style={[styles.uploadBtn, { alignSelf: 'center' }]}>
              <Text style={styles.uploadBtnText}>Answer uploaded</Text>
            </View>
          </View>
        )}

        <View style={styles.btnContainer2}>
          <MyButton
            flex={0.5}
            onPress={toggleStartModal}
            title={'Cancel'}
            bg={Colors.PrimaryOpacityColor}
            colour={Colors.Primary}
          />
          <MyButton
            flex={0.5}
            onPress={recording ? () => {} : submitInterview}
            title={'Submit'}
            bg={
              recording ? Colors.DisablePrimaryBackgroundColor : Colors.Primary
            }
            colour={
              recording
                ? Colors.DisablePrimaryButtonTextColor
                : Colors.PureWhite
            }
          />
        </View>
      </View>
      <GlobalAlertModal />
    </Modal>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    question: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      marginVertical: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingBottom: responsiveScreenHeight(1.5),
      paddingTop: 10,
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
    btnContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: Colors.BorderColor,
      paddingTop: 10,
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      height: responsiveScreenHeight(3.5),
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      height: responsiveScreenHeight(3.5),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    bgImg: {
      height: responsiveScreenHeight(22),
      objectFit: 'cover',
      borderRadius: 5,
      marginBottom: responsiveScreenHeight(2),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
    },
    recorderContainer: {
      paddingVertical: responsiveScreenHeight(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(2),
      marginBottom: 10,
    },
    recordBtn: {
      backgroundColor: 'rgba(243, 65, 65, 0.10)',
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      flexDirection: 'column',
      alignItems: 'center',
      width: responsiveScreenWidth(35),
    },
    recordBtnText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      textAlign: 'center',
    },
    uploadBtn: {
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(35),
    },
    uploadBtnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
    },
    durationText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      textAlign: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    reRecordBtn: {
      backgroundColor: 'rgba(243, 65, 65, 0.10)',
      padding: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(35),
    },
    reRecordBtnText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
    },
    btnContainerLast: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: responsiveScreenHeight(1),
    },
  });
