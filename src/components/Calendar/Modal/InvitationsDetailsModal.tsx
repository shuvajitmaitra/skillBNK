import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import Markdown from 'react-native-markdown-display';
import moment from 'moment';
import axiosInstance from '../../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {
  setEventStatus,
  setInvitations,
} from '../../../store/reducer/calendarReducer';
import InvitationDeniedModal from './InvitationDeniedModal';
import ProposeNewTimeModal from './ProposeNewTimeModal';
import Images from '../../../constants/Images';
import {showToast} from '../../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {
  loadCalendarEvent,
  loadEventInvitation,
} from '../../../actions/chat-noti';
import {TColors} from '../../../types';
import {IEvent} from '../../../types/calendar/event';
import {RegularFonts} from '../../../constants/Fonts';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import store from '../../../store';
import {fontSizes, gFontSize} from '../../../constants/Sizes';

type InvitationsDetailsModalProps = {
  item?: IEvent;
  isInvitationsDetailsModalVisible: boolean;
  toggleInvitationsDetailsModal: () => void;
};

const InvitationsDetailsModal = ({
  item,
  isInvitationsDetailsModalVisible,
  toggleInvitationsDetailsModal,
}: InvitationsDetailsModalProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [isDeniedModalVisible, setIsDeniedModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [isProposeNewTimeVisible, setIsProposeNewTimeVisible] = useState(false);
  const toggleProposeNewTime = useCallback(() => {
    setIsProposeNewTimeVisible(!isProposeNewTimeVisible);
  }, [isProposeNewTimeVisible]);

  const handleEvent = (payload: any) => {
    dispatch(
      setInvitations(
        store.getState().calendar.invitations.filter(i => i._id !== item?._id),
      ),
    );
    toggleInvitationsDetailsModal();

    axiosInstance
      .patch(`/calendar/event/invitation/${item?._id}`, payload)
      .then(res => {
        if (res.data.success) {
          loadEventInvitation();
          loadCalendarEvent();
          dispatch(setEventStatus('all'));
          showToast({message: 'Event accepted'});
        }
      })
      .catch(error => {
        console.log('error accept invitation', JSON.stringify(error, null, 1));
      });
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isInvitationsDetailsModalVisible}>
      <View style={styles.modalStyle}>
        <View style={styles.titleContainer}>
          <Text style={styles.EventDetailsHeadingTitle}>{item?.title} </Text>
          <TouchableOpacity
            onPress={toggleInvitationsDetailsModal}
            style={styles.crossButtonContainer}>
            <CrossCircle size={30} />
          </TouchableOpacity>
        </View>
        <Text style={styles.eventType}>
          Event Type:{' '}
          {(item?.eventType === 'showNTell' && 'Show N Tell') ||
            (item?.eventType === 'mockInterview' && 'Mock Interview') ||
            (item?.eventType === 'orientation' && 'Orientation Meeting') ||
            (item?.eventType === 'technicalInterview' &&
              'Technical Interview') ||
            (item?.eventType === 'behavioralInterview' &&
              'Behavioral Interview') ||
            (item?.eventType === 'reviewMeeting' && 'Review Meeting') ||
            (item?.eventType === 'syncUp' && 'Sync up Call') ||
            (item?.eventType === 'other' && 'Others')}
        </Text>
        <Text style={styles.time}>
          Start Time: {moment(item?.start).format('MMM DD, YYYY h:mm A')}
        </Text>
        <Text style={styles.time}>
          End Time: {moment(item?.end).format('MMM DD, YYYY h:mm A')}
        </Text>

        <Text style={styles.joinLinkHeading}>Organizer</Text>
        <View style={styles.smallContainer}>
          <Image
            source={
              item?.createdBy?.profilePicture
                ? {
                    uri: item?.createdBy?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            // height={25}
            // width={25}
            style={styles.images}
          />
          <Text style={styles.meetingLinkText}>
            {item?.createdBy?.fullName || 'N/A'}
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

        <Text style={[styles.textAreaHeading, {marginVertical: 10}]}>
          Meeting Agenda/Follow Up/Action Item
        </Text>
        <ScrollView contentContainerStyle={styles.inputContainer}>
          <Markdown style={styles.markdown}>
            {item?.agenda || 'meeting agenda/follow up/action item'}
          </Markdown>
        </ScrollView>
        <View style={styles.buttonParenCom}>
          <TouchableOpacity
            onPress={() =>
              handleEvent({
                action: 'status',
                participantId: item?.myParticipantData?._id,
                status: 'accepted',
              })
            }
            style={[
              styles.buttonContainer,
              {flex: 0.25, backgroundColor: Colors.PrimaryOpacityColor},
            ]}>
            <Text style={[styles.buttonText, {color: Colors.Primary}]}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsDeniedModalVisible(true);
              item?._id && setId(item?._id);
            }}
            style={[
              styles.buttonContainer,
              {flex: 0.25, backgroundColor: Colors.LightRed},
            ]}>
            <Text style={[styles.buttonText, {color: Colors.Red}]}>Denied</Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => {
              toggleProposeNewTime();
              item?._id && setId(item._id);
            }}
            style={[
              styles.buttonContainer,
              {flex: 0.5, backgroundColor: Colors.CyanOpacity},
            ]}>
            <Text style={[styles.buttonText, {color: Colors.PureCyan}]}>
              Proposed new time
            </Text>
          </Pressable>
        </View>
      </View>
      {isDeniedModalVisible && (
        <InvitationDeniedModal
          id={id}
          participantId={item?.myParticipantData?._id || ''}
          toggleInvitationsDetailsModal={toggleInvitationsDetailsModal}
          isDeniedModalVisible={isDeniedModalVisible}
          setIsDeniedModalVisible={setIsDeniedModalVisible}
        />
      )}
      {isProposeNewTimeVisible && (
        <ProposeNewTimeModal
          id={id}
          participantId={item?.myParticipantData?._id || ''}
          toggleInvitationsDetailsModal={toggleInvitationsDetailsModal}
          isProposeNewTimeVisible={isProposeNewTimeVisible}
          toggleProposeNewTime={toggleProposeNewTime}
        />
      )}
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default InvitationsDetailsModal;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    crossButtonContainer: {
      // backgroundColor: 'red',
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    EventDetailsHeadingTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
      fontFamily: CustomFonts.SEMI_BOLD,
      width: '90%',
      // backgroundColor: 'blue',
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      // backgroundColor: 'blue',
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonContainer: {
      backgroundColor: 'red',
      // paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonParenCom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      justifyContent: 'center',
    },
    inputContainer: {
      width: '100%',
      // height: responsiveScreenHeight(6),
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
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
      marginBottom: 10,
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
      fontSize: responsiveScreenFontSize(2),
      marginTop: 10,
      marginBottom: 5,
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
      fontFamily: CustomFonts.MEDIUM,
    },

    modalStyle: {
      borderRadius: 10,
      backgroundColor: Colors.Foreground,
      padding: 15,
      paddingTop: 10,
      maxHeight: responsiveScreenHeight(85),
    },
  });
