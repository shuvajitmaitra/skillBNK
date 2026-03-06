// components/UpdateEventModalV2.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  ScrollView,
  StyleSheet,
  Text,
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
import Images from '../../constants/Images';
import RequireFieldStar from '../../constants/RequireFieldStar';
import CustomButton from './CustomButtonV2';
import {TColors, TUser} from '../../types';
import {borderRadius, gGap, gHeight, gPadding} from '../../constants/Sizes';
import {RootState} from '../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {eventPriority} from '../../constants/CustomeData';
import InviteMemberModalV2 from './Modal/InviteMemberModalV2';
import {
  setSelectedEventV2,
  updateCalInfo,
} from '../../store/reducer/calendarReducerV2';
import {showToast} from '../HelperFunction';
import EventDateTimeSectionV2 from './EventDateTimeSectionV2';
import EventLocationV2 from './EventLocationV2';
import EventPermissionsV2 from './EventPermissionsV2';
import EventColorPickerV2 from './Modal/EventColorPickerV2';
import EventNotificationContainerV2 from './EventNotificationContainerV2';
import {handleUpdateEvent} from '../../actions/apiCall2';
import EventDeleteOptionModalV2 from './Modal/EventDeleteOptionModalV2';
import {openConfirmModal, theme} from '../../utility/commonFunction';
import EventPurposeV2 from './EventPurposeV2';
import ConfirmationModal2 from '../SharedComponent/ConfirmationModal2';
// import moment from 'moment';
import CrossCircle from '../../assets/Icons/CrossCircle';
import moment from 'moment';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email?: string;
  profilePicture?: string;
}

interface PreviousObject {
  responseStatus?: string;
  user: User;
}

interface ComparisonResult {
  attendeesToAdd: string[];
  attendeesToRemove: string[];
  attendees: User[];
}

function compareAttendeeArrays(
  previousArray: PreviousObject[],
  currentArray: User[],
): ComparisonResult {
  // Extract user IDs from previous array
  const prevUserIds = new Set(
    previousArray.map(item => item.user._id).filter(Boolean),
  );

  // Extract user IDs from current array
  const currentUserIds = new Set(
    currentArray.map(item => item._id).filter(Boolean),
  );

  // Find users to add (in current but not in previous)
  const attendeesToAdd = currentArray
    .filter(user => !prevUserIds.has(user._id))
    .map(user => user._id);

  // Find users to remove (in previous but not in current)
  const attendeesToRemove = previousArray
    .filter(item => !currentUserIds.has(item.user._id))
    .map(item => item.user._id);

  // Create the final attendees list from currentArray
  const attendees = currentArray.map(user => ({
    _id: user._id,
    fullName: user.fullName,
  }));

  return {
    attendeesToAdd,
    attendeesToRemove,
    attendees,
  };
}

