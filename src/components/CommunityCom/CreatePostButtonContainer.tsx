import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import SendIconTwo from '../../assets/Icons/SendIconTwo';
import CrossCircle from '../../assets/Icons/CrossCircle'; // Assuming you have a CrossCircle icon
import axiosInstance from '../../utility/axiosInstance';
import {getHashtagTexts, loadComPostNewly} from '../../utility/commonFunction';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {showToast} from '../HelperFunction';
import CustomIconButton from '../SharedComponent/CustomIconButton';
import AiModal from '../SharedComponent/AiModal/AiModal';
import AiIcon2 from '../../assets/Icons/AiIcon2';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import {TColors} from '../../types';
import {ICreatePost} from '../../types/community/community';
import {gHeight} from '../../constants/Sizes';
import {useDispatch} from 'react-redux';
import {setCreatePost} from '../../store/reducer/communityReducer';

/* ─── TYPES AND INTERFACES ───────────────────────────────── */

// Define a strict Attachment type.

// If you use a different file for ICreatePost, you can merge or override it as needed.
// Here we use ICreatePost from the local definition.

// Interface for the parameters of handleGalleryPress.
interface HandleGalleryPressProps {
  setPost: React.Dispatch<React.SetStateAction<ICreatePost | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// (Optional) Define the interface for the uploaded file if you want stricter typing.
interface UploadedFile {
  location: string;
  name: string;
  type?: string;
  size: number;
}

/* ─── HELPER FUNCTION ────────────────────────────────────── */

export const handleGalleryPress = async ({
  setPost,
  setIsLoading,
}: HandleGalleryPressProps): Promise<void> => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.5,
    selectionLimit: 10,
  };

  try {
    setIsLoading(true);

    // Use the promise-based API of launchImageLibrary.
    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
      showToast({message: `ImagePicker Error: ${response.errorMessage}`});
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      console.log('No images selected');
      showToast({message: 'No images selected'});
      return;
    }

    // Upload all selected images concurrently.
    const uploadedFiles: UploadedFile[] = await Promise.all(
      response.assets.map(async (item: Asset): Promise<UploadedFile> => {
        const formData = new FormData();
        formData.append('file', {
          uri: item.uri,
          name: item.fileName || `uploaded_image_${Date.now()}`,
          type: item.type || 'image/jpeg',
        } as any);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        try {
          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
          throw uploadError; // This will be caught by the outer catch.
        }
      }),
    );

    // Update the post with the newly uploaded attachments.
    setPost(prevPost => {
      // If no post exists, create a new one with default values.
      if (!prevPost) {
        return {
          title: '',
          description: '',
          tags: [],
          attachments: uploadedFiles.map(file => ({
            url: file.location,
            name: file.name,
            type: file.type || 'image/jpeg',
            size: file.size,
          })),
        };
      }

      return {
        ...prevPost,
        attachments: [
          ...(prevPost.attachments || []),
          ...uploadedFiles.map(file => ({
            url: file.location,
            name: file.name,
            type: file.type || 'image/jpeg',
            size: file.size,
          })),
        ],
      };
    });
  } catch (error) {
    console.error('Error in handleGalleryPress:', error);
    showToast({message: 'An error occurred while uploading images.'});
  } finally {
    setIsLoading(false);
  }
};

/* ─── COMPONENT ──────────────────────────────────────────── */

interface CreatePostButtonContainerProps {
  post: ICreatePost | null;
  setPost: React.Dispatch<React.SetStateAction<ICreatePost | null>>;
}

