import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {fontSizes} from '../../constants/Sizes';
import {TColors, TComment} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {RootState} from '../../types/redux/root';
import Comment from '../CommunityCom/Comment';
import {formatDynamicDate} from '../../utility/commonFunction';
import {RegularFonts} from '../../constants/Fonts';
import {FontAwesomeIcon} from '../../constants/Icons';
import {getComments} from '../../actions/chat-noti';
import store from '../../store';
import {setComments} from '../../store/reducer/commentReducer';

// Define props interface
interface CommentFieldProps {
  postId: string;
  disable?: boolean;
  onPress?: () => void;
}

const CommentField: React.FC<CommentFieldProps> = ({
  postId,
  disable = false,
  onPress,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const {comments = []} = useSelector((state: RootState) => state.comment);
  const openCommentModal = () => {
    navigation.navigate('CommentScreen', {contentId: postId});
  };
  const contentId = postId;

  useEffect(() => {
    getComments(contentId);

    return () => {
      store.dispatch(setComments([]));
    };
  }, [contentId]);
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
          <Comment comment={comment} isPreview={true} />
        </React.Fragment>
      );
    },
    [filteredComments, styles.commentDate, styles.commentDateContainer],
  );

  return (
    <View>
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
        <Pressable
          style={styles.inputText}
          disabled={disable}
          onPress={() => {
            onPress ? onPress() : openCommentModal();
          }}>
          <Text
            style={{
              fontFamily: CustomFonts.REGULAR,
              fontSize: fontSizes.body,
              color: Colors.BodyText,
            }}>
            {user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'}
          </Text>
        </Pressable>
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
              <FontAwesomeIcon
                name="comments"
                size={111}
                color={Colors.BodyText}
              />
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
    </View>
  );
};

export default CommentField;

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
    writeComment: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginTop: responsiveScreenHeight(2),
    },
    profileImg: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      objectFit: 'cover',
      borderRadius: 50,
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(6),
      borderRadius: 12,
      paddingVertical: responsiveScreenHeight(1),
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  });
