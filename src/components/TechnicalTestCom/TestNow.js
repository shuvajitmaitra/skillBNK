import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import MyButton from '../AuthenticationCom/MyButton';
import CustomFonts from '../../constants/CustomFonts';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import CrossCircle from '../../assets/Icons/CrossCircle';
import axiosInstance from '../../utility/axiosInstance';
import {submitAssignments} from '../../store/reducer/TechnicalTestReducer';
import {showToast} from '../HelperFunction';
import Images from '../../constants/Images';
import CommentSection from '../CommentCom/CommentSection';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import {formattingDate, theme} from '../../utility/commonFunction';
import {getComments} from '../../actions/chat-noti';
import {pick, types} from 'react-native-document-picker';
import RequireFieldStar from '../../constants/RequireFieldStar';
import CommentField from '../CommentCom/CommentField';
import TextRender from '../SharedComponent/TextRender';
import SaveConfirmationModal from '../SharedComponent/SaveConfirmationModal';
import GlobalStatusBar from '../SharedComponent/GlobalStatusBar';

export const getFileTypeFromUri = (uri = '') => {
  const extension = uri ? uri?.split('.')?.pop()?.toLowerCase() : '';

  const mimeTypes = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Add other extensions and MIME types as needed
  };

  const mimeType = mimeTypes[extension] || 'unknown';

  let fileType;
  if (mimeType.startsWith('image/')) {
    fileType = 'image';
  } else if (mimeType === 'application/pdf') {
    fileType = 'pdf';
  } else if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    fileType = 'document';
  } else {
    fileType = 'unknown';
  }

  return fileType;
};

