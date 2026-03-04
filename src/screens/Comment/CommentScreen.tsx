import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import CommentPopup from '../../components/CommentCom/CommentPopup';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {useDispatch, useSelector} from 'react-redux';
import {formatDynamicDate, theme} from '../../utility/commonFunction';
import axiosInstance from '../../utility/axiosInstance';
import store from '../../store';
import {setCommentCount} from '../../store/reducer/communityReducer';
import {
  addComment,
  setComments,
  setSelectedComment,
} from '../../store/reducer/commentReducer';
import Comment from '../../components/CommunityCom/Comment';
import SendIcon from '../../assets/Icons/SendIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getComments, giveReply} from '../../actions/chat-noti';
import {RootState} from '../../types/redux/root';
import {TColors, TComment} from '../../types';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {showToast} from '../../components/HelperFunction';
import AiModal from '../../components/SharedComponent/AiModal/AiModal';
import AiIcon2 from '../../assets/Icons/AiIcon2';

// Use the helper type to define your props
type CommentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CommentScreen'
>;

const CommentScreen = ({route, navigation}: CommentScreenProps) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);
  const [commentText, setCommentText] = useState('');
  const textInputRef = useRef(null);
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {comments = [], selectedComment} = useSelector(
    (state: RootState) => state.comment,
  );

  const AnyIcon = Icon as any;
  const [isCommenting, setCommenting] = useState(false);
  const {contentId} = route.params;

  useEffect(() => {
    getComments(contentId);

    return () => {
      dispatch(setComments([]));
    };
  }, [dispatch, contentId]);

  const handleCreateComment = () => {
    if (!commentText.trim()) {
      return showToast({
        message: 'Please write something.',
      });
    }

    setCommenting(true);
    axiosInstance
      .post('/content/comment/create', {
        comment: commentText,
        contentId,
      })
      .then(res => {
        if (res?.data?.success) {
          store.dispatch(
            setCommentCount({
              contentId: res.data.comment?.contentId,
              action: 'add',
            }),
          );
          dispatch(
            addComment({
              ...res.data.comment,
              user: {...user, profilePicture: user.profilePicture},
            }),
          );
          showToast({message: 'Comment added'});
          getComments(contentId);
        }
      })
      .catch(error => {
        console.error('Error creating comment:', error);
        showToast({
          message: 'Failed to post comment. Please try again.',
        });
      })
      .finally(() => {
        setCommentText('');
        setCommenting(false);
      });
  };

  const filteredComments = useMemo(
    () =>
      comments.filter((comment: TComment) => comment?.contentId === contentId),
    [comments, contentId],
  );

  const renderCommentItem = useCallback(
    (comment: TComment, index: number) => {
      if (!comment) {
        return null;
      }

      const isSameDate =
        index > 0 &&
        new Date(comment?.createdAt).toDateString() ===
          new Date(filteredComments[index - 1]?.createdAt).toDateString();

      return (
        <React.Fragment key={comment._id}>
          {!isSameDate && (
            <View style={styles.commentDateContainer}>
              <Text style={styles.commentDate}>
                {formatDynamicDate(comment.createdAt)}
              </Text>
            </View>
          )}
          <Comment comment={comment} />
        </React.Fragment>
      );
    },
    [filteredComments, styles.commentDate, styles.commentDateContainer],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      style={{
        flex: 1,
        backgroundColor: Colors.Foreground,
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'android' ? 10 : null,
      }}>
      {aiModalVisible && (
        <AiModal
          setState={(txt: string) => setCommentText(txt)}
          state={commentText}
          isVisible={aiModalVisible}
          onCancelPress={() => {
            Keyboard.dismiss();
            setAiModalVisible(prev => !prev);
          }}
        />
      )}
      <View
        style={[
          {
            flex: 1,
            paddingTop: top,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.comments}>Comments</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
              dispatch(setSelectedComment(null));
            }}>
            <CrossCircle size={35} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            {filteredComments && filteredComments.length > 0 ? (
              filteredComments.map((comment: TComment, index: number) =>
                renderCommentItem(comment, index),
              )
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80%',
                }}>
                <AnyIcon name="comments" size={111} color={Colors.BodyText} />
                <Text
                  style={{
                    color: Colors.BodyText,
                    fontSize: responsiveScreenFontSize(2.5),
                    fontFamily: CustomFonts.SEMI_BOLD,
                    marginTop: responsiveScreenHeight(2.5),
                  }}>
                  No comments yet
                </Text>
                <Text
                  style={{
                    color: Colors.BodyText,
                    fontSize: responsiveScreenFontSize(1.6),
                    fontFamily: CustomFonts.SEMI_BOLD,
                  }}>
                  Be the first to comment
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {selectedComment?.isReplyOpen && (
          <View style={styles.inputOuterContainer}>
            <Text numberOfLines={1} style={styles.commentText}>
              {selectedComment?.comment}
            </Text>
            <TouchableOpacity
              style={{flex: 0.05}}
              onPress={() => dispatch(setSelectedComment(null))}>
              <CrossCircle size={25} />
            </TouchableOpacity>
          </View>
        )}
        {!selectedComment?.isUpdateOpen && (
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              keyboardAppearance={theme()}
              style={styles.inputText}
              value={commentText}
              onChangeText={e => setCommentText(e)}
              placeholder={
                user?.fullName ? `Comment as ${user.fullName}` : 'Comment...'
              }
              placeholderTextColor={Colors.BodyText}
              multiline
            />
            <View style={{justifyContent: 'flex-end'}}>
              {commentText?.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setAiModalVisible(!aiModalVisible);
                  }}>
                  <AiIcon2 color={Colors.Primary} size={30} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  {
                    paddingBottom: responsiveScreenHeight(0.5),
                  },
                ]}
                onPress={() => {
                  if (selectedComment?.isReplyOpen) {
                    giveReply({
                      contentId: selectedComment.contentId,
                      comment: commentText,
                      parentId: selectedComment._id,
                    });
                    setCommentText('');
                  } else {
                    isCommenting ? null : handleCreateComment();
                  }
                }}>
                {isCommenting ? (
                  <View style={{paddingBottom: responsiveScreenHeight(1)}}>
                    <ActivityIndicator color={Colors.Primary} size={30} />
                  </View>
                ) : (
                  <SendIcon size={30} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        {<CommentPopup />}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    commentDateContainer: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      backgroundColor: Colors.PrimaryOpacityColor,
      width: 'auto',
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
    },
    commentDate: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BR,
      textAlign: 'center',
      color: Colors.Primary,
    },
    noDataText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      // backgroundColor: Colors.Red,
      paddingVertical: responsiveScreenHeight(1),
      maxHeight: 400,
    },
    container: {
      backgroundColor: Colors.Foreground,
      height: 200,
      width: 300,
      borderRadius: 10,
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: 'center',
    },
    submitBtn: {
      //   paddingTop: 10,
      alignSelf: 'flex-end',
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 36, // Avoid overlap with handle
      paddingHorizontal: 16,
    },
    bottomSheet: {
      overflow: 'hidden',
      zIndex: 99,
    },
    bottomSheetBackground: {
      backgroundColor: Colors.Foreground,
    },
    handle: {
      backgroundColor: Colors.Foreground,
      height: 40,
      borderRadius: 0,
    },
    handleIndicator: {
      backgroundColor: Colors.Foreground,
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    commentText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: RegularFonts.BR,
      color: Colors.BodyText,
      flex: 0.95,
    },
    inputOuterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      paddingBottom: 40,
      marginBottom: -30,
      paddingTop: 10,
      marginTop: 10,
      paddingHorizontal: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.BorderColor,
      // marginVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 30,
      paddingLeft: 10,
    },
  });
