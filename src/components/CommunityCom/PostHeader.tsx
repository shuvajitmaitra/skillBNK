import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ThreeDotGrayIcon from '../../assets/Icons/ThreeDotGrayIcon';
import CustomFonts from '../../constants/CustomFonts';
import Images from '../../constants/Images';
import PostPopup from './Modal/PostPopup';
import {IPost} from '../../types/community/community';
import {TColors} from '../../types';
import {fontSizes, gFontSize} from '../../constants/Sizes';

const PostHeader = ({post}: {post: IPost}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [singlePost, setSinglePost] = useState<IPost | null>(null);

  const n = post?.createdBy?.fullName || 'New User';
  let name = n.split(' ').slice(0, 2).join(' ');

  return (
    <>
      <Pressable
        onPress={event =>
          setSinglePost({
            ...post,
            x: responsiveScreenWidth(93),
            y: event.nativeEvent.pageY,
          })
        }
        style={styles.postHeaderContainer}>
        <View style={styles.rightContainer}>
          <Image
            resizeMode="cover"
            source={
              post?.createdBy?.profilePicture
                ? {
                    uri: post?.createdBy?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.userImg}
          />
          <View>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.fromTime}>
                {moment(post?.createdAt).fromNow()}
              </Text>
            </View>
            <Text style={styles.time}>
              {moment(post?.createdAt).format('llll')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.threeDot}
          onPress={event =>
            setSinglePost({
              ...post,
              x: responsiveScreenWidth(93),
              y: event.nativeEvent.pageY,
            })
          }>
          <ThreeDotGrayIcon />
        </TouchableOpacity>
        {singlePost && (
          <PostPopup
            post={singlePost}
            setSinglePost={() => setSinglePost(null)}
          />
        )}
      </Pressable>
    </>
  );
};

export default PostHeader;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    postHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // backgroundColor: 'green',
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    userNameContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(0.5),
    },
    userImg: {
      height: gFontSize(35),
      width: gFontSize(35),
      borderRadius: 45,
      backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
    },
    userName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.heading,
      color: Colors.Heading,
      // backgroundColor: "red",
    },
    fromTime: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      // backgroundColor: "blue",
      color: Colors.BodyText,
    },
    time: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      // backgroundColor: "blue",
      color: Colors.BodyText,
      marginTop: -5,
    },
    threeDot: {
      padding: 10,
    },
  });