export default function TestNow(routes) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [questionNumber, setQuestionNumber] = useState(
    routes.route.params.questionNumber,
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(null);
  const {assignments} = useSelector(state => state.technicalTest);
  const question = assignments[questionNumber];
  const [attachment, setAttachment] = useState(
    assignments[questionNumber]?.submission?.attachments,
  );

  function areArraysEqual(arr1, arr2) {
    if (arr1?.length !== arr2?.length) {
      return false;
    }

    for (let i = 0; i < arr1?.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  const [answer, setAnswer] = useState(question?.submission?.answer || '');
  useEffect(() => {
    setAnswer(assignments[questionNumber]?.submission?.answer || '');
    setAttachment(assignments[questionNumber]?.submission?.attachments || []);
  }, [assignments, questionNumber]);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialAnswer = question?.submission?.answer || '';
  const initialAttachment =
    assignments[questionNumber]?.submission?.attachments || [];

  const updated =
    answer === initialAnswer ||
    (initialAttachment?.length &&
      !areArraysEqual(attachment, initialAttachment))
      ? true
      : false;

  const data = {
    answer,
    assignment: question?._id || '',
    attachments: attachment,
  };
  const lastQuestion = assignments?.length - 1;

  const handleBackButton = () => {
    if (questionNumber === 0) return;
    if (
      JSON.stringify(initialAnswer, initialAttachment) ===
      JSON.stringify(answer, attachment)
    ) {
      setQuestionNumber(questionNumber - 1);
    } else setConfirmModalVisible({from: 'back'});
  };
  const handleNextButton = () => {
    if (questionNumber === routes.route.params.data?.length - 1) return;

    if (
      JSON.stringify(initialAnswer, initialAttachment) ===
      JSON.stringify(answer, attachment)
    ) {
      setQuestionNumber(questionNumber + 1);
    } else setConfirmModalVisible({from: 'next'});
  };

  const handleSubmitAnswer = () => {
    if (!answer) {
      showAlert({
        title: 'Answer required',
        type: 'warning',
        message: 'Please write answer!',
      });
      return;
    }
    setIsLoading(true);
    axiosInstance
      .post('/assignment/submitanswer', data)
      .then(res => {
        dispatch(
          submitAssignments({answer: res?.data?.answer, questionNumber}),
        );
        if (res.data.success) {
          setIsLoading(false);
          // handleNextButton();
          if (questionNumber + 1 < routes.route.params.data?.length) {
            setQuestionNumber(questionNumber + 1);
          }
          return showToast({
            message: Boolean(initialAnswer || initialAnswer.length > 0)
              ? 'Answer updated...'
              : 'Answer submitted...',
          });
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(
          'error test now modal',
          JSON.stringify(error.response.data.error, null, 1),
        );
        setIsLoading(false);
        showAlert({
          title: 'Submission Failed',
          type: 'error',
          message:
            error.response.data.error ||
            'Failed to submit the answer. Please try again.',
        });
      });
  };

  const UploadAnyFile = async () => {
    try {
      // Allow users to pick multiple files with specified types
      const results = await pick({
        type: [types.images, types.pdf, types.doc, types.docx],
        allowMultiSelection: true, // Enable multiple selection
      });

      // `results` is an array of selected files
      // Check if selecting these files exceeds the maximum allowed attachments
      if (results.length + (attachment?.length || 0) > 5) {
        showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: 'You can upload a maximum of 5 files.',
        });
        return;
      }

      setIsUploading(true);

      // Upload each selected file
      const uploadedFiles = await Promise.all(
        results.map(async file => {
          const formData = new FormData();
          formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type,
          });

          try {
            const response = await axiosInstance.post(
              '/document/userdocumentfile',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );

            if (response.data.fileUrl) {
              return response.data.fileUrl;
            } else {
              console.error(
                'No file URL returned from server for file:',
                file.name,
              );
              return null;
            }
          } catch (error) {
            if (error.response) {
              console.error('Server error:', error.response.data);
            } else if (error.request) {
              console.error('Network error:', error.request);
            } else {
              console.error('Error:', error.message);
            }
            return null;
          }
        }),
      );

      // Filter out any failed uploads
      const validUploadedFiles = uploadedFiles.filter(url => url !== null);

      // Update the attachment state
      setAttachment(prev => [...(prev || []), ...validUploadedFiles]);

      if (validUploadedFiles.length > 0) {
        showToast({message: 'Files uploaded successfully'});
      } else {
        showAlert({
          title: 'Upload Failed',
          type: 'error',
          message: 'No files were uploaded. Please try again.',
        });
      }

      setIsUploading(false);
    } catch (err) {
      if (err) {
        // User canceled the picker, no action needed
        console.log('User canceled file picker');
      } else {
        console.error('Unknown error:', err);
        showAlert({
          title: 'Error',
          type: 'error',
          message: 'An unexpected error occurred while selecting files.',
        });
      }
      setIsUploading(false);
    }
  };

  const removeDocument = uri => {
    // console.log("uri", JSON.stringify(uri, null, 1));
    setAttachment(attachment?.filter(item => item !== uri));
  };

  if (isLoading || isUploading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
        }}>
        <ActivityIndicator color={Colors.Primary} size={40} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View>
        <GlobalStatusBar />

        <View style={styles.contain}>
          <ScrollView>
            <SaveConfirmationModal
              isVisible={Boolean(confirmModalVisible)}
              tittle={'Submission Incomplete'}
              description={'Do you want remove changes'}
              onExitPress={() => {
                confirmModalVisible.from === 'back' &&
                  setQuestionNumber(questionNumber - 1);
                confirmModalVisible.from === 'next' &&
                  setQuestionNumber(questionNumber + 1);
                setConfirmModalVisible(null);
              }}
              onContinuePress={() => {
                setConfirmModalVisible(null);
              }}
            />
            <View style={styles.testContainer}>
              <View style={styles.headingContainer}>
                <Text style={styles.title}>Technical Test</Text>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleBackButton();
                    }}
                    activeOpacity={questionNumber === 0 ? 1 : 0.5}
                    style={[
                      styles.backBtn,
                      {
                        backgroundColor:
                          questionNumber === 0
                            ? Colors.DisableSecondaryBackgroundColor
                            : Colors.SecondaryButtonBackgroundColor,
                        borderWidth: 1,
                        borderColor: Colors.BorderColor,
                      },
                    ]}>
                    <ArrowLeftWhite
                      color={
                        questionNumber === 0
                          ? Colors.DisableSecondaryButtonTextColor
                          : Colors.SecondaryButtonTextColor
                      }
                    />
                    <Text
                      style={{
                        color:
                          questionNumber === 0
                            ? Colors.DisableSecondaryButtonTextColor
                            : Colors.SecondaryButtonTextColor,
                        fontFamily: CustomFonts.REGULAR,
                      }}>
                      Back
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleNextButton();
                    }}
                    activeOpacity={questionNumber === lastQuestion ? 1 : 0.5}
                    style={[
                      styles.nextBtn,
                      {
                        backgroundColor:
                          questionNumber === lastQuestion
                            ? Colors.DisablePrimaryBackgroundColor
                            : Colors.PrimaryButtonBackgroundColor,
                      },
                    ]}>
                    <Text
                      style={[
                        {
                          color:
                            questionNumber === lastQuestion
                              ? Colors.DisablePrimaryButtonTextColor
                              : Colors.PrimaryButtonTextColor,
                          fontFamily: CustomFonts.REGULAR,
                        },
                      ]}>
                      Next
                    </Text>
                    <ArrowRightWhite
                      color={
                        questionNumber === lastQuestion
                          ? Colors.DisablePrimaryButtonTextColor
                          : Colors.PrimaryButtonTextColor
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.idContainer}>
                <Text style={styles.idStyle}>ID: #{question?.id}</Text>
                <View style={styles.queNoContainer}>
                  <Text style={styles.queNo}>
                    {questionNumber + 1}/{routes.route.params.data?.length}
                  </Text>
                </View>
              </View>

              {/* -------------
                    -----------Question section--------
                    ------------------------------------ */}
              <View style={styles.queContainer}>
                <View style={styles.queHeading}>
                  <Text style={styles.queTitle}>Question:</Text>
                  <Text style={styles.total}>
                    Total Marks:
                    <Text style={styles.marks}> {question?.mark}</Text>
                  </Text>
                </View>
                <View>
                  <Text style={styles.que}>{question?.question}</Text>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Added By:</Text>
                  <View style={styles.dataImgContainer}>
                    <Image
                      source={{
                        uri:
                          question?.createdBy?.profilePicture ||
                          Images.DEFAULT_IMAGE,
                      }}
                      style={styles.dataImgStyle}
                    />

                    <Text style={styles.dataText}>
                      {question?.createdBy?.fullName || 'Unknown User'}
                    </Text>
                  </View>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Creation Date:</Text>
                  <Text style={styles.dataText}>
                    {formattingDate(question?.createdAt) === 'Invalid Date'
                      ? 'Not Specified'
                      : formattingDate(question?.createdAt)}
                  </Text>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Last Update:</Text>
                  <Text style={styles.dataText}>
                    {formattingDate(question?.updatedAt) === 'Invalid Date'
                      ? 'Not Specified'
                      : formattingDate(question?.updatedAt) || 'Not Specified'}
                  </Text>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Deadline:</Text>
                  <Text style={styles.dataText}>
                    {question?.dueDate
                      ? formattingDate(question?.dueDate) === 'Invalid Date'
                        ? 'Not Specified'
                        : formattingDate(question?.dueDate)
                      : 'Not Specified'}
                  </Text>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Type of assessment:</Text>
                  <Text style={styles.dataText}>
                    {(question?.category === 'task' && 'Technical Task') ||
                      (question?.category === 'assignment' &&
                        'Technical Assignment') ||
                      (question?.category === 'question' &&
                        'Technical Questions') ||
                      question?.category}
                  </Text>
                </View>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataTitle}>Description:</Text>
                  {!question?.description && (
                    <Text style={styles.dataText}>N/A</Text>
                  )}
                </View>
                {question?.description && (
                  <TextRender text={question?.description} />
                  // <Text style={styles.dataText}>{question?.description}</Text>
                )}
              </View>

              <View>
                <Text style={styles.idStyle}>
                  Answer
                  <RequireFieldStar />
                </Text>
                <TextInput
                  keyboardAppearance={theme()}
                  style={styles.answer}
                  value={answer}
                  onChangeText={text => {
                    setAnswer(text);
                  }}
                  placeholderTextColor={Colors.Heading}
                  multiline={true}
                  placeholder="Write your answer..."
                />
              </View>

              <View>
                <Text style={styles.idStyle}>Upload Attachment (Optional)</Text>
                <TouchableOpacity
                  onPress={UploadAnyFile}
                  style={styles.attachment}>
                  <Text style={styles.uploadText}>Upload Attachment</Text>
                </TouchableOpacity>
                <Text style={styles.attachmentText}>
                  Upload JPEG/PNG/PDF/Docs file
                </Text>
              </View>
              <View
                style={[
                  styles.docPreview,
                  attachment?.length && {
                    marginVertical: responsiveScreenHeight(1.5),
                  },
                ]}>
                {attachment?.map(item => (
                  <View key={item} style={{position: 'relative'}}>
                    {getFileTypeFromUri(item) === 'image' ? (
                      <Image
                        style={{height: 100, width: 100, borderRadius: 8}}
                        source={{uri: item}}
                      />
                    ) : getFileTypeFromUri(item) === 'pdf' ? (
                      <Image
                        style={{height: 100, width: 100, borderRadius: 8}}
                        source={require('../../assets/Images/pdf.png')}
                      />
                    ) : getFileTypeFromUri(item) === 'document' ? (
                      <Image
                        style={{height: 100, width: 100, borderRadius: 8}}
                        source={require('../../assets/Images/doc.png')}
                      />
                    ) : (
                      <View
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 8,
                          backgroundColor: Colors.PrimaryOpacityColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: Colors.Heading}}>Unsupported</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => removeDocument(item)}
                      style={styles.CrossCircle}>
                      <CrossCircle color={'red'} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.btnArea}>
                <MyButton
                  onPress={() => {
                    navigation.navigate('TechnicalTestScreen');
                  }}
                  title={'Cancel'}
                  bg={Colors.PrimaryOpacityColor}
                  colour={Colors.Primary}
                />
                <MyButton
                  onPress={() => {
                    if (
                      updated ||
                      answer.trim() === '' ||
                      question?.submission?.status === 'accepted'
                    ) {
                      return;
                    } else {
                      handleSubmitAnswer();
                    }
                  }}
                  activeOpacity={
                    (updated ||
                      answer.trim() === '' ||
                      question?.submission?.status === 'accepted') &&
                    1
                  }
                  title={'Submit'}
                  bg={
                    updated ||
                    answer.trim() === '' ||
                    question?.submission?.status === 'accepted'
                      ? Colors.DisablePrimaryBackgroundColor
                      : Colors.Primary
                  }
                  colour={
                    updated ||
                    answer.trim() === '' ||
                    question?.submission?.status === 'accepted'
                      ? Colors.DisablePrimaryButtonTextColor
                      : Colors.PureWhite
                  }
                />
              </View>
              {question?.submission?.status === 'accepted' && (
                <View style={styles.acceptedContainer}>
                  <Text style={styles.accepted}>
                    This answer is already accepted
                  </Text>
                </View>
              )}

              <CommentField
                postId={question?._id}
                onPress={
                  !Boolean(initialAnswer || initialAnswer.length > 0)
                    ? () => {
                        showToast({
                          message: 'Answer not submitted yet...',
                        });
                      }
                    : null
                }
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    CrossCircle: {
      position: 'absolute',
      top: -12,
      right: -12,
      zIndex: 1,
      backgroundColor: Colors.Foreground,
      borderRadius: 12,
      padding: 2,
    },
    docPreview: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 20,
    },
    contain: {
      backgroundColor: Colors.Background_color,
      // paddingHorizontal: responsiveScreenWidth(5),
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    testContainer: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(5),
      // marginVertical: responsiveScreenHeight(2),
      // borderRadius: responsiveScreenWidth(3),
      paddingTop: 10,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginBottom: 10,
      // backgroundColor: 'red',
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      height: responsiveScreenHeight(3.5),
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.BodyText,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    idContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(3),
      alignItems: 'center',
    },
    idStyle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    queNoContainer: {
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    queNo: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(0.7),
      color: Colors.Primary,
    },
    queContainer: {
      marginVertical: 10,
      padding: responsiveScreenWidth(4),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
    },
    queHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    queTitle: {
      color: Colors.Primary,
      fontFamily: CustomFonts.BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    total: {
      color: Colors.Primary,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.4),
    },
    marks: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    que: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      lineHeight: 20,
      marginVertical: 10,
      width: responsiveScreenWidth(68),
    },
    dataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    dataTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.SEMI_BOLD,
      width: responsiveScreenWidth(35),
    },
    dataText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
      flex: 1,
      flexWrap: 'wrap',
    },
    dataImgContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    dataImgStyle: {
      height: 16,
      width: 16,
      borderRadius: responsiveScreenWidth(50),
      borderWidth: responsiveScreenWidth(0.4),
      borderColor: Colors.BodyText,
    },
    answer: {
      color: Colors.Heading,
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontFamily: CustomFonts.REGULAR,
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(15),
      height: 'auto',
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      marginBottom: 10,
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: 'dashed',
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      display: 'flex',
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
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2),
    },
    line: {
      marginBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },
    reportTitle: {
      color: '#010813',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    reportContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      marginVertical: responsiveScreenHeight(1),
    },
    imgStyle: {
      width: 40,
      height: 40,
      borderRadius: responsiveScreenWidth(50),
    },
    report: {
      color: Colors.Heading,
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      textAlignVertical: 'top',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontFamily: CustomFonts.REGULAR,
      height: responsiveScreenHeight(8),
      padding: responsiveScreenWidth(3),
      width: responsiveScreenWidth(67),
    },
    reportSubmit: {
      display: 'flex',
      alignSelf: 'flex-end',
      marginTop: responsiveScreenHeight(2),
    },
    reportBtn: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      width: responsiveScreenWidth(30),
    },
    reportBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: 'center',
    },
    accepted: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Red,
      textAlign: 'center',
    },
    acceptedContainer: {
      backgroundColor: Colors.LightRed,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.Red,
      marginBottom: responsiveScreenHeight(2),
      padding: responsiveScreenWidth(2),
      color: Colors.Red,
    },
  });
