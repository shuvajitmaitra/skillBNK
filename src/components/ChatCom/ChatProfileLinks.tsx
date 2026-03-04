import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import React, {useCallback} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {RootState} from '../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../SharedComponent/Loading';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {updateMQ} from '../../store/reducer/chatSlice';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {TColors} from '../../types';
import moment from 'moment';
import {fontSizes, gFontSize, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import TextRender from '../SharedComponent/TextRender';

const ChatProfileLinks = ({
  handleCreateChat,
}: {
  handleCreateChat: (item: {
    _id: string;
    profilePicture: string;
    fullName: string;
  }) => void;
}) => {
  const dispatch = useDispatch();
  const {chatLinksInfo} = useSelector((state: RootState) => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleSeeMore = useCallback(() => {
    dispatch(
      updateMQ({
        tab: 'link',
        type: 'link',
        page: chatLinksInfo?.page + 1,
        limit: 5,
        query: '',
        chatId: chatLinksInfo?.chatId,
      }),
    );
  }, [chatLinksInfo?.chatId, chatLinksInfo?.page, dispatch]);

  const handleOpenLink = useCallback((url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  }, []);

  const extractLinkText = (url: string) => {
    // Remove https://
    let displayText = url.replace(/https?:\/\//i, '');

    // Truncate long URLs
    if (displayText.length > 40) {
      displayText = displayText.substring(0, 40) + '...';
    }

    return displayText;
  };
  if (chatLinksInfo === null) {
    return (
      <View>
        <Loading />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {chatLinksInfo?.medias?.length > 0 ? (
        <View style={{gap: gGap(10)}}>
          {chatLinksInfo?.medias?.map((item: any) => (
            <View key={Math.random()} style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  item.sender._id &&
                    handleCreateChat({
                      _id: item?.sender?._id,
                      profilePicture: item?.sender.profilePicture,
                      fullName: item?.sender?.fullName,
                    });
                }}
                style={styles.contentContainer}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: item?.sender?.profilePicture,
                    // priority: FastImage.priority.normal,
                  }}
                />
                <View style={styles.headerContainer}>
                  <Text style={styles.userName}>{item?.sender?.fullName}</Text>
                  <Text style={styles.timeStamp}>
                    {moment(item.createdAt).format('LLLL')}
                  </Text>
                </View>
              </TouchableOpacity>
              {item?.text && <TextRender text={item?.text || ''} />}
              <TouchableOpacity
                style={styles.linkContainer}
                onPress={() => handleOpenLink(item?.url)}>
                <Text style={styles.linkText}>
                  {extractLinkText(item?.url)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {chatLinksInfo?.medias?.length < chatLinksInfo?.totalCount && (
            <GlobalSeeMoreButton onPress={handleSeeMore} buttonStatus={false} />
          )}
        </View>
      ) : (
        <NoDataAvailable />
      )}
    </View>
  );
};

export default ChatProfileLinks;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    itemContainer: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      borderRadius: gGap(10),
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: gGap(35),
      height: gGap(35),
      borderRadius: 20,
    },
    contentContainer: {
      //   backgroundColor: 'red',
      flexDirection: 'row',
      gap: gGap(5),
    },
    headerContainer: {
      //   flexDirection: 'row',
      //   justifyContent: 'space-between',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.Heading,
    },
    timeStamp: {
      fontSize: 12,
      color: Colors.BodyText || '#888',
    },
    messageText: {
      fontSize: 14,
      color: Colors.Heading,
      marginBottom: 8,
    },
    linkContainer: {
      backgroundColor: Colors.BodyTextOpacity || '#2A2A2A',
      padding: 12,
      borderRadius: 8,
      marginTop: 5,
    },
    linkText: {
      fontSize: 14,
      color: Colors.BodyText || '#3897F0',
    },
    markdown: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: fontSizes.body,
        color: Colors.BodyText,
        lineHeight: gFontSize(22),
      },
      paragraph: {
        marginTop: gGap(2), // Remove top margin from paragraphs
        marginBottom: gGap(2), // Remove bottom margin from paragraphs
        // padding: 0, // Remove padding from paragraphs
      },
      link: {
        color: Colors.Primary,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
      },
      heading1: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading2: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading3: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading4: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading5: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading6: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: RegularFonts.BR,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontStyle: 'italic',
        fontSize: RegularFonts.BR,
        fontWeight: '500',
      },
      code_inline: {
        backgroundColor: Colors.PrimaryOpacityColor,
      },
      fence: {
        marginBottom: 10,
        padding: 8,
        borderRadius: 6,
        backgroundColor: Colors.Foreground,
        borderWidth: 1,
        borderColor: Colors.BorderColor,
      },
      code_block: {
        borderWidth: 0,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
      },
    } as any,
  });
