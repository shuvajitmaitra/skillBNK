// components/AddNewEventModalV2.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ReactNativeModal from 'react-native-modal';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import BinIcon from '../../assets/Icons/BinIcon';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../SharedComponent/Loading';
import {eventPriority} from '../../constants/CustomeData';
import Images from '../../constants/Images';
import RequireFieldStar from '../../constants/RequireFieldStar';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../constants/ToastConfig';
import {
  setNewEventData,
  setSelectedEventV2,
} from '../../store/reducer/calendarReducerV2';
import EventColorPickerV2 from './Modal/EventColorPickerV2';
import {gFontSize, gGap} from '../../constants/Sizes';
import EventLocationV2 from './EventLocationV2';
import EventPermissionsV2 from './EventPermissionsV2';
import InviteMemberModalV2 from './Modal/InviteMemberModalV2';
import {showToast} from '../HelperFunction';
import axiosInstance from '../../utility/axiosInstance';
import CustomButton from './CustomButtonV2';
import {getCalendarEvents, LoadUpcomingEvent} from '../../actions/apiCall2';
import {IEventV2, Reminder, TColors} from '../../types';
import EventNotificationContainerV2 from './EventNotificationContainerV2';
import EventPurposeV2 from './EventPurposeV2';
import EventDateTimeSectionV2 from './EventDateTimeSectionV2';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {setDayViewPickedDate} from '../../store/reducer/calendarReducer';
import {theme} from '../../utility/commonFunction';
import RNText from '../SharedComponent/RNText';

export interface IRecurrence {
  isRecurring: boolean;
  interval: number; // required property
  frequency: string;
  daysOfWeek: string[]; // e.g., ["0", "1", ...]
  endRecurrence: string | null;
}
export interface IReminder {
  offsetMinutes: number;
  methods: string[];
  crowds: string[];
}

export interface ILocation {
  type: string;
  link: string;
}

// Permissions interface
export interface IPermissions {
  modifyEvent: boolean;
  inviteOthers: boolean;
  seeGuestList: boolean;
}

// Invitation (attendee) interface
export interface IInvitation {
  _id: string;
  profilePicture?: string;
  fullName: string;
}

// Attendee wrapper interface (if needed)
export interface IAttendee {
  user: IInvitation;
}

// Minimal RootState interface for useSelector hooks
interface RootState {
  calendarV2: {
    newEventData: {
      isModalVisible: boolean;
      eventType: 'event' | 'task';
      isRepeatClicked?: boolean;
    } | null;
    selectedEventV2: IEventV2 | null;
    calendarInfo: {
      selectedView: 'month' | 'week' | 'day';
      monthOffset: number;
      weekOffset: number;
      dayOffset: number;
    };
    filterParameter: any;
    eventReminders: Reminder;
  };
  calendar: {
    pickedDate: string;
    eventNotification: Array<{
      timeBefore: number;
      methods: string[];
      crowds: string[];
    }>;
  };
}

type AddNewEventModalProps = {};

