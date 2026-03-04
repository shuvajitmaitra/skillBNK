import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {IMessage} from '../../types/chat/messageTypes';
import {TColors} from '../../types';
import axiosInstance from '../../utility/axiosInstance';
import {IEvent, IParticipant} from '../../types/calendar/event';
import {handleOpenLink, removeMarkdown, showToast} from '../HelperFunction';
import MessageDateContainer from './MessageDateContainer';
import {Image} from 'react-native';
import Images from '../../constants/Images';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import MessageBottomContainer from './MessageBottomContainer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import moment from 'moment';
// import ThreeDotIconTwo from '../../assets/Icons/ThreeDotIconTwo';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {eventTypes, onShare} from '../../utility/commonFunction';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import Markdown from 'react-native-markdown-display';
import UsersIconsTwo from '../../assets/Icons/UsersIconTwo';
// import NotifyBell from '../../assets/Icons/NotifyBell';
import ShareIcon from '../../assets/Icons/ShareIcon';
import EventHistory from '../Calendar/EventHistory';
import {RegularFonts} from '../../constants/Fonts';
import {fontSizes, gFontSize} from '../../constants/Sizes';

interface ICalendarEventContainerProps {
  item: IMessage;
  my: boolean;
  handleCreateChat: (userId: string) => void;
}