const UpdateEventModalV2: React.FC = () => {
  const dispatch = useDispatch();
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const {selectedEventV2, eventReminders} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const [params, setParams] = useState<any>({});
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setParams({
      title: selectedEventV2?.title,
      description: selectedEventV2?.description,
      location: {
        type: selectedEventV2?.location?.type,
        link: selectedEventV2?.location?.link,
      },
      isAllDay: selectedEventV2?.isAllDay,
      timeZone: selectedEventV2?.timeZone,
      startTime: selectedEventV2?.startTime,
      endTime: selectedEventV2?.endTime, // replaced static end time
      eventColor: selectedEventV2?.eventColor || '#34A853',
      recurrence: {
        isRecurring: selectedEventV2?.recurrence?.isRecurring,
        frequency: selectedEventV2?.recurrence?.frequency,
        interval: selectedEventV2?.recurrence?.interval,
        daysOfWeek: selectedEventV2?.recurrence?.daysOfWeek,
        endRecurrence: selectedEventV2?.recurrence?.endRecurrence, // replaced static recurrence end
      },
      status: selectedEventV2?.status || 'confirmed',
      priority: selectedEventV2?.priority || 'high',
      // attachments: selectedEventV2?.attachments || [
      //   {
      //     name: 'Updated_Agenda.pdf',
      //     type: 'application/pdf',
      //     size: 300000,
      //     url: 'https://storage.example.com/files/updated_agenda.pdf',
      //   },
      // ],
      purpose: {
        category: selectedEventV2?.purpose?.category,
        resourceId: selectedEventV2?.purpose?.resourceId,
        name: selectedEventV2?.purpose?.name || '',
      },
    });
    selectedEventV2?.permissions && setPermissions(selectedEventV2.permissions);

    return () => {
      setPermissions({});
      setParams({});
    };
  }, [selectedEventV2]);

  const [invitations, setInvitations] = useState<any>([]);
  useEffect(() => {
    setInvitations(
      selectedEventV2?.attendees
        ? selectedEventV2.attendees.map((item: {user: any}) => item.user)
        : [],
    );

    return () => {
      setInvitations([]);
    };
  }, [selectedEventV2?.attendees]);

  const handleUncheck = (id: string) => {
    if (invitations.length === 1) {
      return showToast({message: 'Needs at least one Attendee'});
    }
    setInvitations((prevInvitations: TUser[]) =>
      prevInvitations.filter(item => item._id !== id),
    );
  };

  const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] =
    useState(false);
  const toggleInviteMemberModal = useCallback(() => {
    setIsInviteMemberModalVisible(prev => !prev);
  }, []);
  const e = selectedEventV2?.type === 'event' ? true : false;
  return (
    <ReactNativeModal isVisible={true} backdropOpacity={0.5}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSelectedEventV2(null));
            dispatch(updateCalInfo({updateEventVisible: false}));
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
        {/* <ModalBackAndCrossButton
          toggleModal={() => {
            dispatch(setSelectedEventV2(null));
            dispatch(updateCalInfo({updateEventVisible: false}));
          }}
          containerStyle={{paddingBottom: 5}}
        /> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {e ? 'Update Event' : 'Update To-Do'}
            </Text>
            <Text style={styles.headerDescriptionText}>
              {e
                ? 'Fill out the form to update event'
                : 'Fill out the form to update to-do'}
            </Text>
          </View>
          <View style={styles.subContainer}>
            {/* Event Title */}
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                {e ? 'Event Title' : 'Name'}
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                placeholderTextColor={Colors.BodyText}
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
                placeholder="Enter event name"
                value={params?.title}
                onChangeText={text =>
                  setParams((pre: any) => ({...pre, title: text}))
                }
              />
            </View>
            <EventDateTimeSectionV2
              data={{
                startTime: params?.startTime,
                endTime: params?.endTime,
                isAllDay: params?.isAllDay,
                isRecurring: params?.recurrence?.isRecurring,
                frequency: params?.recurrence?.frequency,
                interval: params?.recurrence?.interval,
                daysOfWeek: params?.recurrence?.daysOfWeek,
                endRecurrence: params?.recurrence?.endRecurrence,
                from: 'update',
              }}
              additionalData={{
                e,
              }}
              setState={d => {
                setParams({...params, ...d});
              }}
            />
            <EventPurposeV2
              setState={i => {
                setParams({...params, purpose: i});
              }}
              state={params.purpose}
            />

            {/* Priority */}
            <View style={[styles.fieldContainer, {marginTop: gGap(10)}]}>
              <Text style={styles.Text}>Priority</Text>
              <CustomDropDown
                options={eventPriority}
                type={
                  selectedEventV2?.priority
                    ? selectedEventV2.priority
                    : 'Select Priority'
                }
                setState={data =>
                  setParams((pre: any) => ({...pre, priority: data}))
                }
              />
            </View>
            {e && (
              <EventColorPickerV2
                activeColor={params.eventColor || Colors.Primary}
                onCancelPress={() =>
                  setParams({
                    ...params,
                    eventColor: selectedEventV2?.eventColor,
                  })
                }
                onSelect={(hex: string) =>
                  // setEvent(pre => ({...pre, eventColor: hex}))
                  setParams({...params, eventColor: hex})
                }
              />
            )}
            {/* Invitations */}
            {((selectedEventV2?.permissions?.inviteOthers &&
              selectedEventV2?.permissions?.seeGuestList) ||
              selectedEventV2?.organizer?._id === user._id) &&
              // eslint-disable-next-line eqeqeq
              selectedEventV2?.type == 'event' && (
                <TouchableOpacity
                  onPress={toggleInviteMemberModal}
                  style={styles.invitationsButtonContainer}>
                  <Text style={styles.invitationsButtonText}>
                    Invite or add guests
                    <RequireFieldStar />
                  </Text>
                </TouchableOpacity>
              )}

            {(selectedEventV2?.organizer?._id === user._id ||
              selectedEventV2?.permissions?.seeGuestList) &&
              e &&
              invitations.length > 0 && (
                <View style={styles.invitedContainer}>
                  {invitations.map((item: TUser) => (
                    <View style={styles.invitedMemberContainer} key={item._id}>
                      <View style={styles.nameProfile}>
                        <Image
                          source={
                            item.profilePicture
                              ? {uri: item.profilePicture}
                              : Images.DEFAULT_IMAGE
                          }
                          style={styles.checkedImage}
                        />
                        <Text style={styles.profileNameText}>
                          {item.fullName}
                        </Text>
                      </View>
                      {(user._id === selectedEventV2?.organizer?._id ||
                        selectedEventV2?.permissions?.inviteOthers) && (
                        <TouchableOpacity
                          onPress={() => handleUncheck(item._id)}>
                          <BinIcon color={Colors.Red} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

            {e && (
              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Location</Text>
                <EventLocationV2
                  onSelect={loc => {
                    setParams((pre: any) => ({
                      ...pre,
                      location: {
                        type: loc || '',
                        link: pre?.location?.link || '',
                      },
                    }));
                  }}
                  selected={params?.location?.type || ''}
                  setMeetingLink={li => {
                    console.log('li', JSON.stringify(li, null, 2));
                    setParams((pre: any) => ({
                      ...pre,
                      location: {
                        type: pre?.location?.type || '',
                        link: li || '',
                      },
                    }));
                  }}
                  link={params?.location?.link}
                />
              </View>
            )}

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Meeting Agenda/Follow Up/Action Item
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                placeholderTextColor={Colors.BodyText}
                style={[
                  styles.inputField,
                  {minHeight: responsiveScreenHeight(10)},
                ]}
                placeholder="Enter Meeting Agenda/Follow Up/Action Item"
                multiline
                value={params?.description}
                onChangeText={text => {
                  setParams({...params, description: text});
                }}
              />
            </View>
            {selectedEventV2?.organizer?._id === user._id && e && (
              <EventPermissionsV2
                onSelect={permission => {
                  setPermissions(permission);
                }}
                selected={permissions || selectedEventV2?.permissions}
              />
            )}

            <Text
              style={{
                color: Colors.Heading,
                fontFamily: CustomFonts.MEDIUM,
              }}>
              Add reminders
            </Text>
            <EventNotificationContainerV2 />
          </View>
        </ScrollView>
        <View style={styles.buttonParenCom}>
          <CustomButton
            textColor={Colors.SecondaryButtonTextColor}
            backgroundColor={Colors.SecondaryButtonBackgroundColor}
            buttonText="Cancel"
            containerStyle={{
              borderWidth: 1,
              borderColor: Colors.LineColor,
              flex: 1,
              minHeight: gHeight(35),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              borderRadius: borderRadius.small,
              paddingVertical: gPadding(5),
              minWidth: 'auto',
            }}
            toggleModal={() => {
              dispatch(setSelectedEventV2(null));
              dispatch(updateCalInfo({updateEventVisible: false}));
            }}
          />
          <CustomButton
            containerStyle={{
              flex: 1,
              minHeight: gHeight(35),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,

              borderRadius: borderRadius.small,
              paddingVertical: gPadding(5),
              minWidth: 'auto',
            }}
            textColor={Colors.PrimaryButtonTextColor}
            backgroundColor={Colors.PrimaryButtonBackgroundColor}
            buttonText="Update"
            toggleModal={() => {
              if (!selectedEventV2?.recurrence?.isRecurring) {
                openConfirmModal({
                  title: `Update ${e ? 'Event' : 'To-Do'}`,
                  des: `Do you want to update this ${e ? 'Event' : 'To-Do'}`,
                  type: 'info',
                  func: () => {
                    if (!selectedEventV2?._id) {
                      return showToast({
                        message: e ? 'Event not found' : 'To-Do not found',
                      });
                    }

                    if (!selectedEventV2?.title?.trim()) {
                      return showToast({message: 'Title is required'});
                    }

                    // if (!params?.description?.trim()) {
                    //   return showToast({message: 'Description is required'});
                    // }

                    // const now = moment();
                    // if (
                    //   params?.startTime &&
                    //   params?.end &&
                    //   params.startTime > params.endTime
                    // ) {
                    //   return showToast({
                    //     message:
                    //       'Please select a future end date than the start date.',
                    //   });
                    // }

                    // if (
                    //   params?.startTime &&
                    //   moment(params.startTime).isBefore(now)
                    // ) {
                    //   return showToast({
                    //     message: 'Please select 5 minutes or newer time.',
                    //   });
                    // }

                    // if (
                    //   params?.endTime &&
                    //   moment(params.endTime).isBefore(now)
                    // ) {
                    //   return showToast({
                    //     message: 'Please select the present or a future date.',
                    //   });
                    // }
                    // if (e) {
                    //   if (
                    //     !params?.location?.type.trim() ||
                    //     !params?.location?.link?.trim()
                    //   ) {
                    //     return showToast({
                    //       message: 'Location is required',
                    //     });
                    //   }
                    // }
                    handleUpdateEvent(selectedEventV2?._id || '', {
                      changes: {
                        ...params,
                        reminders: eventReminders,
                        attendees: compareAttendeeArrays(
                          selectedEventV2?.attendees || [],
                          invitations,
                        ).attendees,
                      },
                      attendeesToAdd: compareAttendeeArrays(
                        selectedEventV2?.attendees || [],
                        invitations,
                      ).attendeesToAdd,
                      attendeesToRemove: compareAttendeeArrays(
                        selectedEventV2?.attendees || [],
                        invitations,
                      ).attendeesToRemove,
                      permissions,
                    });
                    dispatch(setSelectedEventV2(null));
                    dispatch(updateCalInfo({updateEventVisible: false}));
                  },
                });
              } else {
                dispatch(updateCalInfo({isEventDeleteOptionVisible: true}));
              }
            }}
          />
        </View>
      </View>

      {isInviteMemberModalVisible && (
        <InviteMemberModalV2
          date={moment(params.startTime).format('dddd')}
          from="add"
          handleUncheck={handleUncheck}
          invitations={invitations}
          setInvitations={setInvitations}
          toggleModal={toggleInviteMemberModal}
          isModalVisible={isInviteMemberModalVisible}
        />
      )}

      <EventDeleteOptionModalV2
        onCancel={() => {
          dispatch(updateCalInfo({isEventDeleteOptionVisible: false}));
        }}
        onRemove={option => {
          console.log('option-----', JSON.stringify(option, null, 2));

          if (!params?.title?.trim()) {
            return showToast({message: 'Title is required'});
          }
          // if (!params?.description?.trim()) {
          //   return showToast({message: 'Description is required'});
          // }

          // const now = moment();
          // if (
          //   params?.startTime &&
          //   params?.end &&
          //   params.startTime > params.endTime
          // ) {
          //   return showToast({
          //     message: 'Please select a future end date than the start date.',
          //   });
          // }

          // if (params?.startTime && moment(params.startTime).isBefore(now)) {
          //   return showToast({
          //     message: 'Please select 5 minutes or newer time.',
          //   });
          // }

          // if (params?.endTime && moment(params.endTime).isBefore(now)) {
          //   return showToast({
          //     message: 'Please select the present or a future date.',
          //   });
          // }
          // if (e) {
          //   if (
          //     !params?.location?.type.trim() ||
          //     !params?.location?.link?.trim()
          //   ) {
          //     return showToast({
          //       message: 'Location is required',
          //     });
          //   }
          // }
          delete params.startTime;
          delete params.endTime;
          handleUpdateEvent(selectedEventV2?._id || '', {
            updateOption: option,
            changes: {
              ...params,
              attendees: compareAttendeeArrays(
                selectedEventV2?.attendees || [],
                invitations,
              ).attendees,
            },
            attendeesToAdd: compareAttendeeArrays(
              selectedEventV2?.attendees || [],
              invitations,
            ).attendeesToAdd,
            attendeesToRemove: compareAttendeeArrays(
              selectedEventV2?.attendees || [],
              invitations,
            ).attendeesToRemove,
            permissions,
          });
          dispatch(setSelectedEventV2(null));
          dispatch(updateCalInfo({updateEventVisible: false}));
          dispatch(updateCalInfo({isEventDeleteOptionVisible: false}));
        }}
      />
      <ConfirmationModal2 />
    </ReactNativeModal>
  );
};

export default React.memo(UpdateEventModalV2);

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
      fontSize: responsiveScreenFontSize(2.2),
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
    buttonParenCom: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: gPadding(5),
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
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      paddingVertical: 15,
      paddingHorizontal: 20,
      gap: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
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
      flexBasis: '75%',
    },
  });
