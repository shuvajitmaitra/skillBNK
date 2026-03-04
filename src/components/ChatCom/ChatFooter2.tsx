import React, { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  launchImageLibrary,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {
  pick,
  types,
  DocumentPickerResponse,
} from '@react-native-documents/picker';

import SendContainer from './ChatFooter/SendContainer';
import ChatMessageInput from './ChatMessageInput';
import ImageGallery from './ChatFooter/ImageGallery';
import AudioRecorder from './ChatFooter/AudioRecorder';
import DocumentContainer from './DocumentContainer';
import LoadingSmall from '../SharedComponent/LoadingSmall';

import PlusIcon from '../../assets/Icons/PlusIcon';
import AttachmentIcon from '../../assets/Icons/AttachmentIcon';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import ArrowTopIcon from '../../assets/Icons/ArrowTopIcon';

import { useTheme } from '../../context/ThemeContext';
import { RegularFonts } from '../../constants/Fonts';
import axiosInstance from '../../utility/axiosInstance';

import {
  setLocalMessages,
  setSelectedMessage,
  setThreadMessages,
  updateDraftMessages,
  updateMessage,
  updateRepliesCount,
  updateThreadMessage,
} from '../../store/reducer/chatSlice';
import { updateLatestMessage } from '../../store/reducer/chatReducer';
import { RootState } from '../../types/redux/root';
import { TColors } from '../../types';
import { showToast } from '../HelperFunction';
import EditMessageFilePreview from './ChatFooter/EditMessageFilePreview';
import AiModal from '../SharedComponent/AiModal/AiModal';
import { IMessage, Sender, TFile } from '../../types/chat/messageTypes';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import { setNewEventData } from '../../store/reducer/calendarReducerV2';
import { MaterialIcon } from '../../constants/Icons';
import { gGap } from '../../constants/Sizes';
// import ProgramIcon from '../../assets/Icons/ProgramIcon';
import PurposeModal from './Modal/PurposeModal';

// Regular expressions and helper function for link conversion.
const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;
const WWW_REGEX = /(^|[^\\/])(www\.[\S]+(\b|$))/gim;

const convertLink = (text: string): string => {
  let textWithLinks = text.replace(
    URL_REGEX,
    '<a target="_blank" href="$1">$1</a>',
  );
  return textWithLinks.replace(
    WWW_REGEX,
    '$1<a target="_blank" href="http://$2">$2</a>',
  );
};

export interface IAsset {
  width: number;
  fileName: string;
  height: number;
  type: string;
  uri: string;
  fileSize: number;
}

export interface EditableMessage {
  _id: string;
  text: string;
  files?: any[];
  chat: string;
  parentMessage?: string;
  fromEdit?: boolean;
}

export interface ChatFooter2Props {
  chatId?: string;
  setMessages?: (chatId: string, messages: any[]) => void;
  messageEditVisible?: any | null;
  setMessageEditVisible?: (message: any | null) => void;
  parentId?: string;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ChatFooter2: React.FC<ChatFooter2Props> = ({
  chatId = '',
  setMessages = () => {},
  messageEditVisible,
  setMessageEditVisible = () => {},
  parentId = '',
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { localMessages, threadMessages, selectedMessage, draftMessages } =
    useSelector((state: RootState) => state.chatSlice);

  const { singleChat } = useSelector((state: RootState) => state.chat);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Component state variables with explicit types.
  const [text, setText] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<IAsset[]>([]);
  const [documentVisible, setDocumentVisible] = useState<boolean>(false);
  const [showBottom, setShowBottom] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    DocumentPickerResponse[]
  >([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<TFile[] | null>(null);
  const [messageClicked, setMessageClicked] = useState<boolean>(false);
  const [startRecording, setStartRecording] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<EditableMessage | null>(null);
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);
  const [purposeModalVisible, setPurposeModalVisible] = useState(false);

  const toggleBottom = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Keyboard.dismiss();
    setShowBottom(prev => !prev);
  };

  const handleKey = () => {};

  useEffect(() => {
    if (messageEditVisible) {
      setEditMessage(messageEditVisible);
      setText(messageEditVisible?.text || '');
      setEditFile(messageEditVisible?.files || []);
    } else if (!selectedMessage) {
      const newT = parentId
        ? draftMessages[parentId]
        : draftMessages[singleChat?._id];
      setText(newT || '');
    } else if ((selectedMessage?.text?.length ?? 0) > 0) {
      setText(selectedMessage?.text || '');
    }
    if ((selectedMessage?.files?.length ?? 0) > 0) {
      setEditFile(selectedMessage?.files || []);
    }

    return () => {
      setText('');
      setEditFile(null);
      // setEditMessage(null);
      // dispatch(setSelectedMessage(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMessage]);

  // Send message handler
  const sendMessage = useCallback(
    async (txt: string = '', files: any[] = []): Promise<void> => {
      setSelectedImages([]);
      setSelectedDocuments([]);
      setDocumentVisible(false);
      setShowBottom(false);
      Keyboard.dismiss();

      console.log('files', JSON.stringify(files, null, 2));

      const data = {
        text: convertLink(txt),
        files: files,
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
        const res = await axiosInstance.put(`/chat/sendmessage/${chatId}`, {
          ...data,
          files,
        });
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
          setMessages(chatId, res.data.message);
          dispatch(setLocalMessages([res.data.message, ...localMessages]));
        }
        dispatch(
          updateLatestMessage({
            chatId: res?.data?.message?.chat,
            latestMessage: res?.data?.message,
            counter: 1,
          }),
        );
        setText('');
        setSelectedImages([]);
        setSelectedDocuments([]);
      } catch (err: any) {
        if (__DEV__) {
          console.error('Error sending message:', err.response?.data);
        }
        showToast({
          message: err.response?.data.error || 'Failed to send message',
        });
      } finally {
        setUploading(false);
      }
    },
    [
      user,
      chatId,
      setMessages,
      dispatch,
      localMessages,
      parentId,
      threadMessages,
    ],
  );

  // Handle image selection
  const selectImage = () => {
    Keyboard.dismiss();
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.5,
      selectionLimit: 10,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Unknown error');
      } else if (response.assets) {
        setSelectedImages(response.assets as IAsset[]);
        if (messageEditVisible) {
          setEditMessage(messageEditVisible);
          setMessageEditVisible(null);
        }
      }
    });
  };

  // Handle document selection
  const handleDocumentSelection = async () => {
    setShowBottom(false);
    setDocumentVisible(true);
    try {
      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });
      setSelectedDocuments(result);
    } catch (err: any) {
      if (err) {
        console.log('User canceled the picker');
        setDocumentVisible(false);
        setSelectedDocuments([]);
      } else {
        console.error(err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  // Upload images and send message
  const uploadImagesAndSend = async (
    txt: string = '',
    isEdit?: boolean,
  ): Promise<void> => {
    setUploading(true);
    console.log('uploadImagesAndSend called with txt:', txt);
    try {
      const uploadedFiles = await Promise.all(
        selectedImages.map(async item => {
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

      if (isEdit && editMessage) {
        await handleEditMessage({
          ...editMessage,
          text: txt,
          files,
          fromEdit: true,
        });
      } else {
        await sendMessage(txt, files);
      }
    } catch (error) {
      console.error('Error in uploadImagesAndSend:', error);
      Alert.alert('Error', 'Failed to upload images.');
    } finally {
      setUploading(false);
      setSelectedImages([]);
      toggleBottom();
    }
  };

  // Upload documents and send message
  const uploadDocumentsAndSend = async (txt: string): Promise<void> => {
    setUploading(true);
    setDocumentVisible(false);
    try {
      const uploadedFiles = await Promise.all(
        selectedDocuments.map(async item => {
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
      console.log('files', JSON.stringify(files, null, 2));
      await sendMessage(txt, files);
    } catch (error) {
      console.error('Error in uploadDocumentsAndSend:', error);
      Alert.alert('Error', 'Failed to upload document.');
    } finally {
      setUploading(false);
      setSelectedDocuments([]);
    }
  };

  // Toggle message edit mode
  const toggleMessageClicked = useCallback(() => {
    setMessageClicked(prev => !prev);
  }, []);

  // Handle message editing
  const handleEditMessage = async (message: EditableMessage): Promise<void> => {
    // Allow editing if either text or files are present
    if (
      !message.text?.trim() &&
      (!message.files || message.files.length === 0)
    ) {
      showToast({
        message: 'Message cannot be empty (text or files required)',
      });
      return;
    }

    const data = {
      text: convertLink(message.text || ''),
      files: message.files || [],
    };

    console.log(
      'handleEditMessage called with data:',
      JSON.stringify(data, null, 2),
    );

    try {
      const res = await axiosInstance.patch(
        `/chat/update/message/${message._id}`,
        data,
      );
      dispatch(
        updateDraftMessages({
          chatId: parentId ? parentId : chatId,
          text: '',
        }),
      );
      const newMessage = { ...res.data.message, editedAt: new Date() };
      if (!message.parentMessage) {
        dispatch(updateMessage(newMessage));
        dispatch(
          updateLatestMessage({
            chatId: message.chat,
            latestMessage: newMessage,
            counter: 1,
          }),
        );
      } else {
        dispatch(updateThreadMessage(newMessage));
      }
      dispatch(setSelectedMessage(null));
      setMessageEditVisible(null);
      setText('');
      setEditFile(null);
      setEditMessage(null);
    } catch (err: any) {
      console.error('Error in handleEditMessage:', err.response?.data || err);
      showToast({
        message: err.response?.data?.error || 'Failed to edit message',
      });
    }
  };

  // ─────────────────────────────────────────────
  // Render different states based on visibility
  // ─────────────────────────────────────────────
  if (purposeModalVisible) {
    return (
      <PurposeModal
        onCancel={() => {
          setPurposeModalVisible(!purposeModalVisible);
        }}
        isVisible={purposeModalVisible}
        onPress={t => {
          console.log('t', JSON.stringify(t, null, 2));
        }}
      />
    );
  }

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

  if (messageEditVisible) {
    return (
      <Pressable onPress={() => Keyboard.dismiss()}>
        <>
          <EditMessageHeader
            onCancel={() => {
              dispatch(setSelectedMessage(null));
              setMessageEditVisible(null);
              setText('');
              setEditFile(null);
              setEditMessage(null);
              dispatch(
                updateDraftMessages({
                  chatId: parentId ? parentId : chatId,
                  text: '',
                }),
              );
            }}
            styles={styles}
          />
          <EditMessageFilePreview files={editFile || []} />
          <View style={[styles.mainContainer, { paddingVertical: 10 }]}>
            <View style={styles.container}>
              <ChatMessageInput
                handleKey={handleKey}
                chat={singleChat?._id}
                isChannel={singleChat?.isChannel}
                parentId={parentId}
                text={text}
                setText={setText}
                maxHeight={200}
                from="edit"
              />
              <SendContainer
                onAiPress={() => setAiModalVisible(!aiModalVisible)}
                sendMessage={() =>
                  handleEditMessage({
                    ...messageEditVisible,
                    text,
                    files: editFile || [],
                  })
                }
              />
            </View>
          </View>
          {showBottom && (
            <View
              style={[
                styles.bottomContainer,
                !startRecording && { marginBottom: 20 },
              ]}
            >
              {!startRecording && (
                <TouchableOpacity
                  onPress={handleDocumentSelection}
                  style={styles.buttonContainer}
                >
                  {uploading ? <LoadingSmall /> : <AttachmentIcon />}
                </TouchableOpacity>
              )}
              {!startRecording && (
                <TouchableOpacity
                  onPress={selectImage}
                  style={styles.buttonContainer}
                >
                  <GalleryIcon />
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      </Pressable>
    );
  }

  if (documentVisible) {
    return (
      <DocumentContainer
        selected={selectedDocuments}
        onClose={() => {
          setSelectedDocuments([]);
          setDocumentVisible(false);
          setShowBottom(false);
        }}
        parentId={parentId}
        uploadDocument={uploadDocumentsAndSend}
        handleKey={handleKey}
        chat={singleChat?._id}
        isChannel={singleChat?.isChannel}
        text={text}
        setText={setText}
        onAiPress={() => setAiModalVisible(!aiModalVisible)}
      />
    );
  }

  if (selectedImages.length) {
    return (
      <ImageGallery
        selectedImages={selectedImages}
        onClose={() => {
          if (selectedMessage?._id) {
            dispatch(setSelectedMessage(null));
            setText('');
          }
          toggleBottom();
          setSelectedImages([]);
        }}
        parentId={parentId}
        onSend={uploadImagesAndSend}
        chat={singleChat?._id}
        isChannel={singleChat?.isChannel}
        text={text}
        setText={setText}
        onAiPress={() => setAiModalVisible(!aiModalVisible)}
      />
    );
  }

  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        paddingTop: 10,
        marginTop: 10,
      }}
    >
      <View style={[styles.mainContainer]}>
        {!startRecording && (
          <Pressable style={styles.toggleButton} onPress={toggleBottom}>
            {showBottom ? <ArrowTopIcon size={40} /> : <PlusIcon />}
          </Pressable>
        )}
        <View style={[!startRecording ? styles.container : undefined]}>
          {messageClicked && !startRecording ? (
            <>
              <ChatMessageInput
                chat={singleChat?._id}
                isChannel={singleChat?.isChannel}
                text={text}
                setText={setText}
                handleKey={handleKey}
                parentId={parentId}
                maxHeight={200}
                from="all"
              />
              {(text?.trim().length > 0 || selectedImages.length > 0) && (
                <SendContainer
                  onAiPress={() => setAiModalVisible(!aiModalVisible)}
                  sendMessage={() => sendMessage(text)}
                />
              )}
            </>
          ) : (
            <TouchableOpacity
              onPress={() => {
                toggleMessageClicked();
                setShowBottom(false);
              }}
              style={styles.initialContainer}
            >
              <Text style={styles.messageText}>
                {text?.trim() ? text : parentId ? 'Reply...' : 'Message...'}
              </Text>
            </TouchableOpacity>
          )}
          {!text?.length && !showBottom && (
            <AudioRecorder
              sendMessage={sendMessage}
              setStartRecording={setStartRecording}
              handleKey={handleKey}
              chat={singleChat?._id}
              isChannel={singleChat?.isChannel}
              parentId={parentId}
            />
          )}
        </View>
      </View>

      {showBottom && (
        <View
          style={[
            styles.bottomContainer,
            !startRecording && { marginBottom: 20 },
          ]}
        >
          {!startRecording && (
            <TouchableOpacity
              onPress={handleDocumentSelection}
              style={styles.buttonContainer}
            >
              {uploading ? <LoadingSmall /> : <AttachmentIcon />}
            </TouchableOpacity>
          )}
          {!startRecording && (
            <TouchableOpacity
              onPress={selectImage}
              style={styles.buttonContainer}
            >
              <GalleryIcon />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setShowBottom(!showBottom);
              dispatch(
                setNewEventData({ isModalVisible: true, eventType: 'event' }),
              );
            }}
            style={styles.buttonContainer}
          >
            <CalendarIconSmall color={Colors.BodyText} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowBottom(!showBottom);
              dispatch(
                setNewEventData({ isModalVisible: true, eventType: 'task' }),
              );
            }}
            style={styles.buttonContainer}
          >
            <MaterialIcon name="task-alt" size={22} color={Colors.BodyText} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              setShowBottom(!showBottom);
              showToast({message: 'Coming soon...'});
              // setPurposeModalVisible(!purposeModalVisible);
            }}
            style={styles.buttonContainer}>
            <ProgramIcon color={Colors.BodyText} />
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

export default React.memo(ChatFooter2);

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    toggleButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
    },
    bottomContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: gGap(10),
      paddingHorizontal: 20,
    },
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: Platform.OS === 'ios' ? 15 : 10,
      backgroundColor: Colors.Background_color,
    },
    editingButtonText: {
      color: Colors.Red,
      fontWeight: '600',
    },
    editingText: {
      fontWeight: '600',
      color: Colors.Heading,
    },
    cancelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    messageText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BL,
    },
    container: {
      backgroundColor: Colors.Foreground,
      minHeight: 50,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      flex: 1,
      marginRight: 10,
    },
    editMessageContainer: {
      backgroundColor: Colors.Red,
      minHeight: 50,
      borderRadius: 30,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      overflow: 'hidden',
      marginBottom: 30,
    },
    initialContainer: {
      flex: 1,
      height: 49,
      justifyContent: 'center',
    },
  });

// ─────────────────────────────────────────────
// Additional Component: EditMessageHeader
// ─────────────────────────────────────────────

interface EditMessageHeaderProps {
  onCancel: () => void;
  styles: ReturnType<typeof getStyles>;
}

const EditMessageHeader: React.FC<EditMessageHeaderProps> = ({
  onCancel,
  styles,
}) => (
  <View style={styles.cancelContainer}>
    <Text style={styles.editingText}>Editing message: </Text>
    <TouchableOpacity onPress={onCancel}>
      <Text style={styles.editingButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);
