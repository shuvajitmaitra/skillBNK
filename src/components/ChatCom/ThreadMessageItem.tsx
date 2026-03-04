import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageStyle,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import CustomFonts from '../../constants/CustomFonts';
import Markdown from 'react-native-markdown-display';
import {removeHtmlTags, transFormDate} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import AudioMessage from './AudioMessage';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {IMessage, TFile} from '../../types/chat/messageTypes';
import Images from '../../constants/Images';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import ImageViewing from 'react-native-image-viewing';
import VideoPlayer from '../SharedComponent/VideoPlayer';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {useExtractFiles} from '../../hook/useExtractFiles';
import {borderRadius, gGap} from '../../constants/Sizes';
import DocumentMessage from './DocumentMessage';
import Skeleton from '../SharedComponent/Skeleton';

type ThreadMessageItemProps = {
  message: IMessage;
  replyCount?: number;
  isLoading?: boolean;
};
export default function ThreadMessageItem({
  message,
  replyCount = 0,
  isLoading,
}: ThreadMessageItemProps) {
  const {onlineUsersObj} = useSelector((state: RootState) => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {images, audios, documents} = useExtractFiles(
    (message?.files as TFile[]) || [],
  );
  const [imageView, setImageView] = useState<
    {uri: string; index: number}[] | null
  >(null);
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  // Extract the first file URL if any
  const file =
    message?.files && message?.files?.length > 0 ? message?.files[0] : null;
  const videoUrl = file && file?.type?.startsWith('video/') ? file?.url : null;
  const text =
    message?.text?.length > 130 && !seeMoreClicked
      ? message?.text?.slice(0, 130)
      : message?.text;

  return (
    <View style={styles?.container}>
      <View style={styles?.profileImageContainer}>
        <View>
          {isLoading ? (
            <Skeleton
              width={responsiveScreenWidth(10)}
              height={responsiveScreenWidth(10)}
              borderRadius={100}
              highlightColor={Colors.Foreground}
            />
          ) : (
            <Image
              style={styles?.profileImage as ImageStyle}
              source={
                message?.sender?.profilePicture
                  ? {uri: message?.sender?.profilePicture}
                  : Images.DEFAULT_IMAGE
              }
            />
          )}

          <View
            style={[
              styles?.activeStatus,
              isLoading
                ? {backgroundColor: Colors.Foreground}
                : {
                    backgroundColor: onlineUsersObj[message?.sender?._id]?._id
                      ? Colors.SuccessColor
                      : Colors.BodyText,
                  },
            ]}
          />
        </View>
        <View>
          {isLoading ? (
            <Skeleton
              height={30}
              width={300}
              borderRadius={8}
              highlightColor={Colors.Foreground}
            />
          ) : (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles?.profileName}>
              {message?.sender?.fullName}
            </Text>
          )}
          {isLoading ? (
            <Skeleton
              width={200}
              height={20}
              highlightColor={Colors.Foreground}
            />
          ) : (
            <Text style={styles?.messageTime}>
              {moment(message?.createdAt)?.format('MMM DD, YYYY h:mm A')}
            </Text>
          )}
        </View>
      </View>
      {isLoading ? (
        <Skeleton
          width={350}
          height={60}
          borderRadius={10}
          highlightColor={Colors.Foreground}
        />
      ) : (
        <View
          style={{
            // paddingHorizontal: responsiveScreenWidth(2),
            marginTop: responsiveScreenHeight(1),
            backgroundColor: Colors?.PureWhite,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          {/* Render Markdown text if available */}
          {message?.text ? (
            <Markdown style={styles?.markdownStyle as MarkdownStylesProps}>
              {transFormDate(removeHtmlTags(text))}
            </Markdown>
          ) : null}
          {message?.text?.length > 130 && (
            <GlobalSeeMoreButton
              onPress={() => {
                setSeeMoreClicked(!seeMoreClicked);
              }}
              buttonStatus={seeMoreClicked}
              buttonContainerStyle={{
                marginTop: -5,
                marginBottom: 10,
              }}
              beforeText={'Read more'}
              afterText={'Read less'}
            />
          )}
          {/* Render Image if URL exists */}
          {images.length > 0 && (
            <ScrollView horizontal>
              {images.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      setImageView(images.map(i => ({uri: i.url, index})));
                    }}>
                    <Image
                      key={item._id}
                      source={{uri: item.url}}
                      height={100}
                      width={100}
                      style={{
                        margin: gGap(3),
                        borderWidth: 1,
                        borderColor: Colors.BorderColor,
                        borderRadius: borderRadius.default,
                      }}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
          {audios.length > 0 &&
            audios.map(item => {
              return (
                <View
                  key={item._id}
                  style={{
                    backgroundColor: Colors.Background_color,
                    borderRadius: borderRadius.default,
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                    overflow: 'hidden',
                    marginBottom: gGap(3),
                  }}>
                  <AudioMessage
                    background={Colors?.Background_color}
                    audioUrl={item.url}
                    color={Colors.BodyText}
                  />
                </View>
              );
            })}
          {documents.length > 0 &&
            documents.map(item => {
              return (
                <View
                  key={item._id}
                  style={{
                    backgroundColor: Colors.Background_color,
                    borderRadius: borderRadius.default,
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                    overflow: 'hidden',
                    marginBottom: gGap(3),
                  }}>
                  <DocumentMessage
                    containerStyle={{
                      backgroundColor: 'transparent',
                      marginLeft: gGap(10),
                    }}
                    file={item}
                  />
                </View>
              );
            })}

          {videoUrl && <VideoPlayer url={videoUrl} />}

          {Boolean(imageView?.length) && (
            <ImageViewing
              images={imageView || []}
              imageIndex={imageView?.[0]?.index || 0}
              visible={imageView?.length !== 0}
              onRequestClose={() => setImageView([])}
            />
          )}
        </View>
      )}
      <View style={styles?.replayCountContainer}>
        {isLoading ? (
          <Skeleton
            width={100}
            height={20}
            borderRadius={10}
            highlightColor={Colors.Foreground}
          />
        ) : (
          <Text style={styles?.replayCountText}>
            {replyCount} {replyCount > 1 ? 'Replies' : 'Reply'}
          </Text>
        )}
      </View>
      {/* <Divider /> */}
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet?.create({
    replayCountContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      paddingTop: responsiveScreenHeight(1),
    },
    replayCountText: {
      color: Colors.Primary,
      fontFamily: 'WorkSans-SemiBold',
      fontSize: responsiveScreenFontSize(2),
    },
    container: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(3),
    },
    profileImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    activeStatus: {
      width: 12,
      height: 12,
      borderRadius: 8,
      position: 'absolute',
      right: 0,
      bottom: 0,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      width: responsiveScreenWidth(75),
    },
    messageTime: {
      color: Colors.BodyText,
      paddingVertical: responsiveScreenHeight(0.2),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    threadText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.REGULAR,
    },
    messageImage: {
      // width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.LineColor,
    },

    img: {
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      overflow: 'hidden', // Prevents image overflow from its container
    },
    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        // fontSize: responsiveScreenFontSize(1.9),
        color: Colors.BodyText,
        lineHeight: 20,
        paddingHorizontal: responsiveScreenWidth(3),
        // marginBottom: 100,
        // maxHeight: 100,
      },
      heading1: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading2: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading3: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading4: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      heading5: {
        fontWeight: 'bold',
      },
      heading6: {
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      strong: {fontFamily: CustomFonts.SEMI_BOLD},
      code_inline: {
        color: Colors.BodyText,
      },
      hr: {
        backgroundColor: Colors.BodyText,
      },
      fence: {backgroundColor: Colors.Background_color, color: Colors.BodyText},
      code_block: {
        backgroundColor: Colors.Background_color,
        color: Colors.BodyText,
      },
      blockquote: {
        backgroundColor: Colors.Background_color,
        color: Colors.BodyText,
      },
      table: {
        borderColor: Colors.BorderColor,
      },
      thead: {
        borderColor: Colors.BorderColor,
      },
      tbody: {
        borderColor: Colors.BorderColor,
      },
      th: {
        borderColor: Colors.BorderColor,
      },
      tr: {
        borderColor: Colors.BorderColor,
      },
      td: {
        borderColor: Colors.BorderColor,
      },
      link: {
        // backgroundColor: myMessage
        //   ? Colors.Foreground
        //   : Colors.LightGreen,
        color: Colors.Primary,
        // fontWeight: "bold",
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
    } as any,
  });
