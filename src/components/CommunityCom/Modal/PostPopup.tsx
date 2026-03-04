import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../../context/ThemeContext';
import PostEditModal from './PostEditModal';
import ReportModal from './ReportModal';
import ConfirmationModal from '../../SharedComponent/ConfirmationModal';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import {removeLinkMarkdown, showToast} from '../../HelperFunction';
import {
  filterPosts,
  setSavePost,
} from '../../../store/reducer/communityReducer';
import axiosInstance from '../../../utility/axiosInstance';
import {handleError} from '../../../actions/chat-noti';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import Popover, {Rect} from 'react-native-popover-view';
import {RegularFonts} from '../../../constants/Fonts';
import {IPost} from '../../../types/community/community';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import {loadComPostNewly} from '../../../utility/commonFunction';

type PostPopupProps = {
  post: IPost;
  setSinglePost: () => void;
};

const PostPopup = ({post, setSinglePost}: PostPopupProps) => {
  const {user} = useSelector((state: RootState) => state.auth);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const handleCopyLink = (text: string, toast: {message: string}) => {
    try {
      Clipboard.setString(text);
      showToast(toast);
      setSinglePost();
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const handleSavePost = () => {
    axiosInstance
      .post('/content/community/post/option/save', {
        post: post._id,
        action: 'save',
      })
      .then(res => {
        if (res.data.success) {
          loadComPostNewly();
          dispatch(setSavePost(post));
          showToast({message: post.isSaved ? 'Post unsaved' : 'Post saved'});
          setSinglePost();
        }
      })
      .catch(handleError);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleDeletePost = () => {
    axiosInstance
      .delete(`/content/community/post/delete/${post._id}`)
      .then(res => {
        if (res.data.success) {
          loadComPostNewly();
          setSinglePost();
          setIsConfirmModalVisible(!isConfirmModalVisible);
        }
      })
      .catch(handleError);
  };
  const handleReportRemove = async () => {
    dispatch(filterPosts(post?._id));

    await axiosInstance
      .post('/content/community/post/option/save', {
        post: post._id,
        action: 'report',
      })
      .then(res => {
        setSinglePost();
        if (res.data.postOption?.action === 'report') {
          loadComPostNewly();
        }
        showToast({message: 'Reported removed!'});
      })
      .catch(error => {
        console.log(
          'error to report',
          JSON.stringify(error.response.data, null, 1),
        );
      });
  };
  return (
    <Popover
      backgroundStyle={{backgroundColor: Colors.BackDropColor}}
      popoverStyle={styles.popoverStyle}
      from={new Rect(post?.x ?? 0, post.y ?? 0, 0, 0)}
      isVisible={Boolean(post)}
      onRequestClose={() => setSinglePost()}>
      <View style={styles.content}>
        {!isModalVisible && !isEditModalVisible && !isConfirmModalVisible && (
          <>
            {/* <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleCopyLink(link, {message: 'Link copied'});
              }}>
              <Text style={styles.item}>Copy post link</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleCopyLink(removeLinkMarkdown(post?.description), {
                  message: 'Text copied',
                });
              }}>
              <Text style={styles.item}>Copy Post Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleSavePost();
              }}>
              <Text style={styles.item}>
                {post?.isSaved ? 'Unsave the post' : 'Save the post'}
              </Text>
            </TouchableOpacity>
            {user?._id !== post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  if (post?.isReported) {
                    // showToast({message: 'You have already reported!'});
                    // // dispatch(filterPosts(post._id));
                    // setSinglePost(null);
                    handleReportRemove();
                  } else {
                    setIsModalVisible(pre => !pre);
                  }
                }}>
                <Text style={styles.item}>
                  {post?.isReported ? 'Remove report' : 'Report the post'}
                </Text>
              </TouchableOpacity>
            )}
            {user?._id === post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  setIsEditModalVisible(pre => !pre);
                }}>
                <Text style={styles.item}>Edit this post</Text>
              </TouchableOpacity>
            )}
            {user?._id === post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  setIsConfirmModalVisible(!isConfirmModalVisible);
                }}>
                <Text style={styles.item}>Delete the post</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {isModalVisible && (
          <ReportModal
            post={post}
            closePopup={() => {
              loadComPostNewly();
              setSinglePost();
            }}
            setIsModalVisible={() => setIsModalVisible(pre => !pre)}
            isModalVisible={isModalVisible}
          />
        )}
        {isEditModalVisible && (
          <PostEditModal
            post={post}
            setIsModalVisible={() => setIsEditModalVisible(pre => !pre)}
            isModalVisible={isEditModalVisible}
            setSinglePost={setSinglePost}
          />
        )}
        {isConfirmModalVisible && (
          <ConfirmationModal
            isVisible={isConfirmModalVisible}
            title="Delete"
            description="Do you want to delete this post?"
            okPress={() => handleDeletePost()}
            cancelPress={() => setIsConfirmModalVisible(!isConfirmModalVisible)}
          />
        )}
        <GlobalAlertModal />
      </View>
    </Popover>
  );
};

export default PostPopup;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    popoverStyle: {
      backgroundColor: Colors.Foreground,
    },
    content: {
      borderRadius: 5,
      gap: 10,
      backgroundColor: Colors.Foreground,
      padding: 10,
      width: 200,
    },
    itemContainer: {
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveFontSize(0.5),
    },
    item: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
  });