const AddNewEventModalV2: React.FC<AddNewEventModalProps> = () => {
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const {
    newEventData,
    selectedEventV2: eventData,
    calendarInfo,
    filterParameter,
    eventReminders,
  } = useSelector((state: RootState) => state.calendarV2);
  const {pickedDate} = useSelector((state: RootState) => state.calendar);
  const dispatch = useDispatch();

  const [event, setEvent] = useState<Partial<any>>({});
  const [loadToast, setLoadToast] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoadToast(true);
    }, 500);
    return () => {
      setLoadToast(false);
    };
  }, []);
  // Define invitations as an array of IInvitation objects.
  const [invitations, setInvitations] = useState<IInvitation[]>([]);

  const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log('pickedDate', JSON.stringify(pickedDate, null, 2));
    const startTime = pickedDate
      ? moment(pickedDate).add(15, 'minutes').toISOString()
      : moment().add(15, 'minutes').toISOString();
    const endTime = pickedDate
      ? moment(pickedDate).add(45, 'minutes').toISOString()
      : moment().add(45, 'minutes').toISOString();

    setEvent({
      title: eventData?.title || '',
      description: eventData?.description || '',
      location: {
        type: 'custom',
        link: '',
      },
      isAllDay: false,
      startTime: startTime,
      endTime: endTime,
      eventColor: eventData?.eventColor || Colors.Primary,
      recurrence: {
        isRecurring: false,
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [],
        endRecurrence: null,
      },
      attendees: eventData?.attendees || [],
      reminders: [
        {
          methods: ['email'],
          offsetMinutes: 5,
          crowds: [],
        },
      ],
      priority: eventData?.priority || 'medium',
      attachments: [],
      purpose: eventData?.purpose || {
        category: '',
        resourceId: '',
      },
      type: eventData?.type || newEventData?.eventType || 'event',
      permissions: eventData?.permissions || {
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: false,
      },
      ...(eventData ?? {}),
    });

    return () => {
      setEvent({});
      dispatch(setDayViewPickedDate({time: ''}));
    };
  }, [
    Colors.Primary,
    dispatch,
    eventData,
    newEventData?.eventType,
    pickedDate,
  ]);
  useEffect(() => {
    // Assumes each attendee has a "user" property with invitation info.
    setInvitations(eventData?.attendees?.map(item => item.user) || []);
  }, [eventData?.attendees]);

  const toggleInviteMemberModal = useCallback(() => {
    setIsInviteMemberModalVisible(prev => !prev);
  }, []);

  const handleUncheck = (id: string) => {
    setInvitations(invitations.filter(item => item._id !== id));
  };

  const handleAddNewEvent = async () => {
    if (!event?.title?.trim()) {
      return showToast({background: Colors.Red, message: 'Name is required'});
    }
    // if (!event?.description?.trim()) {
    //   return showToast({
    //     background: Colors.Red,
    //     message: 'Description is required',
    //   });
    // }
    if (event.type === 'event') {
      // if (!event?.location?.type?.trim() || !event?.location?.link?.trim()) {
      //   return showToast({
      //     background: Colors.Red,
      //     message: 'Location is required',
      //   });
      // }
      if (invitations.length === 0 || !invitations) {
        return showToast({
          background: Colors.Red,
          message: 'Add attendees',
        });
      }
    }

    // const now = moment();
    // const start = moment(event.startTime);
    // const end = moment(event.endTime);

    // // Validate in this order
    // if (end.isBefore(start)) {
    //   return showToast({
    //     message: 'End time cannot be before start time',
    //     background: 'red',
    //   });
    // }

    // if (start.isBefore(now)) {
    //   return showToast({
    //     message: 'Start time cannot be in the past',
    //     background: 'red',
    //   });
    // }

    // if (end.isBefore(now)) {
    //   return showToast({
    //     message: 'End time cannot be in the past',
    //     background: 'red',
    //   });
    // }
    console.log('eventReminders', JSON.stringify(eventReminders, null, 2));
    setIsLoading(true);

    const e = {
      ...event,
      type: 'event',
      attendees:
        invitations?.map(item => ({
          _id: item._id,
          fullName: item.fullName,
        })) || [],
      reminders: [
        {
          crowds: eventReminders?.crowds,
          methods: eventReminders?.methods || ['email'],
          offsetMinutes: eventReminders?.offsetMinutes || 5,
        },
      ],
    };
    const t = {
      ...event,
      type: 'task',
      reminders: [
        {
          crowds: eventReminders?.crowds,
          methods: eventReminders?.methods || ['email'],
          offsetMinutes: eventReminders?.offsetMinutes || 5,
        },
      ],
    };

    const data = newEventData?.eventType === 'event' ? e : t;
    showToast({
      message: data.type === 'event' ? 'Event created' : 'Task created',
    });

    await axiosInstance
      .post('/v2/calendar/event/create', data)
      .then((res: any) => {
        if (res.data.success) {
          LoadUpcomingEvent(0);
          // console.log(
          //   'Event created successfully------',
          //   JSON.stringify(res.data, null, 2),
          // );

          getCalendarEvents({
            offset:
              calendarInfo.selectedView === 'month'
                ? calendarInfo.monthOffset
                : calendarInfo.selectedView === 'week'
                ? calendarInfo.weekOffset
                : calendarInfo.selectedView === 'day'
                ? calendarInfo.dayOffset
                : 0,
            filterParameter,
            view: calendarInfo.selectedView,
          });
          // showToast({message: 'Event created'});
          dispatch(setNewEventData(null));
          dispatch(setSelectedEventV2(null));
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.log(
          'Error from add new event modal',
          JSON.stringify(error.response.data, null, 1),
        );
        showToast({message: error.response.data.error || 'Failed to create'});
        setIsLoading(false);
      });
  };
  const e = newEventData?.eventType === 'event' || event.type === 'event';

  return (
    <ReactNativeModal isVisible={newEventData?.isModalVisible}>
      {!isLoading ? (
        <>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setNewEventData(null));
                dispatch(setSelectedEventV2(null));
              }}
              style={{
                backgroundColor: '#F97066',
                position: 'absolute',
                top: gGap(-15),
                right: gGap(-15),
                borderRadius: 100,
                zIndex: 1,
              }}>
              <CrossCircle size={35} color="white" />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.headerContainer}>
                <RNText style={styles.headerText}>
                  {e ? 'Add New Event' : 'Add New To-Do'}
                </RNText>
                <RNText style={styles.headerDescriptionText}>
                  Fill out the form to create new event
                </RNText>
              </View>
              <View style={styles.subContainer}>
                {/* Event Title */}
                <View style={styles.fieldContainer}>
                  <RNText style={styles.Text}>
                    {e ? 'Event Title' : 'Name'}
                    <RequireFieldStar />
                  </RNText>
                  <TextInput
                    keyboardAppearance={theme()}
                    placeholderTextColor={Colors.BodyText}
                    value={event?.title || ''}
                    style={[
                      {
                        backgroundColor: Colors.Background_color,
                        borderWidth: 1,
                        overflow: 'hidden',
                        borderColor: Colors.BorderColor,
                        borderRadius: 10,
                        paddingHorizontal: responsiveScreenWidth(4),
                        fontFamily: CustomFonts.REGULAR,
                        color: Colors.BodyText,
                        minHeight: responsiveScreenHeight(5),
                      },
                    ]}
                    placeholder={e ? 'Enter event name' : 'Enter task name'}
                    onChangeText={text =>
                      setEvent(pre => ({...pre, title: text}))
                    }
                  />
                </View>
                <EventDateTimeSectionV2
                  data={{
                    startTime: event?.startTime,
                    endTime: event?.endTime,
                    isAllDay: event?.isAllDay,
                    isRecurring: event?.recurrence?.isRecurring,
                    frequency: event?.recurrence?.frequency,
                    interval: event?.recurrence?.interval,
                    daysOfWeek: event?.recurrence?.daysOfWeek,
                    endRecurrence: event?.recurrence?.endRecurrence,
                  }}
                  additionalData={{
                    e,
                  }}
                  setState={d => {
                    setEvent({...event, ...d});
                  }}
                />
                <EventPurposeV2
                  state={event.purpose}
                  setState={i => {
                    setEvent({...event, purpose: i});
                  }}
                />
                <View style={[styles.fieldContainer, {marginTop: gGap(10)}]}>
                  <RNText style={styles.Text}>Priority</RNText>
                  <CustomDropDown
                    options={eventPriority}
                    type={event?.priority ? event.priority : 'Select Priority'}
                    setState={data =>
                      setEvent(pre => ({...pre, priority: data}))
                    }
                  />
                </View>

                {e && (
                  <EventColorPickerV2
                    activeColor={event?.eventColor || Colors.Primary}
                    onCancelPress={() =>
                      setEvent(pre => ({
                        ...pre,
                        eventColor: Colors.Primary,
                      }))
                    }
                    onSelect={(hex: string) =>
                      setEvent(pre => ({...pre, eventColor: hex}))
                    }
                  />
                )}
                {e && (
                  <View style={styles.fieldContainer}>
                    <RNText style={styles.Text}>Location</RNText>
                    <EventLocationV2
                      onSelect={loc => {
                        setEvent(pre => ({
                          ...pre,
                          location: {
                            type: loc || '',
                            link: pre?.location?.link || '',
                          },
                        }));
                      }}
                      selected={event?.location?.type || ''}
                      setMeetingLink={li => {
                        setEvent(pre => ({
                          ...pre,
                          location: {
                            type: pre?.location?.type || '',
                            link: li || '',
                          },
                        }));
                      }}
                      link={event?.location?.link || ''}
                    />
                  </View>
                )}

                {/* Invitations */}
                {e && (
                  <TouchableOpacity
                    onPress={toggleInviteMemberModal}
                    style={styles.invitationsButtonContainer}>
                    <RNText style={styles.invitationsButtonText}>
                      Invite or add guests
                      <RequireFieldStar />
                    </RNText>
                  </TouchableOpacity>
                )}
                {e && invitations.length > 0 && (
                  <View style={styles.invitedContainer}>
                    {invitations.map((item, index) => (
                      <View style={styles.invitedMemberContainer} key={index}>
                        <View style={styles.nameProfile}>
                          <Image
                            source={
                              item.profilePicture
                                ? {uri: item.profilePicture}
                                : Images.DEFAULT_IMAGE
                            }
                            style={styles.checkedImage}
                          />
                          <RNText style={styles.profileNameText}>
                            {item.fullName}
                          </RNText>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleUncheck(item._id)}>
                          <BinIcon color={Colors.Red} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                {invitations.length > 0 && e && (
                  <EventPermissionsV2
                    onSelect={permission => {
                      setEvent(pre => ({...pre, permissions: permission}));
                    }}
                    selected={event?.permissions}
                  />
                )}
                {/* Meeting Agenda */}
                <View style={styles.fieldContainer}>
                  <RNText style={styles.Text}>
                    Meeting Agenda/Follow up/Action Item
                  </RNText>
                  <TextInput
                    keyboardAppearance={theme()}
                    placeholderTextColor={Colors.BodyText}
                    style={[
                      styles.inputField,
                      {minHeight: responsiveScreenHeight(10)},
                    ]}
                    value={event?.description || ''}
                    placeholder={
                      e ? 'Enter event description' : 'Enter task description'
                    }
                    onChangeText={text =>
                      setEvent(pre => ({...pre, description: text}))
                    }
                    multiline
                  />
                </View>

                <RNText
                  style={{
                    color: Colors.Heading,
                    fontFamily: CustomFonts.MEDIUM,
                    marginBottom: gGap(-3),
                  }}>
                  Add reminders
                </RNText>
                {<EventNotificationContainerV2 />}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                textColor={Colors.SecondaryButtonTextColor}
                backgroundColor={Colors.SecondaryButtonBackgroundColor}
                buttonText="Cancel"
                containerStyle={{
                  borderWidth: 1,
                  borderColor: Colors.LineColor,
                }}
                toggleModal={() => {
                  dispatch(setNewEventData(null));
                  dispatch(setSelectedEventV2(null));
                }}
              />
              <CustomButton
                toggleModal={handleAddNewEvent}
                textColor={Colors.PrimaryButtonTextColor}
                backgroundColor={Colors.PrimaryButtonBackgroundColor}
                buttonText="Add"
              />
            </View>
          </View>
        </>
      ) : (
        <Loading backgroundColor="transparent" />
      )}
      {loadToast && <Toast config={toastConfig} />}

      {isInviteMemberModalVisible && (
        <InviteMemberModalV2
          date={moment(event.startTime).format('dddd')}
          from="add"
          handleUncheck={handleUncheck}
          invitations={invitations}
          setInvitations={setInvitations}
          toggleModal={toggleInviteMemberModal}
          isModalVisible={isInviteMemberModalVisible}
        />
      )}
    </ReactNativeModal>
  );
};