const CalendarEventContainer = ({
  item,
  my,
  handleCreateChat,
}: ICalendarEventContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, my);
  const eventId = item?.metaData?.eventId;
  const {onlineUsersObj} = useSelector((state: RootState) => state.chat);
  // const [messages = {}, setMessages] =
  //   useMMKVObject<MessageProps>('allMessages');

  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          showToast({message: 'No event ID provided'});
        }
        console.log('eventId', JSON.stringify(eventId, null, 2));
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/calendar/event/details/${eventId}`,
        );
        setEventData(response.data.event);
        // console.log(
        //   'response.data.event',
        //   JSON.stringify(response.data.event, null, 2),
        // );
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(errorMessage);
        console.log(
          'err.response.data',
          JSON.stringify(err.response.data, null, 2),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.Primary} />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      );
    }

    if (eventData) {
      return (
        <View style={styles.mainContainer}>
          {!item?.isSameDate && <MessageDateContainer time={item?.createdAt} />}
          <View style={styles.messageOuterContainer}>
            <TouchableOpacity
              onPress={() => handleCreateChat(item?.sender?._id)}>
              <Image
                resizeMode="contain"
                source={
                  item.sender.profilePicture
                    ? {
                        uri: item.sender.profilePicture,
                      }
                    : Images.DEFAULT_IMAGE
                }
                style={styles.userImg}
              />
              {item?.sender?.type !== 'bot' && (
                <View
                  style={[
                    styles.activeStatus,
                    {
                      backgroundColor: onlineUsersObj[item.sender._id]
                        ? Colors.SuccessColor
                        : Colors.BodyText,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => dispatch(setMessageOptionData({...item, my}))}
              style={[styles.messagesContainer]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.messageHeader}>
                  <Text style={styles.name}>{item.sender.fullName}</Text>
                  <Text style={styles.timeText}>
                    {moment(item.editedAt || item?.createdAt).format(' h:mm A')}
                  </Text>
                </View>
                {/* <TouchableOpacity
                  // onPress={() =>
                  //   dispatch(setMessageOptionData({...item, my}))
                  // }
                  disabled
                  style={styles.threeDotContainer}>
                  <ThreeDotIconTwo size={15} />
                </TouchableOpacity> */}
              </View>
              {/* -------------------------- */}
              {/* -----------  ----------- */}
              {/* -------------------------- */}
              <View>
                <Text style={styles.EventDetailsHeadingTitle}>
                  Event Details
                </Text>
                <Text style={styles.EventHeading}>{eventData?.title}</Text>
                <Text style={styles.eventType}>
                  Event Type: {eventTypes(eventData?.eventType)}
                </Text>
                <Text style={styles.time}>
                  Start Time:{' '}
                  {moment(eventData?.start).format('MMM DD, YYYY h:mm A')}
                </Text>
                <Text style={styles.time}>
                  End Time:{' '}
                  {moment(eventData?.end).format('MMM DD, YYYY h:mm A')}
                </Text>
                <Text style={styles.joinLinkHeading}>Meeting Join Link</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                    width: '100%',
                  }}>
                  {eventData?.meetingLink ? (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          handleOpenLink(removeMarkdown(eventData?.meetingLink))
                        }>
                        <Text style={styles.meetingLinkText}>
                          {removeMarkdown(eventData?.meetingLink)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginRight: responsiveScreenWidth(3)}}
                        onPress={() =>
                          onShare(removeMarkdown(eventData?.meetingLink))
                        }>
                        <ShareIcon />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={styles.time}>No Meeting link available</Text>
                  )}
                </View>
                {/* <View
                  style={[
                    styles.smallContainer,
                    {marginVertical: responsiveScreenHeight(2)},
                  ]}>
                  <NotifyBell color={Colors.Heading} />
                  <Text style={styles.NoReaminder}>
                    {eventNotification[0]?.timeBefore
                      ? `Remainder before ${eventNotification[0].timeBefore} minutes`
                      : 'Remainder before 5 minutes'}
                  </Text>
                </View> */}
                <View
                  style={[
                    styles.smallContainer,
                    {marginVertical: responsiveScreenHeight(1.5)},
                  ]}>
                  <UsersIconsTwo color={Colors.Heading} />
                  <Text style={styles.NoReaminder}>
                    {eventData?.participants?.length} Invited Guest
                  </Text>
                </View>
                {eventData?.participants?.map(
                  (singleItem: IParticipant, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.smallContainer,
                        {marginBottom: responsiveScreenHeight(1)},
                      ]}>
                      <Image
                        source={
                          singleItem?.user?.profilePicture
                            ? {uri: singleItem.user.profilePicture}
                            : Images.DEFAULT_IMAGE
                        }
                        style={styles.images as ImageStyle}
                      />
                      <Text style={styles.meetingLinkText}>
                        {singleItem?.user?.fullName}
                      </Text>
                    </View>
                  ),
                )}
                <Text style={styles.joinLinkHeading}>Organizer</Text>
                <View
                  style={[
                    styles.smallContainer,
                    {
                      marginBottom: responsiveScreenHeight(1),
                      marginTop: responsiveScreenHeight(1),
                    },
                  ]}>
                  <Image
                    source={
                      eventData?.createdBy?.profilePicture
                        ? {uri: eventData.createdBy.profilePicture}
                        : Images.DEFAULT_IMAGE
                    }
                    style={styles.images as ImageStyle}
                  />
                  <Text style={styles.meetingLinkText}>
                    {eventData?.createdBy?.fullName}
                  </Text>
                </View>
                <Text style={styles.textAreaHeading}>My Response</Text>
                <Text
                  style={[
                    styles.meetingLinkText,
                    {
                      color:
                        eventData?.myParticipantData?.status === 'accepted'
                          ? Colors.Primary
                          : eventData?.myParticipantData?.status === 'pending'
                          ? Colors.ThemeSecondaryColor
                          : Colors.Red,
                    },
                  ]}>
                  {eventData?.myParticipantData?.status}
                </Text>
                <Text style={styles.textAreaHeading}>
                  Meeting Agenda/Follow Up/Action Item
                </Text>
                <View style={styles.inputContainer}>
                  <Markdown style={styles.markdown as MarkdownStylesProps}>
                    {eventData?.agenda ||
                      'meeting agenda/follow up/action item'}
                  </Markdown>
                </View>
                <Text style={styles.Text}>Event Changed History</Text>
                <EventHistory
                  participants={eventData?.participants}
                  eventId={eventData?._id}
                />
              </View>
            </TouchableOpacity>
          </View>

          <MessageBottomContainer item={item} navigation={navigation} />
        </View>
      );
    }

    return null;
  };

  return <>{renderContent()}</>;
};

export default React.memo(CalendarEventContainer, (prevProps, nextProps) => {
  return prevProps.item.metaData?.eventId === nextProps.item.metaData?.eventId;
});

// Styles remain the same as previous implementation
const getStyles = (Colors: TColors, my: boolean) =>
  StyleSheet.create({
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginVertical: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'flex-start',
      paddingLeft: responsiveScreenWidth(3),
      borderColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(10),
    },
    markdown: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        color: Colors.BodyText,
        lineHeight: gFontSize(25),
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      link: {
        color: Colors.Primary,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: fontSizes.body,
      },
      heading1: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading2: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading3: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading4: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading5: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading6: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: fontSizes.body,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.REGULAR,
        fontStyle: 'italic',
        fontSize: fontSizes.body,
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
        fontFamily: CustomFonts.REGULAR,
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
    textAreaHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      marginTop: responsiveScreenHeight(2),
    },
    NoReaminder: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    noteTitle: {
      fontSize: responsiveScreenFontSize(1.9),
      paddingVertical: responsiveScreenWidth(4),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    noteTextArea: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(0.6),
      paddingBottom: responsiveScreenHeight(7),
      marginBottom: responsiveScreenHeight(1.4),
      borderRadius: responsiveScreenWidth(3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      fontSize: responsiveScreenFontSize(1.9),
    },
    images: {
      borderRadius: 100,
      height: responsiveScreenWidth(7),
      width: responsiveScreenWidth(7),
    },
    smallContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 5,
      alignItems: 'center',
    },
    meetingLinkText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      maxWidth: '90%',
      textTransform: 'capitalize',
    },
    joinLinkHeading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginTop: responsiveScreenHeight(3),
      marginBottom: responsiveScreenHeight(0.5),
      fontSize: responsiveScreenFontSize(2),
    },
    time: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(-0.5),
    },
    eventType: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: responsiveScreenHeight(1),
    },
    EventHeading: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(1.5),
    },
    EventDetailsHeadingTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.7),
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: responsiveScreenHeight(1),
    },
    modalContainer: {
      marginTop: responsiveScreenHeight(6),
      maxHeight: responsiveScreenHeight(80),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      marginBottom: responsiveScreenHeight(3),
      width: responsiveScreenWidth(90),
      minHeight: responsiveScreenHeight(69.5),
      maxHeight: responsiveScreenHeight(80),
    },
    threeDotContainer: {
      // position: 'absolute',
      // right: 0,
      // top: 5,

      // width: 20,
      // height: 30,
      // zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
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
      fontSize: responsiveScreenFontSize(1.8),
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
      width: '85%',
    },
    activeStatus: {
      width: 10,
      height: 10,
      position: 'absolute',
      right: 0,
      bottom: 0,
      borderRadius: 50,
    },
    messageOuterContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 5,
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
    mainContainer: {
      flex: 1,
    },
    container: {
      backgroundColor: Colors.Background_color,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    loadingText: {
      marginLeft: 8,
      color: Colors.BodyText,
      fontSize: 14,
    },
    errorContainer: {
      padding: 12,
      backgroundColor: Colors.LightRed,
      borderRadius: 8,
    },
    errorText: {
      color: Colors.Red,
      fontSize: 14,
    },

    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.BodyText,
    },
  });
