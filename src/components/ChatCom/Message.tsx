import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Markdown from 'react-native-markdown-display';
import {
  autoLinkify,
  convertToCorrectMarkdown,
  generateActivityText,
  removeHtmlTags,
  sliceText,
  transFormDate,
} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import {useNavigation} from '@react-navigation/native';
import DeleteMessageContainer from './DeleteMessageContainer';
import MessageFileContainer from './MessageFileContainer';
import axiosInstance from '../../utility/axiosInstance';
import {setSingleChat} from '../../store/reducer/chatReducer';
import MessageBottomContainer from './MessageBottomContainer';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import {RegularFonts} from '../../constants/Fonts';
import MessageDateContainer from './MessageDateContainer';
import MessagePreviewContainer from './MessagePreviewContainer';
import {RootState} from '../../types/redux/root';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import {TColors} from '../../types';
import {IMessage} from '../../types/chat/messageTypes';
import {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircleLoader from '../SharedComponent/CircleLoader';
import ThreeDotIconTwo from '../../assets/Icons/ThreeDotIconTwo';
import CalendarEventContainer from './CalendarEventContainer';
import Divider from '../SharedComponent/Divider';
import PinIcon from '../../assets/Icons/PinIcon';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import {fontSizes, gFontSize, gGap, gMargin} from '../../constants/Sizes';
import {showToast} from '../HelperFunction';
import {loadChats} from '../../actions/chat-noti';
import {IoniconsIcon} from '../../constants/Icons';
type MessageProps = {
  item: IMessage;
  setViewImage?: React.Dispatch<
    React.SetStateAction<{uri: string; index: number}[]>
  >;
};
const MCicons = MaterialCommunityIcons as any;

const Message = ({item, setViewImage}: MessageProps) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {onlineUsersObj, chatsObj} = useSelector(
    (state: RootState) => state.chat,
  );
  const [readMoreClicked, setReadMoreClicked] = useState(false);
  const Colors = useTheme();
  const my = item.sender?._id === user?._id;
  const styles = getStyles(Colors, my);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const senderName =
    item?.sender?.profilePicture === user?.profilePicture
      ? 'You'
      : item?.sender?.firstName;

  const handleCreateChat = async (userId: string) => {
    if (user?._id === userId) {
      return showToast({message: "It's you"});
    }
    if (chatsObj[userId]) {
      return dispatch(setSingleChat(chatsObj[userId]));
    }
    try {
      const res = await axiosInstance.post(`/chat/findorcreate/${userId}`);
      if (res.data.success) {
        dispatch(
          setSingleChat({...res.data.chat, ...chatsObj[res.data.chat?._id]}),
        );
        dispatch(setCurrentRoute('MessageScreen'));
        navigation.push('MessageScreen', {from: 'crowd'});
        loadChats();
      }
    } catch (err: any) {
      console.error('Error creating chat:', err?.response?.data);
    }
  };

  if (item.type === 'event') {
    if (item.type === 'event') {
      return null;
    }
    return (
      <CalendarEventContainer
        item={item}
        my={my}
        handleCreateChat={handleCreateChat}
      />
    );
  }

  function openUrl(url: string) {
    if (url.match(/^[0-9a-fA-F]{24}$/)) {
      // it's an ObjectID
      handleCreateChat(url);
    }
    return true;
  }

  if (item.type === 'delete') {
    return (
      <>
        {item.parentMessage && (
          <>
            {!item?.isSameDate ? (
              <MessageDateContainer time={item?.createdAt} />
            ) : (
              <Divider marginTop={1} marginBottom={1} />
            )}
          </>
        )}
        <DeleteMessageContainer
          time={item?.createdAt}
          name={item.sender.fullName || 'Unknown User'}
          pic={item?.sender?.profilePicture || ''}
          active={Boolean((onlineUsersObj as any)[item.sender?._id]) as boolean}
        />
        {!item.parentMessage && (
          <>
            {!item?.isSameDate ? (
              <MessageDateContainer time={item?.createdAt} />
            ) : (
              <Divider marginTop={1} marginBottom={1} />
            )}
          </>
        )}
      </>
    );
  }
  if (item.type === 'activity') {
    return (
      <>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            {generateActivityText(item, senderName)}
          </Text>
        </View>
      </>
    );
  }
  return (
    <View style={styles.mainContainer}>
      {/* {item?.isSameDate && !item?.parentMessage && (
        <Divider marginTop={1} marginBottom={1} />
      )} */}
      {!item?.isSameDate ? (
        <MessageDateContainer time={item?.createdAt} />
      ) : (
        <Divider marginTop={1} marginBottom={1} />
      )}
      {/* {item.type ==="activity"&& return (renderActivity())}
      {renderDelete()} */}
      {/* {!my && (nextSender || !item?.isSameDate) && (
        <UserNameImageSection
          name={item?.sender?.fullName}
          image={item?.sender?.profilePicture}
          handleCreateChat={handleCreateChat}
        />
      )} */}
      <View style={styles.messageOuterContainer}>
        <TouchableOpacity onPress={() => handleCreateChat(item?.sender?._id)}>
          {item.sender.profilePicture ? (
            <Image
              resizeMode="contain"
              source={{
                uri: item.sender.profilePicture,
              }}
              style={styles.userImg}
            />
          ) : (
            <View style={{marginLeft: 5, marginTop: 2}}>
              <UserIconTwo size={35} />
            </View>
          )}
          {item?.sender?.type !== 'bot' && (
            <View
              style={[
                styles.activeStatus,
                {
                  backgroundColor:
                    (Boolean(
                      (onlineUsersObj as any)[item.sender?._id],
                    ) as boolean) || user._id === item.sender._id
                      ? Colors.SuccessColor
                      : Colors.BodyText,
                },
              ]}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            maxWidth: '85%',
            // backgroundColor: 'blue',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setMessageOptionData({...item, my}));
            }}
            style={[
              styles.messagesContainer,
              Boolean(item?.text?.length > 50) && {width: '100%'},
              item.files.length > 0 && {width: '100%'},
              item?.files[0]?.type?.startsWith('image') && {width: '100%'},
            ]}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.messageHeader}>
                <Text style={styles.name}>{item.sender.fullName}</Text>
                <Text style={styles.timeText}>
                  {moment(item.editedAt || item?.createdAt).format(' h:mm A')}
                </Text>
              </View>
              {item?.pinnedBy?._id && (
                <View
                  style={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                  }}>
                  <PinIcon />
                </View>
              )}
              <TouchableOpacity
                onPress={() => dispatch(setMessageOptionData({...item, my}))}
                style={styles.threeDotContainer}>
                <ThreeDotIconTwo size={15} />
              </TouchableOpacity>
            </View>
            {/* {offline?._id && (
              <Text
                style={{
                  fontSize: gFontSize(8),
                  color: Colors.BodyText,
                }}>{`Offline at ${moment(offline.offlineAt).format(
                'hh:mm A MMM DD, YYYY',
              )}`}</Text>
            )} */}
            {/* -------------------------- */}
            {/* -----------  ----------- */}
            {/* -------------------------- */}

            <View
              style={
                !readMoreClicked && item?.text?.length > 300
                  ? {}
                  : {
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }
              }>
              <View style={{width: '100%'}}>
                <MessagePreviewContainer text={item?.text} />
              </View>
              {item?.files?.length > 0 && (
                <MessageFileContainer
                  files={item.files}
                  setViewImage={setViewImage}
                />
              )}
              <Markdown
                onLinkPress={openUrl}
                style={
                  {
                    ...styles.markdown,
                    body: {
                      fontFamily: CustomFonts.LATO_REGULAR,
                      fontSize: fontSizes.body,
                      color: Colors.BodyText,
                      lineHeight: gFontSize(22),
                      width: item?.text?.length > 50 ? '100%' : 'auto',
                    },
                  } as MarkdownStylesProps
                }>
                {sliceText(
                  autoLinkify(
                    transFormDate(
                      removeHtmlTags(
                        convertToCorrectMarkdown(item?.text?.trim()) || '',
                      ),
                    ),
                  ),
                  readMoreClicked,
                )}
              </Markdown>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    item?.text?.length > 300 ? 'space-between' : 'flex-end',
                  marginLeft:
                    !readMoreClicked && item?.text?.length > 300
                      ? null
                      : 'auto',
                  alignItems:
                    item?.text?.length > 300 || item.editedAt
                      ? 'flex-end'
                      : 'flex-end',
                }}>
                {!readMoreClicked && item?.text?.length > 300 && (
                  <TouchableOpacity onPress={() => setReadMoreClicked(true)}>
                    <Text style={styles.readMoreText}>Read more</Text>
                  </TouchableOpacity>
                )}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item.forwardedFrom && (
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: gGap(5),
                        paddingLeft: gGap(5),
                      }}>
                      <IoniconsIcon
                        name="return-up-forward"
                        size={20}
                        color={Colors.BodyText}
                      />
                      <Text
                        style={{
                          color: Colors.BodyText,
                          fontFamily: CustomFonts.REGULAR,
                        }}>
                        forwarded
                      </Text>
                    </View>
                  )}

                  {item.editedAt && (
                    <Text style={{color: Colors.Red, paddingLeft: gGap(5)}}>
                      (Edited)
                    </Text>
                  )}

                  {my && !item.parentMessage && (
                    <View style={{paddingLeft: 5}}>
                      {item?.status === 'seen' ? (
                        <MCicons
                          style={styles.iconStyle}
                          color={Colors.ThemeAnotherButtonColor}
                          size={15}
                          name="check-all"
                        />
                      ) : item?.status === 'sent' ? (
                        <MCicons
                          style={styles.iconStyle}
                          size={15}
                          color={Colors.BodyText}
                          name="check"
                        />
                      ) : item?.status === 'delivered' ? (
                        <MCicons
                          style={styles.iconStyle}
                          color={Colors.BodyText}
                          size={15}
                          name="check-all"
                        />
                      ) : item?.status === 'sending' ? (
                        <CircleLoader />
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <MessageBottomContainer item={item} navigation={navigation} />
    </View>
  );
};

export default Message;

const getStyles = (Colors: TColors, my: boolean) =>
  StyleSheet.create({
    iconStyle: {
      alignSelf: 'flex-start',
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
      marginLeft: 5,
      marginTop: 2,
    },
    activeStatus: {
      width: 10,
      height: 10,
      position: 'absolute',
      right: 0,
      bottom: 0,
      borderRadius: 50,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    timeText: {
      color: Colors.BodyText,
      alignSelf: 'flex-end',
      marginRight: 5,
      fontSize: responsiveScreenFontSize(1.4),
    },
    name: {
      //   alignSelf: 'flex-end',
      color: Colors.Heading,
      fontWeight: '500',
      fontFamily: CustomFonts.MEDIUM,
      // marginBottom: responsiveScreenHeight(1),
      // backgroundColor: 'blue',
      fontSize: responsiveScreenFontSize(1.8),
    },
    messageOuterContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 5,
    },
    readMoreText: {
      color: Colors.ThemeAnotherButtonColor,
      fontSize: RegularFonts.BR,
      height: 20,
      width: 100,
      fontFamily: CustomFonts.MEDIUM,
    },
    threeDotContainer: {
      // position: 'absolute',
      // right: 0,
      // top: 5,

      // width: 20,
      // backgroundColor: 'red',
      // height: 30,
      // zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    copyText: {
      fontSize: 18,
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
    },
    copyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // gap: ,
      paddingRight: 10,
    },

    activityText: {
      backgroundColor: Colors.Foreground,
      color: Colors.BodyText,
      paddingVertical: 3,
      paddingHorizontal: 5,
      borderRadius: 3,
      fontFamily: CustomFonts.LATO_REGULAR,
    },
    activityContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginVertical: 5,
    },

    mainContainer: {
      flex: 1,
    },
    messagesContainer: {
      backgroundColor: my
        ? Colors.PrimaryOpacityColor
        : Colors.Background_color,
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      minWidth: '25%',
      position: 'relative',
    },

    markdown: {
      whiteSpace: 'pre',
      hr: {backgroundColor: Colors.LineColor, marginTop: gGap(5)},

      body: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        color: Colors.BodyText,
        lineHeight: 25,
      },
      paragraph: {
        marginTop: gMargin(2), // Remove top margin from paragraphs
        marginBottom: gMargin(2), // Remove bottom margin from paragraphs
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
        backgroundColor: Colors.PrimaryOpacityColor,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
        backgroundColor: Colors.Foreground,
      },
    } as any,
  });