export default React.memo(AddNewEventModalV2);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(70),
      paddingBottom: responsiveScreenHeight(1.5),
    },
    headerContainer: {
      marginVertical: 10,
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: gFontSize(18),
      color: Colors.Heading,
    },
    headerDescriptionText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    subContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: responsiveScreenWidth(80),
    },
    fieldContainer: {
      marginBottom: 10,
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(0.5),
      color: Colors.Heading,
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(3.5),
      fontFamily: CustomFonts.REGULAR,
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(1),
      color: Colors.BodyText,
      textAlignVertical: 'top',
    },
    repeatButtonContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      marginBottom: 10,
    },
    repeatButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
    },
    invitationsButtonContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      marginBottom: 10,
    },
    invitationsButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    invitedContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      paddingVertical: 15,
      paddingHorizontal: 20,
      gap: responsiveScreenHeight(1),
      marginBottom: gGap(5),
    },
    invitedMemberContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    nameProfile: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    checkedImage: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: 100,
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    profileNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textTransform: 'capitalize',
    },
    notification: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor3,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'column',
      gap: 10,
      marginBottom: responsiveScreenHeight(2),
      zIndex: 3,
    },
    notificationRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dropdownContainer: {
      flex: 1,
      gap: responsiveScreenHeight(1),
    },
    addNotificationContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      width: responsiveScreenWidth(30),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(0.5),
    },
    addNotificationText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
  });
