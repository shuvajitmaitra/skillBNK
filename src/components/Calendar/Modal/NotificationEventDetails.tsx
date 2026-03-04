import React, {useEffect} from 'react';
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import NotifyBell from '../../../assets/Icons/NotifyBell';
import CustomFonts from '../../../constants/CustomFonts';
import ShareIcon from '../../../assets/Icons/ShareIcon';
import UsersIconsTwo from '../../../assets/Icons/UsersIconTwo';
import UserIconTwo from '../../../assets/Icons/UserIconTwo';
import {handleOpenLink} from '../../HelperFunction';
import Markdown from 'react-native-markdown-display';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventNotification,
  setNotificationClicked,
  setSingleEvent,
} from '../../../store/reducer/calendarReducer';
import {eventTypes, onShare} from '../../../utility/commonFunction';
import Images from '../../../constants/Images';
import {getNotificationData} from '../../../actions/chat-noti';
import EventHistory from '../EventHistory';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import {MarkdownStylesProps} from '../../../types/markdown/markdown';
import {IEvent, IParticipant} from '../../../types/calendar/event';
import {RegularFonts} from '../../../constants/Fonts';
import {fontSizes, gFontSize} from '../../../constants/Sizes';

// // If you have a specific event type, replace `any` with your type.
// interface IEvent {
//   _id?: string;
//   title?: string;
//   eventType?: string;
//   start?: string | Date;
//   end?: string | Date;
//   meetingLink?: string;
//   agenda?: string;
//   followUp?: string;
//   actionItems?: string;
//   participants?: {
//     user: {
//       profilePicture?: string;
//       fullName?: string;
//     };
//   }[];
//   createdBy?: {
//     profilePicture?: string;
//     fullName?: string;
//   };
//   myParticipantData?: {
//     status?: 'accepted' | 'pending' | 'declined' | string;
//   };
// }

interface INotification {
  timeBefore: number;
  methods: string[];
  chatGroups: any[];
}

interface CalendarState {
  event: IEvent | null;
  eventNotification: INotification[];
}

export function EventDetailsFormatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function removeMarkdown(markdownText: string): string {
  if (!markdownText) {
    return markdownText;
  }

  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  return markdownText
    .replace(markdownLinkRegex, '$2') // Replace links with their URLs
    .split('](')[0]; // Remove any remaining markdown-like syntax
}

const NotificationEventDetails: React.FC = () => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // Extract event and eventNotification from Redux state
  const {event: item, eventNotification} = useSelector<
    RootState,
    CalendarState
  >(state => state.calendar);

  useEffect(() => {
    if (item?._id) {
      getNotificationData(item._id);
    }
  }, [item?._id]);

  const closeModal = () => {
    dispatch(setNotificationClicked(null));
    dispatch(setSingleEvent(null));
    dispatch(
      setEventNotification([
        {
          timeBefore: 5,
          methods: ['push'],
          chatGroups: [],
        },
      ]),
    );
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={Boolean(item)}
      onBackdropPress={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton toggleModal={closeModal} />

          <ScrollView>
            <Text style={styles.EventDetailsHeadingTitle}>Event Details</Text>
            <Text style={styles.EventHeading}>{item?.title}</Text>
            <Text style={styles.eventType}>
              Event Type: {eventTypes(item?.eventType)}
            </Text>
            <Text style={styles.time}>
              Start Time: {moment(item?.start).format('MMM DD, YYYY h:mm A')}
            </Text>
            <Text style={styles.time}>
              End Time: {moment(item?.end).format('MMM DD, YYYY h:mm A')}
            </Text>
            <Text style={styles.joinLinkHeading}>Meeting Join Link</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                width: '100%',
              }}>
              {item?.meetingLink ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      handleOpenLink(removeMarkdown(item.meetingLink as string))
                    }>
                    <Text style={styles.meetingLinkText}>
                      {removeMarkdown(item.meetingLink)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginRight: responsiveScreenWidth(3)}}
                    onPress={() =>
                      onShare(removeMarkdown(item.meetingLink as string))
                    }>
                    <ShareIcon />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.time}>No Meeting link available</Text>
              )}
            </View>
            <View
              style={[
                styles.smallContainer,
                {marginVertical: responsiveScreenHeight(2)},
              ]}>
              <NotifyBell color={Colors.Heading} />
              <Text style={styles.NoReaminder}>
                {eventNotification[0]?.timeBefore
                  ? `Reminder before ${eventNotification[0]?.timeBefore} minutes`
                  : 'Reminder before 5 minutes'}
              </Text>
            </View>
            <View
              style={[
                styles.smallContainer,
                {marginBottom: responsiveScreenHeight(1.5)},
              ]}>
              <UsersIconsTwo color={Colors.Heading} />
              <Text style={styles.NoReaminder}>
                {item?.participants?.length || 0} Invited Guest
              </Text>
            </View>
            {item?.participants?.map(
              (singleItem: IParticipant, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.smallContainer,
                    {marginBottom: responsiveScreenHeight(1)},
                  ]}>
                  {singleItem?.user?.profilePicture ? (
                    <Image
                      source={
                        item?.createdBy?.profilePicture
                          ? {uri: item.createdBy.profilePicture}
                          : Images.DEFAULT_IMAGE
                      }
                      style={styles.images as ImageStyle}
                    />
                  ) : (
                    <UserIconTwo />
                  )}
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
                  item?.createdBy?.profilePicture
                    ? {uri: item.createdBy.profilePicture}
                    : Images.DEFAULT_IMAGE
                }
                style={styles.images as ImageStyle}
              />
              <Text style={styles.meetingLinkText}>
                {item?.createdBy?.fullName}
              </Text>
            </View>
            <Text style={styles.textAreaHeading}>My Response</Text>
            <Text
              style={[
                styles.meetingLinkText,
                {
                  color:
                    item?.myParticipantData?.status === 'accepted'
                      ? Colors.Primary
                      : item?.myParticipantData?.status === 'pending'
                      ? Colors.ThemeSecondaryColor
                      : Colors.Red,
                },
              ]}>
              {item?.myParticipantData?.status}
            </Text>

            <Text style={[styles.textAreaHeading]}>
              Meeting Agenda/Follow Up/Action Item
            </Text>
            <View style={[styles.inputContainer]}>
              <Markdown style={styles.markdown as MarkdownStylesProps}>
                {item?.agenda || 'meeting agenda/follow up/action item'}
              </Markdown>
            </View>
            <Text style={styles.Text}>Event Changed History</Text>
            <EventHistory
              participants={item?.participants ? item?.participants : []}
              eventId={item?._id}
            />
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default NotificationEventDetails;

const getStyles = (Colors: TColors) =>
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
        width: '100%',
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
      overflow: 'hidden',
    } as ImageStyle,
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
  });
