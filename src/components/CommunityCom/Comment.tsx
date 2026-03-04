import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {nameTrim, showAlertModal, theme} from '../../utility/commonFunction';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../utility/axiosInstance';
import {handleError} from '../../actions/chat-noti';
import ThreeDotGrayIcon from '../../assets/Icons/ThreeDotGrayIcon';
import SendIcon from '../../assets/Icons/SendIcon';
import CrossCircle from '../../assets/Icons/CrossCircle';
import Images from '../../constants/Images';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {
  setSelectedComment,
  updateComment,
} from '../../store/reducer/commentReducer';
import {TColors, TComment} from '../../types';
import {RootState} from '../../types/redux/root';
import {showToast} from '../HelperFunction';

const Comment = memo(
  ({comment: commentData, isLast}: {comment: TComment; isLast?: boolean}) => {
    const [comment, setComment] = useState(commentData);
    const {selectedComment} = useSelector((state: RootState) => state.comment);
    const dispatch = useDispatch();
    useEffect(() => {
      setComment(commentData);
    }, [commentData]);
    const {user} = useSelector((state: RootState) => state.auth);
    const [commentText, setCommentText] = useState(comment.comment);
    useEffect(() => {
      setCommentText(comment.comment);
    }, [comment]);

    const handleShowPopover = (event: any) => {
      dispatch(
        setSelectedComment({
          isUpdateOpen: false,
          isReplyOpen: false,
          popupVisible: true,
          ...comment,
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        }),
      );
    };

    const Colors = useTheme();
    const styles = getStyles(Colors, comment);

    // const initialData = [
    //   {
    //     label: 'Reply',
    //     func: () => {
    //       hidePopover();
    //       setComment(pre => ({
    //         ...pre,
    //         isReplyOpen: !comment?.isReplyOpen,
    //         isUpdateOpen: false,
    //       }));
    //     },
    //   },
    //   {
    //     label: 'Update',
    //     func: () => {
    //       hidePopover();
    //       setComment(pre => ({
    //         ...pre,
    //         isUpdateOpen: !comment?.isUpdateOpen,
    //         isReplyOpen: false,
    //       }));
    //     },
    //   },
    //   {
    //     label: 'Delete',
    //     func: () => {
    //       setIsConfirmationModalVisible(!isConfirmationModalVisible);
    //     },
    //   },
    // ];
    // const data =
    //   user._id === comment.user._id
    //     ? initialData
    //     : initialData.filter(item => item.label === 'Reply');

    const handleCommentUpdate = () => {
      if (!commentText.trim()) {
        return showAlertModal({
          title: 'Empty Comment',
          type: 'warning',
          message: 'Comment cannot be empty.',
        });
      }
      // handleUpdateComment(commentText);

      axiosInstance
        .patch(`content/comment/update/${comment._id}`, {
          comment: commentText,
          contentId: comment.contentId,
        })
        .then(res => {
          if (res.data.success) {
            // getComments(comment._id);
            // getComments(comment.contentId);

            showToast({message: 'Comment updated'});

            dispatch(
              updateComment({
                commentId: comment._id,
                data: {
                  ...res.data.comment,
                  isUpdateOpen: false,
                  parentId: comment.parentId,
                },
              }),
            );
            dispatch(setSelectedComment(null));
          }
        })
        .catch(error => {
          handleError(error);
        });
    };
    return (
      <>
        <View style={styles.commentContainer}>
          {comment.parentId && (
            <View
              style={{
                height: responsiveScreenHeight(10),
                width: responsiveScreenWidth(10),
              }}>
              <View
                style={{
                  height: '50%',
                  width: responsiveScreenWidth(6),
                  alignSelf: 'flex-end',
                  borderLeftWidth: 2,
                  borderBottomWidth: 2,
                  borderBottomColor: Colors.BodyText,
                  borderLeftColor: Colors.BodyText,
                  ...(!isLast && {
                    borderBottomLeftRadius: responsiveScreenFontSize(0.5),
                  }),
                }}
              />
              {isLast && (
                <View
                  style={{
                    height: '100%',
                    width: responsiveScreenWidth(6),
                    alignSelf: 'flex-end',
                    borderLeftWidth: 2,
                    borderLeftColor: Colors.BodyText,
                  }}
                />
              )}
            </View>
          )}
          <View>
            <Image
              source={
                comment?.user?.profilePicture
                  ? {uri: comment?.user?.profilePicture}
                  : Images.DEFAULT_IMAGE
              }
              style={styles.userImage}
            />
          </View>
          {selectedComment?.isUpdateOpen &&
          selectedComment._id === comment._id ? (
            <View style={styles.commentTextContainer}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.updateField}
                value={commentText}
                multiline
                placeholder={commentText}
                placeholderTextColor={Colors.BodyText}
                onChangeText={text => setCommentText(text)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: responsiveScreenWidth(1),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedComment(null));
                    setComment(pre => ({...pre, isUpdateOpen: false}));
                  }}>
                  <CrossCircle color={Colors.Red} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedComment(null));
                    handleCommentUpdate();
                    setComment(pre => ({...pre, isUpdateOpen: false}));
                    // getComments();
                  }}>
                  <SendIcon />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.commentTextContainer}>
              <View>
                <Text style={styles.userName}>
                  {nameTrim(comment?.user?.fullName || 'New User')}
                </Text>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
              <Text style={styles.commentTime}>
                {moment(comment.createdAt).format('hh:mm A')}
              </Text>
            </View>
          )}
          {(user._id === comment.user._id ||
            (user._id !== comment.user._id && !comment.parentId)) && (
            <>
              <TouchableOpacity
                onPress={event => handleShowPopover(event)}
                style={styles.threeDotContainer}>
                <ThreeDotGrayIcon />
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* <>
        {comment.repliesCount > 0 && (
          <TouchableOpacity
            onPress={() => getReplies()}
            style={styles.seeRepliesContainer}>
            <Text>See Replies</Text>
          </TouchableOpacity>
        )}
      </> */}

        {/* {comment?.isReplyOpen && (
        <ReplyBox comment={comment} setComment={setComment} />
      )} */}
        <View>
          {comment.replies?.map((reply, index) => (
            <Comment
              key={reply._id}
              comment={reply}
              isLast={index === comment.replies!.length - 1 ? false : true}
              // data={data}
            />
          ))}
        </View>
        <GlobalAlertModal />
      </>
    );
  },
);

