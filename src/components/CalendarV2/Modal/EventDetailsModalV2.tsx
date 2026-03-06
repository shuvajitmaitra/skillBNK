import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import CustomFonts from '../../../constants/CustomFonts';
import {handleOpenLink, showToast} from '../../HelperFunction';

// Import necessary icons
import NotifyBell from '../../../assets/Icons/NotifyBell';
import UsersIconsTwo from '../../../assets/Icons/UsersIconTwo';
import CloseIcon from '../../../assets/Icons/CloseIcon';
import {
  setNewEventData,
  setSelectedEventV2,
  updateCalInfo,
} from '../../../store/reducer/calendarReducerV2';
import LinkIcon from '../../../assets/Icons/LinkIcon';
import {
  borderRadius,
  fontSizes,
  gFontSize,
  gGap,
  gHeight,
  gMargin,
  gPadding,
} from '../../../constants/Sizes';
import BinIcon from '../../../assets/Icons/BinIcon';
import EditIconTwo from '../../../assets/Icons/EditIcon2';
import CopyIcon from '../../../assets/Icons/CopyIcon';
// import CalendarIconSmall from '../../../assets/Icons/CalendarIconSmall';
import axiosInstance from '../../../utility/axiosInstance';
import Images from '../../../constants/Images';
import {LayoutAnimation} from 'react-native';
import {
  handleCopyText,
  openConfirmModal,
} from '../../../utility/commonFunction';
import ConfirmationModal2 from '../../SharedComponent/ConfirmationModal2';
import EventDeleteOptionModalV2 from './EventDeleteOptionModalV2';
import {handleDeleteEvent, loadSingleChapter} from '../../../actions/apiCall2';
import {FeatherIcon} from '../../../constants/Icons';
import AddNewEventModalV2 from '../AddNewEventModalV2';
import TextRender from '../../SharedComponent/TextRender';
import ProposeNewTimeModalV2 from './ProposeNewTimeModalV2';
import {calendarService} from '../../../services/calendarService';
import CalendarIcon from '../../../assets/Icons/CalendarIcon';
import TaskIcon from '../../../assets/Icons/TaskIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Skeleton from '../../SharedComponent/Skeleton';
import {withOpacity} from '../../ChatCom/Mention/utils';
import RNText from '../../SharedComponent/RNText';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const EventDetailsModalV2: React.FC<{from?: string}> = ({from}) => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const {top} = useSafeAreaInsets();

  const {selectedEventV2: event, calendarInfo} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const [attendeeClicked, setAttendeeClicked] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<any>({});

  const [proposeData, setProposeData] = useState<any>({
    proposeVisible: false,
    start: moment().toISOString(),
    end: moment().add(30, 'minutes').toISOString,
    reason: 'I have another meeting at the original time',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const loadEventDetails = async () => {
      setLoading(true);
      await axiosInstance
        .get(`/v2/calendar/event/details/${event?._id}`)
        .then(async res => {
          dispatch(setSelectedEventV2({...event, ...res.data.event}));
          if (event?.purpose?.resourceId) {
            await loadSingleChapter();
          }

          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log(
            'Event Details error',
            JSON.stringify(error.response.data.error, null, 2),
          );
          showToast({
            message: error.response.data.error || 'Error load event details',
          });
        });
    };
    loadEventDetails();

    // return () => {
    //   dispatch(setSelectedEventV2(null));
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    dispatch(setSelectedEventV2(null));
  };

  if (!event) return null;
  const title = event?.title || 'Unavailable';
  const dateTime =
    moment(event?.startTime).format('DD') ===
    moment(event?.endTime).format('DD')
      ? moment(event?.startTime).format('LL') +
        ' • ' +
        moment(event?.startTime).format('hh:mm A') +
        ' - ' +
        moment(event?.endTime).format('hh:mm A')
      : moment(event?.startTime).format('MMM DD, YY hh:mm A') +
        ' • ' +
        moment(event?.endTime).format('MMM DD, YY hh:mm A');
  const meetingLink = event?.location?.link || null;
  const attendeeCount = event?.attendeeCount || 0;
  const reminderTime = event?.reminders?.[0]?.offsetMinutes || 15;
  const organizerEmail = event?.organizer?.email || '';
  const description = event?.description;
  const type = event?.type;

  // Counts for attendees
  const acceptedCount = event.attendeeStatistics?.accepted || 0;
  const deniedCount = event?.attendeeStatistics?.denied || 0;
  const pendingCount = event.attendeeStatistics?.needsAction || 0;

  const renderItem = (item: any) => {
    return (
      <View style={styles.invitedMemberContainer} key={item._id}>
        <Image
          source={
            item?.user?.profilePicture
              ? {uri: item?.user?.profilePicture}
              : Images.DEFAULT_IMAGE
          }
          style={styles.checkedImage}
        />
        <View style={styles.nameProfile}>
          <Text numberOfLines={1} style={styles.profileNameText}>
            {item?.user?.fullName}
          </Text>
          <Text style={styles.emailText}>{item.user.email}</Text>
        </View>
      </View>
    );
  };
  const handleAttendeeToggle = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    });
    setAttendeeClicked(!attendeeClicked);
  };
  console.log('event', JSON.stringify(event, null, 2));
  const renderMeetingSource = (t: 'call' | 'meet' | 'custom' | 'zoom') => {
    switch (t) {
      case 'call':
        return 'Join with Phone Call';

      case 'meet':
        return 'Join with Google Meet';

      case 'zoom':
        return 'Join with Zoom';

      case 'custom':
        return 'Join with Custom Link';

      default:
        return 'Join Meeting';
    }
  };
  const isOrganizer = user._id === event.organizer?._id;
  return (
    <Modal
      // backdropColor={Colors.BackDropColor}
      statusBarTranslucent
      visible={Boolean(event._id && !calendarInfo.updateEventVisible)}
      style={styles.modalContainer}>
      <View style={[styles.modalContent, {paddingTop: top}]}>
        {from !== 'invitations' && (
          <View style={styles.actionButtons}>
            {(user._id === event?.organizer?._id ||
              event.type === 'task' ||
              event.permissions?.modifyEvent) && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    updateCalInfo({
                      updateEventVisible: true,
                    }),
                  );
                }}
                style={{
                  backgroundColor: Colors.Primary,
                  padding: gGap(5),
                  borderRadius: borderRadius.small,
                }}>
                <EditIconTwo color={Colors.PureWhite} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                dispatch(updateCalInfo({updateEventVisible: false}));
                dispatch(
                  setSelectedEventV2({
                    ...event,
                    startTime: moment().toISOString(),
                    endTime: moment().add(30, 'minute').toISOString(),
                    title: `${event.title} Copy`,
                  }),
                );
                dispatch(
                  setNewEventData({
                    isModalVisible: true,
                    eventType: event.type,
                  }),
                );
              }}
              style={{
                backgroundColor: Colors.BodyText + '30',
                padding: gGap(5),
                borderRadius: borderRadius.small,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
              }}>
              <CopyIcon color={Colors.BodyText} />
            </TouchableOpacity>
            {(event.organizer?._id === user._id ||
              event.permissions?.modifyEvent) && (
              <TouchableOpacity
                onPress={() => {
                  if (!event.recurrence?.isRecurring) {
                    openConfirmModal({
                      title: `Delete ${type === 'event' ? 'Event' : 'To-Do'}`,
                      des: '',
                      func: () => {
                        event._id &&
                          type &&
                          handleDeleteEvent(event._id, 'thisEvent', type);
                        dispatch(setSelectedEventV2(null));
                      },
                    });
                  } else {
                    dispatch(updateCalInfo({isEventDeleteOptionVisible: true}));
                  }
                }}
                style={{
                  backgroundColor: Colors.Red + '50',
                  padding: gGap(5),
                  borderRadius: borderRadius.small,
                }}>
                <BinIcon color={Colors.Red} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#F97066',
                padding: gGap(5),
                borderRadius: borderRadius.small,
              }}
              onPress={closeModal}>
              <FeatherIcon name="x" size={20} color={Colors.PureWhite} />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          <View style={styles.headerRow}>
            {event.type === 'event' ? (
              <CalendarIcon size={25} color={Colors.Heading} />
            ) : (
              <TaskIcon size={25} color={Colors.Heading} />
            )}
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text style={styles.title}>{title}</Text>
              {from === 'invitations' && (
                <TouchableOpacity
                  style={[styles.closeButton]}
                  onPress={closeModal}>
                  <CloseIcon size={35} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Date and time */}
          <Text style={styles.dateTime}>{dateTime}</Text>

          {/* Meeting link with copy button */}
          {event.type === 'event' && meetingLink && (
            <View style={styles.linkContainer}>
              <LinkIcon />
              <TouchableOpacity
                disabled={true}
                onPress={() => handleOpenLink(meetingLink)}
                style={styles.meetingLink}>
                {event?.location?.type && (
                  <RNText
                    style={{
                      color: '#2e67eb',
                      fontSize: gGap(16),
                      fontWeight: '600',
                      textDecorationLine: 'underline',
                    }}>
                    {renderMeetingSource(event.location?.type)}
                  </RNText>
                )}
                <Text numberOfLines={1} style={styles.meetingLinkText}>
                  {meetingLink}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCopyText(meetingLink);
                }}
                style={styles.copyButton}>
                <CopyIcon />
              </TouchableOpacity>
            </View>
          )}
          {event.type === 'event' && (
            <>
              {/* Attendees */}
              {loading ? (
                <Skeleton
                  height={50}
                  width={gGap(250)}
                  borderRadius={8}
                  highlightColor={Colors.BodyTextOpacity}
                />
              ) : (
                <View style={styles.inviteSection}>
                  <UsersIconsTwo color={Colors.Heading} />
                  <View style={styles.attendeeInfo}>
                    <Text style={styles.infoTitle}>
                      {attendeeCount} Invited Guests
                    </Text>
                    {isOrganizer && (
                      <View style={styles.attendeeStatuses}>
                        <View style={styles.attendeeStatus}>
                          <View style={styles.statusDot}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                          <Text style={styles.statusCount}>
                            {acceptedCount} Accepted
                          </Text>
                        </View>
                        <View style={styles.attendeeStatus}>
                          <View style={[styles.statusDot, styles.deniedDot]}>
                            <Text
                              style={{
                                color: Colors.PureWhite,
                                fontSize: gFontSize(8),
                              }}>
                              ✕
                            </Text>
                          </View>
                          <Text style={styles.statusCount}>
                            {deniedCount} Denied
                          </Text>
                        </View>
                        <View style={styles.attendeeStatus}>
                          <View style={[styles.statusDot, styles.pendingDot]}>
                            <Text
                              style={{
                                color: Colors.PureWhite,
                                fontSize: gFontSize(8),
                              }}>
                              !
                            </Text>
                          </View>
                          <Text style={styles.statusCount}>
                            {pendingCount} Pending
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  {event.permissions?.seeGuestList && (
                    <TouchableOpacity
                      onPress={() => handleAttendeeToggle()}
                      style={styles.detailsChevron}>
                      <FeatherIcon
                        name={
                          attendeeClicked ? 'chevron-down' : 'chevron-right'
                        }
                        size={30}
                        color={Colors.Primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {attendeeClicked && (
                <View>
                  {event?.attendees?.map((item: any) => (
                    <React.Fragment key={item._id}>
                      {renderItem(item)}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Reminder */}
          <View style={styles.infoSection}>
            <NotifyBell color={Colors.Heading} />
            <Text style={styles.infoTitle}>
              Reminder {reminderTime} minutes before
            </Text>
          </View>

          {/* Organizer email */}
          <View style={styles.infoSection}>
            {/* <CalendarIconSmall /> */}
            <Image
              style={{
                backgroundColor: Colors.PrimaryOpacityColor,
                height: gGap(25),
                width: gGap(25),
                borderRadius: 100,
              }}
              source={{uri: event.organizer?.profilePicture}}
            />
            {loading ? (
              <Skeleton
                height={30}
                width={gGap(250)}
                borderRadius={8}
                highlightColor={Colors.BodyTextOpacity}
              />
            ) : (
              <View>
                <Text style={styles.infoTitle}>
                  {event.organizer?.fullName} (Organizer)
                </Text>
                <Text
                  style={[
                    styles.infoTitle,
                    {fontWeight: '400', fontFamily: CustomFonts.REGULAR},
                  ]}>
                  {organizerEmail}
                </Text>
              </View>
            )}
          </View>
          {/* {event.type === 'event' && (
            <View
              style={{
                flexDirection: 'row',
                gap: gGap(5),
                marginVertical: gGap(5),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.Heading,
                  fontSize: fontSizes.body,
                  fontWeight: '700',
                }}>
                My Response:
              </Text>
              <View
                style={{
                  paddingHorizontal: gGap(5),
                  paddingVertical: gGap(1),
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                  borderRadius: borderRadius.small,
                  backgroundColor:
                    event.myResponseStatus === 'needsAction' ||
                    event.myResponseStatus === 'proposedNewTime'
                      ? '#F4B400'
                      : event.myResponseStatus === 'declined'
                      ? '#F97066'
                      : '#4285F4',
                }}>
                <RNText
                  style={{
                    color: Colors.PureWhite,
                    fontSize: fontSizes.small,
                    textTransform: 'capitalize',
                  }}>
                  {event.myResponseStatus === 'needsAction'
                    ? 'Pending'
                    : event.myResponseStatus === 'proposedNewTime'
                    ? 'Proposed New Time'
                    : event.myResponseStatus}
                </RNText>
              </View>
            </View>
          )} */}
          {/* Description/Agenda */}
          <View style={styles.agendaContainer}>
            <Text style={styles.agendaHeading}>
              Meeting Agenda/Follow up/Action Item
            </Text>
            <View style={styles.agendaContent}>
              {/* <Text style={styles.agendaText}>{description}</Text> */}
              <TextRender text={description || ''} />
            </View>
          </View>
          <EventDeleteOptionModalV2
            onCancel={() => {
              dispatch(updateCalInfo({isEventDeleteOptionVisible: false}));
            }}
            onRemove={async option => {
              console.log('option', JSON.stringify(option, null, 2));
              if (clickedEvent.for) {
                await calendarService.handleMeetingStatus(
                  clickedEvent,
                  clickedEvent.for,
                  option,
                  null,
                );
                dispatch(
                  setSelectedEventV2({
                    ...event,
                    myResponseStatus: clickedEvent.for,
                  }),
                );
              } else {
                event._id &&
                  event.type &&
                  handleDeleteEvent(event._id, option, event.type);
                dispatch(updateCalInfo({isEventDeleteOptionVisible: false}));
              }
              dispatch(setSelectedEventV2(null));
            }}
          />
          <ConfirmationModal2 />
          <AddNewEventModalV2 />
          {event.type === 'event' && !isOrganizer && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: gGap(10),
              }}>
              <Text
                style={{
                  fontSize: responsiveScreenFontSize(1.8),
                  fontFamily: CustomFonts.SEMI_BOLD,
                  color: Colors.Heading,
                }}>
                Going?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: gGap(10),
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    event?.recurrence?.isRecurring
                      ? (dispatch(
                          updateCalInfo({isEventDeleteOptionVisible: true}),
                        ),
                        dispatch(
                          setSelectedEventV2({
                            ...event,
                            myResponseStatus: 'accepted',
                          }),
                        ),
                        setClickedEvent({...event, for: 'accepted'}))
                      : (dispatch(
                          setSelectedEventV2({
                            ...event,
                            myResponseStatus: 'accepted',
                          }),
                        ),
                        calendarService.handleMeetingStatus(
                          event as any,
                          'accepted',
                          'thisEvent',
                          null,
                        ));
                  }}
                  style={[
                    styles.actionBtnCon,
                    {
                      backgroundColor:
                        event.myResponseStatus === 'accepted'
                          ? Colors.Primary
                          : Colors.PrimaryOpacityColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.actionBtnTxt,
                      {
                        color:
                          event.myResponseStatus === 'accepted'
                            ? Colors.PureWhite
                            : Colors.Primary,
                      },
                    ]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    event?.recurrence?.isRecurring
                      ? (dispatch(
                          updateCalInfo({isEventDeleteOptionVisible: true}),
                        ),
                        dispatch(
                          setSelectedEventV2({
                            ...event,
                            myResponseStatus: 'declined',
                          }),
                        ),
                        setClickedEvent({...event, for: 'declined'}))
                      : (dispatch(
                          setSelectedEventV2({
                            ...event,
                            myResponseStatus: 'declined',
                          }),
                        ),
                        calendarService.handleMeetingStatus(
                          event as any,
                          'declined',
                          'thisEvent',
                          null,
                        ));
                  }}
                  style={[
                    styles.actionBtnCon,
                    {
                      backgroundColor:
                        event.myResponseStatus === 'declined'
                          ? Colors.Primary
                          : Colors.PrimaryOpacityColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.actionBtnTxt,
                      {
                        color:
                          event.myResponseStatus === 'declined'
                            ? Colors.PureWhite
                            : Colors.Primary,
                      },
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setProposeData({...proposeData, proposeVisible: true});
                  }}
                  style={[
                    styles.actionBtnCon,
                    {
                      backgroundColor:
                        event.myResponseStatus === 'proposednewtime' ||
                        event.myResponseStatus === 'proposedNewTime'
                          ? Colors.Primary
                          : Colors.PrimaryOpacityColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.actionBtnTxt,
                      {
                        color:
                          event.myResponseStatus === 'proposednewtime' ||
                          event.myResponseStatus === 'proposedNewTime'
                            ? Colors.PureWhite
                            : Colors.Primary,
                      },
                    ]}>
                    Propose new time
                  </Text>
                </TouchableOpacity>
                <ProposeNewTimeModalV2
                  data={proposeData}
                  onCancel={(d: boolean) => {
                    setProposeData({...proposeData, proposeVisible: d});
                  }}
                  onPropose={d => {
                    dispatch(
                      setSelectedEventV2({
                        ...event,
                        myResponseStatus: 'proposednewtime',
                      }),
                    );
                    setClickedEvent({...event, for: 'proposedNewTime'});

                    calendarService.handleMeetingStatus(
                      event as any,
                      'proposedNewTime',
                      'thisEvent',
                      d,
                    );
                    setProposeData({...proposeData, proposeVisible: false});
                  }}
                />
                {/* <EventDeleteOptionModalV2
              from="accept"
              onRemove={o => {
                calendarService.handleMeetingStatus(
                  clickedEvent,
                  clickedEvent.for,
                  o,
                  null,
                );
              }}
            /> */}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EventDetailsModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    actionBtnTxt: {
      color: Colors.Primary,
      fontWeight: '600',
    },
    actionBtnCon: {
      alignItems: 'center',
      paddingVertical: gGap(8),
      paddingHorizontal: gGap(10),
      borderWidth: 1,
      borderColor: withOpacity(Colors.Primary, 0.2),
      borderRadius: borderRadius.small,
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    emailText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.small,
    },
    invitedMemberContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: gMargin(5),
      marginBottom: gMargin(5),
    },
    nameProfile: {},
    checkedImage: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: 100,
      backgroundColor: Colors.Primary,
    },
    profileNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: fontSizes.body,
      color: Colors.Heading,
    },
    inviteSection: {
      // backgroundColor: 'blue',
      flexDirection: 'row',
      alignItems: 'center',
      gap: gMargin(5),
      paddingTop: gPadding(5),
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
    },
    modalContent: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      // height: responsiveScreenHeight(100),
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      gap: gGap(10),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gMargin(10),
      // backgroundColor: 'red',
      // marginTop: gGap(-10),
      justifyContent: 'flex-end',
    },
    closeButton: {
      backgroundColor: '#F97066',
      borderWidth: 0,
      // position: 'absolute',
      // right: -gGap(15),
      // top: -gGap(15),
      borderRadius: 100,
    },
    dateTime: {
      fontSize: fontSizes.body,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    meetingLink: {
      flex: 1,
      paddingLeft: gPadding(5),
    },
    meetingLinkText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: fontSizes.body,
    },
    copyButton: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: gPadding(5),
    },
    infoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gMargin(5),
      marginVertical: gMargin(5),
    },
    infoIconContainer: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: responsiveScreenWidth(3),
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    attendeeInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    attendeeStatuses: {
      flexDirection: 'row',
      gap: gMargin(10),
      height: gHeight(15),
      marginTop: gPadding(3),
    },
    attendeeStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginRight: responsiveScreenWidth(3),
    },
    statusDot: {
      width: gFontSize(12),
      height: gFontSize(12),
      borderRadius: 100,
      backgroundColor: '#4285F4',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: gMargin(3),
    },
    checkmark: {
      color: '#fff',
      fontSize: responsiveScreenFontSize(1.4),
      fontWeight: 'bold',
    },
    deniedDot: {
      backgroundColor: '#F97066',
    },
    pendingDot: {
      backgroundColor: '#F4B400',
    },
    statusCount: {
      fontSize: fontSizes.small,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    detailsChevron: {
      padding: gPadding(5),
    },
    chevronText: {
      fontSize: responsiveScreenFontSize(3),
      color: Colors.BodyText,
    },
    calendarIcon: {
      fontSize: responsiveScreenFontSize(2.2),
    },
    agendaContainer: {
      marginTop: gMargin(5),
    },
    agendaHeading: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(1),
    },
    agendaContent: {
      backgroundColor: Colors.Background_color,
      borderRadius: 8,
      // padding: gPadding(8),
      paddingHorizontal: gGap(10),
      minHeight: responsiveScreenHeight(12),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    agendaText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
