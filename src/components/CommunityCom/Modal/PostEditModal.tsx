import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {showToast} from '../../HelperFunction';
import {handleError} from '../../../actions/chat-noti';
import {
  getHashtagTexts,
  loadComPostNewly,
  showAlertModal,
  theme,
} from '../../../utility/commonFunction';
import {TextInput} from 'react-native';
import EditPostBottomContainer from '../EditPostBottomContainer';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import RequireFieldStar from '../../../constants/RequireFieldStar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import {TColors} from '../../../types';
import {ICreatePost, IPost} from '../../../types/community/community';
import {Image} from 'react-native';
import SaveConfirmationModal from '../../SharedComponent/SaveConfirmationModal';
import ImageView from 'react-native-image-viewing';

type PostEditModalProps = {
  setIsModalVisible: () => void;
  isModalVisible: boolean;
  post: IPost;
  setSinglePost: () => void;
};
export default function PostEditModal({
  setIsModalVisible,
  isModalVisible,
  post: postData,
  setSinglePost,
}: PostEditModalProps) {
  const [post, setPost] = useState<ICreatePost | null>(postData);
  const [iPost, setIPost] = useState<ICreatePost | null>(postData);
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);
  const [viewImage, setViewImage] = useState<{uri: string}[]>([]);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  useEffect(() => {
    setPost(postData);
    setIPost(postData);
    return () => {
      // setSinglePost();
      // setIPost(null);
      // setPost(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData]);

  const handleEditPost = () => {
    if (!post?.title.trim()) {
      showAlertModal({
        title: 'Empty Title',
        type: 'warning',
        message: 'Title cannot be empty.',
      });
      return;
    }

    if (!post.description.trim()) {
      showAlertModal({
        title: 'Empty Post',
        type: 'warning',
        message: 'Post cannot be empty.',
      });
      return;
    }

    setPost(pre => ({
      ...pre!, // assert that pre is non-null
      tags: getHashtagTexts(pre!.description) || [],
    }));
    axiosInstance
      .patch(`/content/community/post/edit/${post._id}`, {
        title: post?.title,
        description: post?.description,
        tags: post.tags,
        attachments: post?.attachments,
      })
      .then(() => {
        // closePopover();
        setSinglePost();
        setIsModalVisible();
        showToast({message: 'Post edited successfully...'});
        loadComPostNewly();
      })
      .catch(error => {
        handleError(error);
      });
  };

  const {top} = useSafeAreaInsets();
  const removeImage = (uri: string) => {
    setPost((prevPost: ICreatePost | null) => {
      if (!prevPost) {
        return null;
      }
      return {
        ...prevPost,
        attachments: prevPost.attachments?.filter(
          (attachment: {url: string}) => attachment.url !== uri,
        ),
      };
    });
  };
  const inputRef = useRef<TextInput>(null);
  console.log(inputRef?.current?.isFocused);
  const renderItem = ({item}: {item: any}) => (
    <Pressable
      onPress={() => setViewImage([{uri: item.url}])}
      key={item.id || item.url}
      style={styles.selectedImageContainer}
      accessibilityLabel={`Image ${item.id || item.url}`}>
      <Image
        style={styles.selectedImage}
        source={{uri: item.url}}
        onError={error => {
          console.error(`Failed to load image ${item.url}`, error);
          // Optionally, set a fallback image here
        }}
      />
      <TouchableOpacity
        onPress={() => removeImage(item.url)}
        style={styles.removeImageButton}>
        <CrossCircle color="red" />
        {/* <Text style={styles.removeImageText}>X</Text> */}
      </TouchableOpacity>
    </Pressable>
  );
  return (
    <ReactNativeModal
      isVisible={isModalVisible}
      avoidKeyboard={true}
      style={{
        margin: 0,
        justifyContent: 'flex-start',
      }}>
      <Pressable
        onPress={Keyboard.dismiss}
        style={[styles.modalChild, {paddingTop: top}]}>
        {/* <ModalBackAndCrossButton toggleModal={setIsModalVisible} /> */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Post</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>
              JSON.stringify(iPost) === JSON.stringify(post)
                ? (setSinglePost(), setIsModalVisible())
                : setSaveConfirmVisible(true)
            }>
            <CrossCircle size={35} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.sendButton} onPress={handleEditPost}>
            <SendIconTwo />
            <Text style={styles.sendButtonText}>Publish</Text>
          </TouchableOpacity> */}
        </View>
        <ScrollView>
          <View style={styles.createPostContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Title
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                placeholder="Edit post title..."
                multiline
                textAlignVertical="top"
                placeholderTextColor={Colors.BodyText}
                style={[styles.input, {fontFamily: CustomFonts.REGULAR}]}
                onChangeText={text => setPost(pre => ({...pre!, title: text}))}
                value={post?.title || ''}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {marginTop: 10}]}>
                Write Post
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                placeholder="Edit post..."
                placeholderTextColor={Colors.BodyText}
                textAlignVertical="top"
                multiline
                style={[
                  styles.input,
                  {
                    minHeight: responsiveScreenHeight(20),
                    maxHeight: responsiveScreenHeight(30),
                  },
                ]}
                onChangeText={text =>
                  setPost(pre => ({...pre!, description: text}))
                }
                value={post?.description || ''}
              />
            </View>
          </View>
          {post?.attachments && post.attachments.length > 0 && (
            // <View style={styles.selectedImagesContainer}>
            //   {post.attachments.map((item, index) => (
            //     <View
            //       key={`${item}_${index}`}
            //       style={styles.selectedImageContainer}>
            //       <Image
            //         style={styles.selectedImage}
            //         source={{uri: item.url}}
            //       />

            //     </View>
            //   ))}
            // </View>

            <FlatList
              data={post.attachments}
              renderItem={renderItem}
              keyExtractor={() => Math.random().toString()}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.galleryContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ScrollView>
        {/* <CustomIconButton
          handlePress={() => {
            handleGalleryPress({setPost, setIsLoading: () => {}});
            }}
            title={'Gallery'}
            customContainerStyle={{
              marginBottom: 20,
              }}
              isLoading={false}
              disable={false}
              icon={<GalleryIcon color={Colors.Primary} />} // Expecting an icon component passed as prop
              iconPosition={'left'} // Option to place icon on left or right
              background={Colors.PrimaryOpacityColor}
              color={Colors.Primary}
              /> */}
        <EditPostBottomContainer
          handleEditPost={() => handleEditPost()}
          post={post}
          setPost={setPost}
        />
      </Pressable>
      <GlobalAlertModal />
      {saveConfirmVisible && (
        <SaveConfirmationModal
          isVisible={saveConfirmVisible}
          tittle="Unsave changes"
          description="You have unsaved changes. Do you want to continue?"
          onExitPress={() => {
            setIsModalVisible();
            setSaveConfirmVisible(false);
          }}
          onContinuePress={() => {
            setSaveConfirmVisible(false);
          }}
        />
      )}

      <ImageView
        images={viewImage}
        imageIndex={0}
        visible={viewImage.length !== 0}
        onRequestClose={() => setViewImage([])}
      />
    </ReactNativeModal>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    removeImageButton: {
      position: 'absolute',
      top: -12,
      right: -12,
      zIndex: 1,
    },
    galleryContainer: {
      paddingTop: 10,
      // // paddingHorizontal: responsiveScreenWidth(2),
      // borderTopColor: Colors.LineColor,
      // borderTopWidth: 1,
      // marginTop: 5,
    },
    columnWrapper: {
      justifyContent: 'flex-start',
      marginBottom: 10,
    },
    selectedImagesContainer: {
      // flexDirection: 'row',
      // // flexWrap: 'wrap',
      // marginTop: 20,
    },
    selectedImageContainer: {
      position: 'relative',
      flex: 1 / 3, // Each image takes up one-third of the row
      aspectRatio: 1, // Ensures the image is square
      marginHorizontal: 5, // Adjusts horizontal spacing
      borderRadius: 8,
      // overflow: 'hidden',
      backgroundColor: Colors.LightGreen,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    closeButton: {
      width: 100,
      alignItems: 'flex-end',
    },
    sendButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    sendButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 10,
      width: 100,
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: 20,
      // backgroundColor: 'red',
      alignItems: 'center',
      marginBottom: 10,
    },

    modalChild: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4.5),
      flex: 1,
    },
    input: {
      backgroundColor: Colors.Background_color,
      minHeight: responsiveScreenHeight(6),
      borderRadius: responsiveScreenFontSize(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1.5),
      paddingVertical: responsiveScreenHeight(1),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    fieldLabel: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      // marginTop:,
    },
    createPostContainer: {},
    title: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
    },
    fieldContainer: {
      gap: responsiveScreenHeight(1),
      maxHeight: responsiveScreenHeight(40),
    },
  });
