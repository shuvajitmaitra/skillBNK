import { View, Alert, Pressable, Text } from 'react-native';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { gGap } from '../../constants/Sizes';
import {
  AntDesignIcon,
  FeatherIcon,
  IoniconsIcon,
  MaterialCommunityIcon,
  MaterialIcon,
} from '../../constants/Icons';
import { RootState } from '../../types/redux/root';
import { useDispatch, useSelector } from 'react-redux';
import { updateChatFooterInfo } from '../../store/reducer/chatFooterReducer';
import InputFilePreview from './ChatFooter/InputFilePreview';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { pick, types } from '@react-native-documents/picker';
import AudioRecordPreview from './ChatFooter/AudioRecordPreview';
import AddNewEventModalV2 from '../CalendarV2/AddNewEventModalV2';
import { setNewEventData } from '../../store/reducer/calendarReducerV2';
import axiosInstance from '../../utility/axiosInstance';
import { showToast } from '../HelperFunction';
import AiIcon2 from '../../assets/Icons/AiIcon2';
import { useKeyboardVisible } from '../../hook/useKeyboardVisible';
import ChatMessageInput3 from './ChatMessageInput3';

const ChatFooter3 = () => {
  const dispatch = useDispatch();
  const { singleChat } = useSelector((state: RootState) => state.chat);
  const { chatFooterInfo } = useSelector(
    (state: RootState) => state.chatFooter,
  );
  const { newEventData } = useSelector((state: RootState) => state.calendarV2);
  const isKeyboardVisible = useKeyboardVisible();
  const Colors = useTheme();

  const uploadChatsFiles = async (formData: FormData) => {
    try {
      dispatch(updateChatFooterInfo({ isUploading: true }));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axiosInstance.post('/chat/file', formData, config);

      if (response.data.success) {
        const file = {
          name: response.data.file.name || 'uploaded_file',
          size: response.data.file.size || 0,
          type: response.data.file.type || 'application/octet-stream',
          url: response.data.file.location,
        };
        console.log('Uploaded file:', JSON.stringify(file, null, 2));
        return file;
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error(
        'Upload error:',
        error.response?.data?.error || error.message,
      );
      showToast({
        message: error.response?.data?.error || 'Failed to upload file',
      });
      return null;
    } finally {
      dispatch(updateChatFooterInfo({ isUploading: false }));
    }
  };

  const selectImage = async () => {
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
        dispatch(updateChatFooterInfo({ inputOptionModal: false }));

        const uploadedFiles = await Promise.all(
          response.assets.map(async item => {
            const formData = new FormData();
            formData.append('file', {
              uri: item.uri,
              name: item.fileName || `image_${Date.now()}.jpg`,
              type: item.type || 'image/jpeg',
            });
            return await uploadChatsFiles(formData);
          }),
        );

        const validFiles = uploadedFiles.filter(file => file !== null);
        console.log(
          'Valid uploaded files:',
          JSON.stringify(validFiles, null, 2),
        );

        if (validFiles.length > 0) {
          dispatch(
            updateChatFooterInfo({
              files: [...(chatFooterInfo?.files || []), ...validFiles],
            }),
          );
        } else {
          showToast({ message: 'No files were uploaded successfully' });
        }
      }
    });
  };

  const handleDocumentSelection = async () => {
    try {
      const results = await pick({
        type: [types.allFiles],
        allowMultiSelection: true,
      });
      dispatch(updateChatFooterInfo({ inputOptionModal: false }));

      const uploadedFiles = await Promise.all(
        results.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.name || 'Attachments',
            type: item.type || 'application/pdf',
          });
          return await uploadChatsFiles(formData);
        }),
      );

      const validFiles = uploadedFiles.filter(file => file !== null);
      console.log('Valid uploaded files:', JSON.stringify(validFiles, null, 2));

      if (validFiles.length > 0) {
        dispatch(
          updateChatFooterInfo({
            files: [...(chatFooterInfo?.files || []), ...validFiles],
          }),
        );
      } else {
        showToast({ message: 'No files were uploaded successfully' });
      }
    } catch (err: any) {
      if (err) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  const isDataAvailable =
    isKeyboardVisible || Boolean(chatFooterInfo?.files?.length) ? true : false;

  if (newEventData?.isModalVisible) {
    return <AddNewEventModalV2 />;
  }

  if (chatFooterInfo?.audioRecordModal) {
    return <AudioRecordPreview uploadChatsFiles={uploadChatsFiles} />;
  }

  console.log('keyboardVisible', JSON.stringify(isKeyboardVisible, null, 2));

  return (
    <>
      <View
        style={[
          !isDataAvailable && {
            flexDirection: 'row',
            alignItems: 'center',
            gap: gGap(10),
            paddingHorizontal: gGap(20),
          },
          {
            paddingBottom: gGap(15),
            backgroundColor: Colors.Background_color,
            borderTopEndRadius: gGap(20),
            borderTopStartRadius: gGap(20),
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: Colors.BorderColor,
            paddingHorizontal: gGap(10),
            marginTop: gGap(10),
          },
        ]}
      >
        {!isDataAvailable && (
          <AntDesignIcon name="pluscircleo" size={25} color={Colors.BodyText} />
        )}
        <View style={[!isDataAvailable && { width: '80%' }]}>
          <ChatMessageInput3
            chat={singleChat}
            handleKey={() => {}}
            isChannel={singleChat?.isChannel}
            parentId={singleChat.parentId}
            inputStyle={{
              paddingTop: gGap(10),
              paddingBottom: !isDataAvailable
                ? gGap(10)
                : Boolean(chatFooterInfo?.files?.length)
                ? undefined
                : gGap(10),
            }}
            text={chatFooterInfo?.text || ''}
            setText={(t: string) => {
              dispatch(updateChatFooterInfo({ text: t }));
            }}
            maxHeight={200}
          />

          <Pressable onPress={() => {}}>
            <Text numberOfLines={1}>Toggle keyboard</Text>
          </Pressable>
        </View>
        {!isDataAvailable && (
          <MaterialIcon
            onPress={() => {
              dispatch(
                updateChatFooterInfo({
                  inputOptionModal: false,
                  audioRecordModal: true,
                }),
              );
            }}
            name="keyboard-voice"
            size={25}
            color={Colors.BodyText}
          />
        )}
        {(chatFooterInfo?.files?.length ?? 0) > 0 && isDataAvailable && (
          <InputFilePreview />
        )}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: gGap(10) }}
        >
          <MaterialCommunityIcon
            name="image-plus"
            size={26}
            color={Colors.BodyText}
            onPress={() => {
              selectImage();
            }}
          />
          <FeatherIcon
            onPress={() => {
              dispatch(
                updateChatFooterInfo({
                  inputOptionModal: false,
                  audioRecordModal: true,
                }),
              );
            }}
            name="mic"
            size={22}
            color={Colors.BodyText}
          />
          <AntDesignIcon
            onPress={() => {
              handleDocumentSelection();
            }}
            name="addfile"
            size={22}
            color={Colors.BodyText}
          />
          <MaterialIcon
            onPress={() => {
              dispatch(updateChatFooterInfo({ inputOptionModal: false }));
              dispatch(
                setNewEventData({ isModalVisible: true, eventType: 'event' }),
              );
            }}
            name="event"
            size={25}
            color={Colors.BodyText}
          />
          <MaterialIcon
            name="add-task"
            size={25}
            color={Colors.BodyText}
            onPress={() => {
              dispatch(updateChatFooterInfo({ inputOptionModal: false }));
              dispatch(
                setNewEventData({ isModalVisible: true, eventType: 'task' }),
              );
            }}
          />
          <AiIcon2 color={Colors.BodyText} />
          <View style={{ flexGrow: 1 }} />
          <IoniconsIcon name="send" size={25} color={Colors.BodyText} />
        </View>
      </View>
    </>
  );
};

export default ChatFooter3;
