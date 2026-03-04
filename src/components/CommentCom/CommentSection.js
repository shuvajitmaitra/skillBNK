import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Divider from '../SharedComponent/Divider';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {Image} from 'react-native';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Comment from '../CommunityCom/Comment';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import axiosInstance from '../../utility/axiosInstance';
import {getComments} from '../../actions/chat-noti';
import Images from '../../constants/Images';
import {RegularFonts} from '../../constants/Fonts';
import {
  formatDynamicDate,
  showAlertModal,
  theme,
} from '../../utility/commonFunction';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';

const CommentSection = ({postId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const {comments} = useSelector(state => state.comment);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setCommenting] = useState(false);
  const handleCreateComment = () => {
    if (!commentText.trim()) {
      // return Alert.alert("Empty Comment", "Comment cannot be empty.");
      return showAlertModal({
        title: 'Empty Comment',
        type: 'warning',
        message: 'Comment cannot be empty.',
      });
    }

    setCommenting(true);
    axiosInstance
      .post('/content/comment/create', {
        comment: commentText,
        contentId: postId,
      })
      .then(res => {
        if (res.data.success) {
          getComments(postId);
        }
        setCommentText('');
        setCommenting(false);
      })
      .catch(error => {
        console.log('error to create comment', JSON.stringify(error, null, 1));
        setCommenting(false);
      });
  };

  return (
    <View>
      <Divider marginTop={0.0000001} />
      <Text style={styles.comments}>Comments</Text>
      <View style={styles.writeComment}>
        <Image
          source={
            user.profilePicture
              ? {
                  uri: `${user.profilePicture}`,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.profileImg}
        />
        <TextInput
          keyboardAppearance={theme()}
          style={styles.inputText}
          value={commentText}
          onChangeText={e => setCommentText(e)}
          placeholder="Type Comment..."
          placeholderTextColor={Colors.BodyText}
          multiline
          textAlignVertical="top"
        />
      </View>
      <View style={styles.submit}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            isCommenting ? null : handleCreateComment();
          }}>
          {isCommenting ? (
            <LoadingSmall />
          ) : (
            <Text style={styles.submitBtnText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      <View>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            if (postId !== comment.contentId) {
              return null;
            }
            const isSameDate =
              new Date(comments[index]?.createdAt).toDateString() ===
              new Date(comments[index - 1]?.createdAt).toDateString();

            return (
              <React.Fragment key={comment._id}>
                {(index === 0 || !isSameDate) && (
                  <View style={styles.commentDateContainer}>
                    <Text style={styles.commentDate}>
                      {/* {moment(comments[index].createdAt).format("MMM DD, YYYY")} */}
                      {formatDynamicDate(comments[index].createdAt)}
                    </Text>
                  </View>
                )}
                <Comment comment={comment} />
              </React.Fragment>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No comments available</Text>
        )}
      </View>
      <GlobalAlertModal />
    </View>
  );
};

export default CommentSection;

const getStyles = Colors =>
  StyleSheet.create({
    commentDateContainer: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      backgroundColor: Colors.PrimaryOpacityColor,
      width: responsiveScreenWidth(30),
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
    },
    commentDate: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      color: Colors.Primary,
    },
    commentField: {
      minHeight: responsiveScreenHeight(6),
      // backgroundColor: "pink",
      width: '90%',
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
    writeComment: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
      marginTop: responsiveScreenHeight(2),
    },
    profileImg: {
      width: responsiveScreenWidth(13),
      height: responsiveScreenWidth(13),
      objectFit: 'cover',
      borderRadius: 50,
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      backgroundColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(8),
      borderRadius: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
    },
    submitBtn: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(30),
      marginVertical: responsiveScreenHeight(2),
      verticalAlign: 'top',
    },
    submitBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    submit: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 2,
      paddingBottom: responsiveScreenHeight(1),
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    noDataText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
  });