const CreatePostButtonContainer: React.FC<CreatePostButtonContainerProps> = ({
  post,
  setPost,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [creating, setCreating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const extractTags = () => {
    setPost(prev =>
      prev ? {...prev, tags: getHashtagTexts(prev.description) || []} : prev,
    );
  };

  const handlePost = () => {
    // Ensure post exists before proceeding.
    if (!post) {
      return showToast({message: 'Post can not be empty'});
    }

    const title = post.title.trim();
    const description = post.description.trim();

    if (!title) {
      return showToast({
        message: 'Title cannot be empty.',
        background: Colors.Red,
      });
    }
    if (!description) {
      return showToast({
        background: Colors.Red,
        message: 'Description cannot be empty.',
      });
    }

    setCreating(true);

    axiosInstance
      .post('/content/community/post/create', {
        ...post,
        title,
        description,
        attachments: post.attachments || [],
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setCreatePost(null));
          setPost(null);
          loadComPostNewly();
          // Reset the post state for a new post.
          showToast({
            message: 'Posted Successfully!',
            background: Colors.SuccessColor,
          });
          setCreating(false);
        }
      })
      .catch(error => {
        console.error(
          'error from content community post create',
          JSON.stringify(error.response?.data || error.message, null, 1),
        );
        setCreating(false);
      });
  };

  const removeImage = (uri: string): void => {
    setPost(prevPost => {
      if (!prevPost) {
        return prevPost;
      }
      return {
        ...prevPost,
        attachments:
          prevPost.attachments?.filter(attachment => attachment.url !== uri) ||
          [],
      };
    });
  };

  return (
    <>
      {post && post.attachments && post.attachments.length > 0 && (
        <View style={styles.selectedImagesContainer}>
          {post.attachments.map((item, index) => (
            <View
              key={`${item.url}_${index}`}
              style={styles.selectedImageContainer}>
              <Image style={styles.selectedImage} source={{uri: item.url}} />
              <TouchableOpacity
                onPress={() => removeImage(item.url)}
                style={styles.CrossCircle}>
                <CrossCircle color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <CustomIconButton
          handlePress={() => handleGalleryPress({setPost, setIsLoading})}
          title="Gallery"
          customContainerStyle={styles.buttonStyle}
          isLoading={isLoading}
          disable={false}
          icon={<GalleryIcon color={Colors.Primary} />}
          iconPosition="left"
          background={Colors.PrimaryOpacityColor}
          color={Colors.Primary}
        />
        <CustomIconButton
          handlePress={() => setAiModalVisible(prev => !prev)}
          title="AI"
          customContainerStyle={styles.buttonStyle}
          isLoading={false}
          disable={false}
          icon={<AiIcon2 color="white" size={24} />}
          iconPosition="left"
          color={Colors.PureWhite}
        />
        <CustomIconButton
          handlePress={() => {
            extractTags();
            handlePost();
          }}
          title="Publish"
          customContainerStyle={styles.buttonStyle}
          isLoading={creating}
          disable={creating || isLoading}
          icon={
            <SendIconTwo
              color={creating || isLoading ? Colors.Primary : Colors.PureWhite}
            />
          }
          iconPosition="left"
          color={creating || isLoading ? Colors.Primary : Colors.PureWhite}
        />
      </View>
      <AiModal
        setState={(text: string) =>
          setPost(prev =>
            prev
              ? {...prev, description: text}
              : {title: '', description: text, attachments: []},
          )
        }
        state={post?.description}
        isVisible={aiModalVisible}
        onCancelPress={() => setAiModalVisible(prev => !prev)}
      />
    </>
  );
};

export default CreatePostButtonContainer;

/* ─── STYLES ───────────────────────────────────────────────── */

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonStyle: {
      flex: 0.3,
      height: gHeight(35),
      borderRadius: 4,
      marginTop: 0,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveScreenFontSize(2),
      marginVertical: responsiveScreenHeight(1.5),
    },
    holidayButtonContainer: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(5),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
      flex: 0.3,
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    disabledButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    disabledButtonText: {
      color: Colors.Primary,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: responsiveScreenHeight(2),
    },
    selectedImageContainer: {
      position: 'relative',
      marginRight: responsiveScreenWidth(3),
      marginBottom: responsiveScreenHeight(2),
    },
    selectedImage: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenHeight(15),
      borderRadius: responsiveScreenWidth(2),
    },
    CrossCircle: {
      position: 'absolute',
      top: -12,
      right: -12,
      zIndex: 1,
    },
  });
