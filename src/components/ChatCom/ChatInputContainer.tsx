import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChatInput from './ChatInput';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import {MaterialIcon} from '../../constants/Icons';
import {withOpacity} from './Mention/utils';
import {useDispatch, useSelector} from 'react-redux';
import AttachmentIcon from '../../assets/Icons/AttachmentIcon';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import {setNewEventData} from '../../store/reducer/calendarReducerV2';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {pick, types} from '@react-native-documents/picker';
import axiosInstance from '../../utility/axiosInstance';
import AudioUploadModal from './ChatFooter/AudioUploadModal';
import ChatDocPreview from './ChatDocPreview';
import {convertLink} from '../../utility/commonFunction';
import {RootState} from '../../types/redux/root';
import {IMessage, Sender, TFile} from '../../types/chat/messageTypes';
import {
  setLocalMessages,
  setSelectedMessage,
  setThreadMessages,
  updateDraftMessages,
  updateRepliesCount,
} from '../../store/reducer/chatSlice';
import {updateLatestMessage} from '../../store/reducer/chatReducer';
import {showToast} from '../HelperFunction';
import RNText from '../SharedComponent/RNText';
import CustomFonts from '../../constants/CustomFonts';
import {PressableScale} from '../SharedComponent/PressableScale';
import CrossCircle from '../../assets/Icons/CrossCircle';
import store from '../../store';
export type chatInfoProps = {
  text: string;
  files: TFile[];
};
type props = {
  chatId: string;
  parentId?: string;
};
const ChatInputContainer = ({chatId, parentId}: props) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {localMessages, threadMessages, selectedMessage} = useSelector(
    (state: RootState) => state.chatSlice,
  );

  const inputRef = useRef<TextInput>(null);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [chatInfo, setChatInfo] = useState<chatInfoProps>({
    text: '',
    files: [],
  });
  useEffect(() => {
    if (selectedMessage) {
      setChatInfo({
        ...chatInfo,
        text: selectedMessage.text || '',
        files: selectedMessage.files || [],
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMessage]);

  const selectImage = () => {
    Keyboard.dismiss();
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.5,
      selectionLimit: 10,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Unknown error');
      } else if (response.assets) {
        const uploadedFiles = await Promise.all(
          response.assets.map(async item => {
            const formData = new FormData();
            formData.append('file', {
              uri: item.uri,
              name: item.fileName || 'uploaded_image',
              type: item.type || 'image/jpeg',
            } as any);

            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };

            const res = await axiosInstance.post(
              '/chat/file',
              formData,
              config,
            );
            return res.data.file;
          }),
        );

        const files = uploadedFiles.map((file: any) => ({
          name: file.name || 'uploaded_file',
          size: file.size,
          type: file.type,
          url: file.location,
        }));
        setChatInfo({...chatInfo, files: [...files, ...chatInfo.files]});
      }
    });
  };

  // Handle document selection
  const handleDocumentSelection = async () => {
    try {
      const results = await pick({
        type: [types.allFiles],
        allowMultiSelection: true,
      });
      const uploadedFiles = await Promise.all(
        results.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.name || 'uploaded_document',
            type: item.type || 'application/pdf',
          } as any);

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        }),
      );

      const files = uploadedFiles.map((file: any) => ({
        name: file.name || 'uploaded_file',
        size: file.size,
        type: file.type,
        url: file.location,
      }));
      setChatInfo({...chatInfo, files: [...files, ...chatInfo.files]});
    } catch (err: any) {
      if (err) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  const sendMessage = useCallback(async (): Promise<void> => {
    Keyboard.dismiss();
    const data = {
      text: convertLink(chatInfo.text),
      files: chatInfo.files,
      parentMessage: parentId,
    };

    const randomId = Math.floor(Math.random() * (999999 - 1111) + 1111);
    const messageData = {
      message: {
        ...data,
        _id: `${randomId}`,
        sender: {
          _id: user?._id,
          fullName: `${user?.firstName} ${user?.lastName}`,
          profilePicture: user?.profilePicture,
          type: user?.type,
        },
        createdAt: Date.now(),
        status: 'sending',
        chat: chatId,
        type: 'message',
      },
    };

    if (!parentId) {
      const defaultMessage: IMessage = {
        _id: '',
        type: '',
        status: '',
        sender: {
          _id: '',
          fullName: '',
          profilePicture: '',
          type: '',
          firstName: '',
          lastName: '',
        },
        text: '',
        chat: '',
        files: [],
        organization: '',
        emoji: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: 0,
        __v: 0,
        replyCount: 0,
        reactionsCount: 0,
        myReaction: null,
        reactions: {},
        forwardedFrom: undefined,
      };
      const defaultSender: Sender = {
        _id: '',
        fullName: '',
        profilePicture: '',
        type: '',
        firstName: '',
        lastName: '',
      };
      const tempM: IMessage = {
        ...defaultMessage,
        ...messageData.message,
        createdAt: new Date(messageData.message.createdAt).toISOString(),
        sender: {
          ...defaultSender,
          ...messageData.message.sender,
        },
      };
      dispatch(setLocalMessages([tempM, ...localMessages]));
    }

    try {
      const res = await axiosInstance.put(`/chat/sendmessage/${chatId}`, data);
      dispatch(
        updateDraftMessages({
          chatId: parentId ? parentId : chatId,
          text: '',
        }),
      );
      if (parentId) {
        dispatch(setThreadMessages([...threadMessages, res.data.message]));
        dispatch(updateRepliesCount(parentId));
      } else {
        // setMessages(chatId, res.data.message);
        dispatch(setLocalMessages([res.data.message, ...localMessages]));
      }
      dispatch(
        updateLatestMessage({
          chatId: res?.data?.message?.chat,
          latestMessage: res?.data?.message,
          counter: 1,
        }),
      );
      setChatInfo({text: '', files: []});
    } catch (err: any) {
      if (__DEV__) {
        console.error('Error sending message:', err.response?.data);
      }
      showToast({
        message: err.response?.data.error || 'Failed to send message',
      });
    } finally {
      // setUploading(false);
    }
  }, [
    chatInfo.text,
    chatInfo.files,
    parentId,
    user?._id,
    user?.firstName,
    user?.lastName,
    user?.profilePicture,
    user?.type,
    chatId,
    dispatch,
    localMessages,
    threadMessages,
  ]);
  const handleCancelEdit = () => {
    store.dispatch(setSelectedMessage(null));
    setChatInfo({text: '', files: []});

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };
  return (
    <>
      <View style={styles.container}>
        {selectedMessage && (
          <View
            style={{
              padding: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              backgroundColor: Colors.Foreground,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
            }}>
            <RNText
              style={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
                flex: 1,
              }}
              numberOfLines={1}>
              Edit Message: {selectedMessage?.text}
            </RNText>
            <PressableScale
              onPress={() => {
                handleCancelEdit();
              }}>
              <CrossCircle />
            </PressableScale>
          </View>
        )}
        {chatInfo.files.length > 0 && (
          <ChatDocPreview
            chatInfo={chatInfo}
            onRemove={idx => {
              const files = chatInfo.files.filter((_, i) => i !== idx);
              setChatInfo({...chatInfo, files});
            }}
          />
        )}
        <ChatInput
          ref={inputRef}
          text={chatInfo.text}
          setText={txt => {
            setChatInfo({...chatInfo, text: txt});
          }}
          chatId={chatId}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}>
            {
              <TouchableOpacity
                onPress={() => {
                  handleDocumentSelection();
                }}
                style={styles.buttonContainer}>
                <AttachmentIcon />
              </TouchableOpacity>
            }
            {
              <TouchableOpacity
                onPress={selectImage}
                style={styles.buttonContainer}>
                <GalleryIcon />
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setNewEventData({isModalVisible: true, eventType: 'event'}),
                );
              }}
              style={styles.buttonContainer}>
              <CalendarIconSmall color={Colors.BodyText} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setNewEventData({isModalVisible: true, eventType: 'task'}),
                );
              }}
              style={styles.buttonContainer}>
              <MaterialIcon name="task-alt" size={22} color={Colors.BodyText} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <AudioUploadModal setChatInfo={setChatInfo} chatInfo={chatInfo} />
            {(chatInfo.text || chatInfo.files.length > 0) && (
              <TouchableOpacity
                onPress={() => {
                  sendMessage();
                }}
                style={styles.buttonContainer}>
                {
                  <MaterialIcon
                    name={'send'}
                    size={22}
                    color={Colors.BodyText}
                  />
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default ChatInputContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      margin: 8,
      paddingHorizontal: 12,
      //   paddingBottom: 12,
      //   paddingRight: 5,
      paddingTop: 8,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      marginBottom: 5,
      paddingBottom: 10,
    },
    buttonContainer: {
      padding: 8,
      backgroundColor: withOpacity(Colors.Primary, 0.2),
      borderColor: withOpacity(Colors.Primary, 0.3),
      borderWidth: 1,
      borderRadius: 100,
    },
  });
