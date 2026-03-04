import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  Pressable,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import ArrowRightCircle from '../../../assets/Icons/ArrowRightCircle';
import {useTheme} from '../../../context/ThemeContext';
import ArrowLeftCircle from '../../../assets/Icons/ArrowLeftCircle';
import SendIcon from '../../../assets/Icons/SendIcon';
import ChatMessageInput from '../ChatMessageInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TColors} from '../../../types';
import {IAsset} from '../ChatFooter2';
import ReactNativeModal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import AiIcon2 from '../../../assets/Icons/AiIcon2';

interface ImageGalleryProps {
  selectedImages: IAsset[];
  onClose: () => void;
  onAiPress: () => void;
  onSend: (message?: string, fromEdit?: boolean) => void;
  parentId?: string;
  chat: string;
  text?: string;
  isChannel: boolean;
  setText: Dispatch<SetStateAction<string>>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  selectedImages,
  onClose,
  onSend,
  parentId,
  chat,
  text = '',
  isChannel,
  setText,
  onAiPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {selectedMessage} = useSelector((state: RootState) => state.chatSlice);
  // Type the imageDimensions as a mapping from URI to an object with an aspectRatio.
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, {aspectRatio: number}>
  >({});
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleImageLayout = (uri: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  const handleNext = () => {
    if (currentIndex < selectedImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const {top} = useSafeAreaInsets();

  return (
    <ReactNativeModal
      isVisible={Boolean(selectedImages.length)}
      style={styles.modal}
      avoidKeyboard={true}>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.container}>
        <>
          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, {paddingTop: top}]}
            onPress={onClose}>
            <CrossCircle size={40} />
          </TouchableOpacity>
          {/* Image Viewer with Next/Previous Buttons */}
          <View style={styles.imageContainer}>
            {selectedImages.length > 0 && (
              <Image
                source={{uri: selectedImages[currentIndex].uri}}
                style={[
                  styles.image,
                  imageDimensions[selectedImages[currentIndex].uri]
                    ? {
                        aspectRatio:
                          imageDimensions[selectedImages[currentIndex].uri]
                            .aspectRatio,
                      }
                    : {height: responsiveScreenHeight(80)},
                ]}
                onLoad={({nativeEvent}) =>
                  handleImageLayout(
                    selectedImages[currentIndex].uri,
                    nativeEvent.source.width,
                    nativeEvent.source.height,
                  )
                }
              />
            )}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevious}>
                <ArrowLeftCircle size={60} color={Colors.Red} />
              </TouchableOpacity>
            )}
            {currentIndex < selectedImages.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNext}>
                <ArrowRightCircle size={60} color={Colors.Primary} />
              </TouchableOpacity>
            )}
          </View>
          {/* Message Input */}
          <View
            style={[
              styles.inputContainer,
              // Boolean(message.length) && {marginHorizontal: 22},
              {marginHorizontal: 22},
            ]}>
            <ChatMessageInput
              parentId={parentId}
              text={text}
              setText={setText}
              chat={chat}
              handleKey={() => {}}
              isChannel={isChannel}
              maxHeight={200}
              from="image"
            />
            {
              <View
                style={{gap: 10, paddingVertical: text?.length > 0 ? 10 : 0}}>
                {text?.length > 0 && (
                  <TouchableOpacity onPress={onAiPress}>
                    <AiIcon2 size={30} color={Colors.Primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    selectedMessage?._id ? onSend(text, true) : onSend(text);
                  }}
                  style={styles.sendButton}>
                  <SendIcon color={Colors.PureWhite} />
                </TouchableOpacity>
              </View>
            }
          </View>
        </>
      </Pressable>
    </ReactNativeModal>
  );
};

export default ImageGallery;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modal: {
      justifyContent: 'center',
      margin: 0,
      backgroundColor: Colors.Foreground,
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      width: responsiveScreenWidth(100),
      justifyContent: 'center',
      alignItems: 'center',
    },

    closeButton: {
      position: 'absolute',
      right: 10,
      zIndex: 1,
      top: 0,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: responsiveScreenWidth(100),
      position: 'relative',
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
    },
    navButton: {
      position: 'absolute',
      top: '45%',
      padding: 0,
      zIndex: 2,
    },
    prevButton: {
      left: -10,
    },
    nextButton: {
      right: -10,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      alignItems: 'flex-end',

      // justifyContent: 'space-between',
      paddingRight: 5,
      paddingLeft: 20,
      borderRadius: 25,
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: '#ccc',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 25,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
  });
