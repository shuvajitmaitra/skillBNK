import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import Divider from '../SharedComponent/Divider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {IPost} from '../../types/community/community';
import {TColors} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  setRepostInfo,
  setSelectedPost,
} from '../../store/reducer/communityReducer';
import {fontSizes, gFontSize, gMargin} from '../../constants/Sizes';
import {FeatherIcon} from '../../constants/Icons';
import ReactionContainer from './ReactionContainer';
import {RootState} from '../../types/redux/root';

const MIcon = MaterialIcons as any;

type PostFooterSectionProps = {
  post: IPost;
  // showComments: boolean;
};

const PostFooterSection = ({post}: PostFooterSectionProps) => {
  const dispatch = useDispatch();
  let emojis = [
    {
      name: 'Like',
      symbol: '👍',
    },
    {
      name: 'Lovely',
      symbol: '😍',
    },
    {
      name: 'Love',
      symbol: '❤️',
    },
    {
      name: 'Haha',
      symbol: '😂',
    },
    {
      name: 'Care',
      symbol: '🥰',
    },
    {
      name: 'Wow',
      symbol: '😯',
    },
  ];

  const emojiType = () => {
    const emoji = emojis.find(emo => emo.symbol === post.myReaction);
    if (emoji && emoji.name === 'Love') {
      return '#f44233';
    } else if (emoji && emoji.name === 'Like') {
      return '#fad766';
    } else if (emoji && emoji.name === 'Haha') {
      return '#fced43';
    } else if (emoji && emoji.name === 'Care') {
      return '#ec9a13';
    } else if (emoji && emoji.name === 'Wow') {
      return '#fad766';
    } else if (emoji && emoji.name === 'Lovely') {
      return '#ec9a13';
    } else {
      return Colors.BodyText;
    }
  };
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const buttonRef = useRef(null);
  const {selectedPost} = useSelector((state: RootState) => state.community);
  // const [touchPosition, setTouchPosition] = useState<{
  //   x: number;
  //   y: number;
  // } | null>(null);
  const customArray = Object.entries(post.reactions).map(([key, value]) => ({
    key,
    value,
  }));
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openComment = () => {
    navigation.navigate('CommentScreen', {contentId: post._id || ''});
  };
  const handleReactPress = (event: any) => {
    const {pageX, pageY} = event.nativeEvent;
    // setTouchPosition({x: pageX, y: pageY});

    dispatch(setSelectedPost({...post, x: pageX, y: pageY}));
  };

  return (
    <>
      <View style={styles.firstContainer}>
        <View style={styles.reactContainer}>
          {customArray.length > 0 &&
            customArray.map((item, index) => (
              <View key={index} style={styles.likesContainer}>
                <Text style={styles.text}>{item.value || 0}</Text>
                <Text style={{fontSize: fontSizes.body}}>{item.key}</Text>
              </View>
            ))}
        </View>

        {Boolean(
          selectedPost?._id === post._id && selectedPost?.x && selectedPost.y,
        ) && <ReactionContainer />}

        {post?.commentsCount > 0 && (
          <TouchableOpacity
            onPress={openComment}
            style={styles.commentsContainer}>
            <Text style={styles.text}>
              {post.commentsCount}{' '}
              {post.commentsCount === 1 ? 'comment' : 'comments'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Divider marginBottom={0.5} marginTop={0.5} />
      <View style={styles.postFooterContainer}>
        <TouchableOpacity
          ref={buttonRef}
          onPress={handleReactPress}
          style={styles.shareButtonContainer}>
          {post.myReaction ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveScreenWidth(1),
                // backgroundColor: 'red',
                width: responsiveScreenWidth(17),
              }}>
              <Text style={{fontSize: responsiveScreenFontSize(2)}}>
                {post.myReaction}
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    color: emojiType(),
                  },
                ]}>
                {emojis.find(emoji => emoji.symbol === post.myReaction)?.name}
              </Text>
            </View>
          ) : (
            <>
              <MIcon name={'add-reaction'} size={18} color={Colors.BodyText} />
              <Text
                style={[
                  styles.text,
                  {
                    color: Colors.BodyText,
                  },
                ]}>
                React
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openComment}
          style={styles.shareButtonContainer}>
          <CommentsIcon size={gFontSize(18)} />
          <Text style={[styles.text]}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch(setRepostInfo({...post, repostModalVisible: true}));
          }}
          style={styles.shareButtonContainer}>
          <FeatherIcon name="refresh-ccw" size={18} color={Colors.BodyText} />
          <Text style={[styles.text]}>Repost</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PostFooterSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    firstContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    likesContainer: {
      borderRadius: 100,
      paddingHorizontal: responsiveScreenWidth(2),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(0.3),
    },
    reactContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      flexWrap: 'wrap',
      flex: 1,
      marginTop: gMargin(10),
    },
    commentsContainer: {
      paddingHorizontal: responsiveScreenWidth(2),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: fontSizes.body,
      color: Colors.BodyText,
    },
    postFooterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      // backgroundColor: 'blue',
    },
    shareButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      // backgroundColor: 'red',
      // flex: 1,
      height: 'auto',
    },
  });