export default Comment;

const getStyles = (Colors: TColors, comment: TComment) =>
  StyleSheet.create({
    seeRepliesContainer: {
      backgroundColor: 'red',
      width: '40%',
    },
    updateField: {
      minHeight: responsiveScreenHeight(6),
      // backgroundColor: "red",
      minWidth: '80%',
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    commentField: {
      minHeight: responsiveScreenHeight(6),
      width: '100%',
    },
    commentInputContainer: {
      backgroundColor: Colors.Background_color,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: responsiveScreenFontSize(10),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(2),
    },
    threeDotContainer: {
      width: responsiveScreenWidth(6),
      alignSelf: 'flex-start',
      marginTop: responsiveScreenHeight(2),
      alignItems: 'center',
      height: responsiveScreenHeight(4),
    },
    commentTextContainer: {
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenFontSize(1),
      borderBottomLeftRadius: responsiveScreenFontSize(3),
      padding: responsiveScreenFontSize(1.5),
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
      marginTop: responsiveScreenHeight(1),
      maxWidth: responsiveScreenWidth(70),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    commentContainer: {
      flexDirection: 'row',
      alignItems: comment.parentId ? 'flex-start' : 'flex-end',
      minHeight: responsiveScreenHeight(10),
      marginTop: comment.parentId ? null : responsiveScreenHeight(1),
      // backgroundColor: "green",
    },
    userImage: {
      height: responsiveScreenFontSize(4),
      width: responsiveScreenFontSize(4),
      borderRadius: 100,
      marginTop: comment.parentId ? responsiveScreenHeight(2) : null,
      marginRight: responsiveScreenWidth(2),
    },
    commentText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
    commentTime: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      alignSelf: 'flex-end',
    },
    userName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Primary,
      marginBottom: responsiveScreenHeight(0.5),
    },
  });
