import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {useTheme} from '../../context/ThemeContext';
import ChatMessageInput from './ChatMessageInput';
import SendIcon from '../../assets/Icons/SendIcon';
import DocumentIconFour from '../../assets/Icons/DocumentIconFour';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {TColors} from '../../types';
import {DocumentPickerResponse} from '@react-native-documents/picker';
import AiIcon2 from '../../assets/Icons/AiIcon2';
import {extractFileName} from '../HelperFunction';

type DocumentContainerProps = {
  onClose: () => void;
  onAiPress: () => void;
  selected: DocumentPickerResponse[];
  uploadDocument: (txt: string) => void;
  handleKey: (e: any) => void;
  chat: string;
  isChannel: boolean;
  parentId: string;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
};

const DocumentContainer = ({
  onAiPress,
  onClose,
  selected,
  uploadDocument,
  handleKey,
  chat,
  isChannel,
  parentId,
  text,
  setText,
}: DocumentContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const fileUrl = selected[0]?.uri?.split('/')?.pop() || 'Unavailable';
  const fileType =
    selected[0]?.type?.split('/')?.pop()?.toUpperCase() || 'Unavailable';
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS and Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.docContainer}>
      <View style={styles.inputContainer}>
        <ChatMessageInput
          chat={chat}
          handleKey={handleKey}
          isChannel={isChannel}
          text={text}
          setText={setText}
          parentId={parentId}
          maxHeight={200}
          from="doc"
        />
        {
          <View style={text?.length > 0 ? {gap: 10, paddingVertical: 10} : {}}>
            {text?.length > 0 && (
              <TouchableOpacity onPress={onAiPress}>
                <AiIcon2 size={30} color={Colors.Primary} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                uploadDocument(text);
              }}>
              <SendIcon size={30} />
            </TouchableOpacity>
          </View>
        }
      </View>

      {selected.length > 0 && (
        <View style={styles.bottomContainer}>
          <DocumentIconFour />
          <View>
            <Text style={styles.fileName}>{extractFileName(fileUrl)}</Text>
            <Text style={styles.fileName}>{fileType}</Text>
          </View>
          <View style={{flexGrow: 1}} />
          <Pressable onPress={onClose}>
            <CrossCircle />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default DocumentContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    bottomContainer: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BodyText,
      borderRadius: 25,
      alignItems: 'center',
      // backgroundColor: 'blue',
    },
    fileName: {
      color: Colors.BodyText,
      paddingTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //   minHeight: 80,
      justifyContent: 'space-between',
      // width: '100%',
      // backgroundColor: 'red',
      marginHorizontal: 10,
    },
    docContainer: {
      backgroundColor: Colors.Background_color,
      // minHeight: 50,
      borderRadius: 25,
      margin: 10,
      // //   flexDirection: 'row',
      // //   alignItems: 'center',
      // //   justifyContent: 'space-between',
      // paddingHorizontal: 15,
      // // flex: 1,
      // overflow: 'hidden',
      // maxHeight: 300,
    },
  });
