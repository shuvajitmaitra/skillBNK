import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import axiosInstance from '../../utility/axiosInstance';
import {
  borderRadius,
  fontSizes,
  gGap,
  gHeight,
  gMargin,
  gPadding,
} from '../../constants/Sizes';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import {
  IoniconsIcon,
  MaterialCommunityIcon,
  MaterialIcon,
} from '../../constants/Icons';
import {IEventV2, TColors} from '../../types';
import Animated, {SlideInRight, SlideOutRight} from 'react-native-reanimated';
import ReactNativeModal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';
import CustomButton from '../../components/Calendar/CustomButton';
import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
import {
  setPendingInvitationCount,
  setSelectedEventV2,
  updateCalInfo,
} from '../../store/reducer/calendarReducerV2';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import EventDetailsModalV2 from '../../components/CalendarV2/Modal/EventDetailsModalV2';
import {removeMarkdown, showToast} from '../../components/HelperFunction';
import EventDeleteOptionModalV2 from '../../components/CalendarV2/Modal/EventDeleteOptionModalV2';
import ProposeNewTimeModalV2 from '../../components/CalendarV2/Modal/ProposeNewTimeModalV2';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {RefreshControl} from 'react-native';
import RNText from '../../components/SharedComponent/RNText';

// Define types for our data structures
interface Attendee {
  email: any;
  firstName: string;
  lastName: string;
  id: string;
  name: string;
  profilePicture?: string;
}

interface Organizer {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture?: string;
}

interface recurrence {
  isRecurring: boolean;
  frequency: string;
  interval: number;
  daysOfWeek: string[];
}

export interface Meeting {
  attendeeCount: number;
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  organizer: Organizer;
  recurrence: recurrence;
  location?: {
    type: string;
    link: string;
  };
  attendees?: Attendee[];
  myResponseStatus?: string;
}

// Icons components
const ViewIcon = () => <Text style={{color: '#6B7280'}}>👁️</Text>;
const AcceptIcon = () => <Text style={{color: '#10B981'}}>✓</Text>;
const AttendIcon = () => <Text style={{color: '#6366F1'}}>🕒</Text>;
const DeclineIcon = () => <Text style={{color: '#EF4444'}}>✕</Text>;
const ArrowRight = () => <Text style={{color: '#6B7280'}}>→</Text>;
const ArrowLeftWhite = () => <Text style={{color: '#6B7280'}}>←</Text>;

interface SeeMoreButtonProps {
  onPress: () => void;
  buttonStatus: boolean;
  buttonContainerStyle?: object;
}

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({
  onPress,
  buttonStatus,
  buttonContainerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
        buttonContainerStyle,
      ]}>
      {buttonStatus ? (
        <>
          <ArrowLeftWhite />
          <Text style={{color: '#3B82F6', marginLeft: 5}}>See Less</Text>
        </>
      ) : (
        <>
          <Text style={{color: '#3B82F6', marginRight: 5}}>See More</Text>
          <ArrowRight />
        </>
      )}
    </TouchableOpacity>
  );
};

const LocationIcon = ({type = 'custom'}) => {
  switch (type.toLowerCase()) {
    case 'meet':
      return <Text>🌐</Text>;
    case 'zoom':
      return <Text>🎥</Text>;
    case 'call':
      return <Text>📱</Text>;
    default:
      return <Text>🔗</Text>;
  }
};

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  color?: string;
}

const Avatar: React.FC<AvatarProps> = ({name = 'User', imageUrl, color}) => {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = color || getRandomColor();

  if (imageUrl) {
    return (
      <Image
        source={{uri: imageUrl}}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
      }}>
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: responsiveScreenFontSize(1.2),
          fontWeight: '600',
        }}>
        {initial}
      </Text>
    </View>
  );
};

const getRandomColor = () => {
  const colors = [
    '#F97316',
    '#22C55E',
    '#6366F1',
    '#EC4899',
    '#8B5CF6',
    '#14B8A6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Priority Badge Component
const PriorityBadge: React.FC<{priority: string}> = ({priority}) => {
  let backgroundColor;
  let textColor = '#FFFFFF';

  switch (priority) {
    case 'high':
      backgroundColor = '#EF4444'; // Red
      break;
    case 'medium':
      backgroundColor = '#F59E0B'; // Amber
      break;
    case 'low':
      backgroundColor = '#10B981'; // Green
      break;
    default:
      backgroundColor = '#6B7280'; // Gray
  }

  return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: textColor,
          fontSize: fontSizes.small,
          fontWeight: '500',
        }}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Text>
    </View>
  );
};

interface MeetingCardProps {
  meeting: Meeting;
  index: number;
  onViewDetails: (meeting: Meeting) => void;
  onAccept: (meeting: Meeting) => void;
  onAttend: (meeting: Meeting) => void;
  onDecline: (meeting: Meeting) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  index,
  onViewDetails,
  onAccept,
  onAttend,
  onDecline,
}) => {
  const Colors = useTheme();
  const styles = getCardStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <Text style={styles.idText}>
            {(index + 1).toString().padStart(2, '0')}
          </Text>
        </View>
        <Text style={styles.titleText}>{meeting.title || 'Test'}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Host:</Text>
          </View>
          <View style={styles.infoValue}>
            <View style={styles.hostContainer}>
              <Avatar
                name={meeting.organizer?.fullName || 'User'}
                imageUrl={meeting.organizer?.profilePicture}
              />
              <View style={styles.hostTextContainer}>
                <Text style={styles.hostName}>
                  {meeting.organizer?.fullName || 'Unknown'}
                </Text>
                <Text style={styles.hostRole}>
                  {meeting.type === 'task'
                    ? 'Product Owner'
                    : 'Software Engineer'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Description:</Text>
          </View>
          <View style={styles.infoValue}>
            <Text numberOfLines={2} style={styles.agendaText}>
              {removeMarkdown(meeting.description || '') ||
                'Description not available'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Schedule:</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.scheduleText}>
              {moment(meeting.startTime).format('MMM DD, YYYY hh:mm A')}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Duration:</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.durationText}>
              {moment
                .duration(
                  moment(meeting.endTime).diff(moment(meeting.startTime)),
                )
                .asMinutes()}{' '}
              minutes
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Total Guests:</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.durationText}>
              {meeting.attendeeCount || 0}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Location:</Text>
          </View>
          <View style={styles.infoValue}>
            <View style={styles.locationContainer}>
              <LocationIcon type={meeting?.location?.type} />
              <RNText numberOfLines={1} style={styles.locationType}>
                {meeting.location?.link.substring(0, 50) || 'Unavailable'}
              </RNText>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.labelText}>Priority:</Text>
          </View>
          <View style={styles.infoValue}>
            <PriorityBadge priority={meeting.priority} />
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onViewDetails(meeting)}>
          <ViewIcon />
          <RNText style={styles.actionText}>View</RNText>
        </TouchableOpacity>
        {meeting.myResponseStatus === 'needsAction' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAccept(meeting)}>
              <AcceptIcon />
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAttend(meeting)}>
              <AttendIcon />
              <Text style={styles.actionText}>Propose New Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDecline(meeting)}>
              <DeclineIcon />
              <Text style={styles.actionText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

interface MeetingInvitationsProps {
  meetings?: Meeting[];
}

const MeetingInvitations: React.FC<MeetingInvitationsProps> = ({
  meetings: initialMeetings = [],
}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {selectedEventV2} = useSelector((state: RootState) => state.calendarV2);
  const {user} = useSelector((state: RootState) => state.auth);

  // All event states
  const [allEvents, setAllEvents] = useState<Meeting[]>(initialMeetings);
  const [filteredMeetings, setFilteredMeetings] =
    useState<Meeting[]>(initialMeetings);

  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  // Other states
  const [clickedEvent, setClickedEvent] = useState<any>({});
  const [date, setDate] = useState({
    from: moment().startOf('month').toISOString(),
    to: moment().endOf('month').toISOString(),
  });
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);
  const [visibleInvitations, setVisibleInvitations] = useState(5);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pendingDisplay, setPendingDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proposeData, setProposeData] = useState<any>({
    proposeVisible: false,
    start: moment().toISOString(),
    end: moment().add(30, 'minutes').toISOString,
    reason: 'I have another meeting at the original time',
  });

  // Apply all filters and search
  const applyFilters = (
    events: Meeting[],
    searchQuery: string,
    showPending: boolean,
  ) => {
    let result = [...events];

    // Filter by pending status if needed
    if (showPending) {
      result = result.filter(
        (item: Meeting) =>
          item?.myResponseStatus === 'needsAction' &&
          item?.organizer?._id !== user?._id,
      );
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim() !== '') {
      const lowerText = searchQuery.toLowerCase();

      result = result.filter((item: Meeting) => {
        // Title and description match
        const titleMatch = item.title?.toLowerCase().includes(lowerText);
        const descMatch = item.description?.toLowerCase().includes(lowerText);

        // Check attendee match
        const attendeeMatch = item.attendees?.some((att: Attendee) => {
          const fullName = (
            att.firstName +
            ' ' +
            (att.lastName || '')
          ).toLowerCase();
          return (
            fullName.includes(lowerText) ||
            att.email?.toLowerCase().includes(lowerText)
          );
        });

        // Check organizer match
        const organizerMatch = item.organizer?.fullName
          ?.toLowerCase()
          .includes(lowerText);

        // Check for date match
        const dateMatch = moment(item.startTime)
          .format('MMM DD, YYYY')
          .toLowerCase()
          .includes(lowerText);

        // Check for priority match
        const priorityMatch = item.priority.toLowerCase().includes(lowerText);

        // Check for location match
        const locationMatch =
          item.location?.type?.toLowerCase().includes(lowerText) ||
          item.location?.link?.toLowerCase().includes(lowerText);

        return (
          titleMatch ||
          descMatch ||
          attendeeMatch ||
          organizerMatch ||
          dateMatch ||
          priorityMatch ||
          locationMatch
        );
      });
    }

    return result;
  };

  useEffect(() => {
    // Apply filters whenever search text or pending display changes
    const filtered = applyFilters(allEvents, searchText, pendingDisplay);
    setFilteredMeetings(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents, searchText, pendingDisplay]);

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  // Clear search
  const clearSearch = () => {
    setSearchText('');
    setSearchVisible(false);
  };

  const loadInvitations = async (f = '', t = '') => {
    try {
      allEvents.length === 0 && setLoading(true);
      const from = f || moment().startOf('month').toISOString();
      const to = t || moment().endOf('month').toISOString();
      const response = await axiosInstance.get(
        `/v2/calendar/event/myevents?from=${from}&to=${to}`,
      );

      if (response.data.success) {
        const eventsData = response.data.events.filter(
          (item: IEventV2) => item?.organizer?._id !== user?._id,
        );

        setAllEvents(eventsData);
        // Initial filter application
        setFilteredMeetings(
          applyFilters(eventsData, searchText, pendingDisplay),
        );

        const pending = response.data.events.filter(
          (item: any) =>
            item?.myResponseStatus === 'needsAction' &&
            item?.organizer?._id !== user?._id,
        ).length;
        dispatch(setPendingInvitationCount(pending || 0));
      }
    } catch (error) {
      console.log('Error loading meetings:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialMeetings.length === 0) {
      loadInvitations();
    } else {
      setAllEvents(initialMeetings);
      setFilteredMeetings(initialMeetings);
      setLoading(false);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeeMore = () => {
    setLoadMoreClicked(!loadMoreClicked);
    setVisibleInvitations(loadMoreClicked ? 5 : filteredMeetings.length);
  };

  const handleDetails = (item: Meeting) => {
    dispatch(
      setSelectedEventV2({
        invitationScreen: true,
        ...(item as unknown as IEventV2),
      }),
    );
  };

  const handleMeetingStatus = async (
    item: Meeting,
    responseStatus: string,
    responseOption: string,
    proposedTime: {
      start?: string;
      end?: string;
      reason?: string;
    } | null,
  ) => {
    try {
      const response = await axiosInstance.post(
        `/v2/calendar/event/invitation/response/${item._id}`,
        {
          responseStatus,
          responseOption,
          proposedTime,
        },
      );

      if (response.data.success) {
        loadInvitations(date.from, date.to);
        showToast({
          message: 'Event status updated',
        });
      }
    } catch (error: any) {
      console.log(
        'Error updating meeting status:',
        JSON.stringify(error.response?.data?.error || error, null, 2),
      );
    }
  };

  const styles = getStyles(Colors);
  const displayInvitations = filteredMeetings.slice(0, visibleInvitations);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {flex: 1, justifyContent: 'center', alignItems: 'center'},
        ]}>
        <LoadingSmall color={Colors.Primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
        paddingTop: top,
      }}>
      <View style={styles.container}>
        <View style={{height: gHeight(40), marginBottom: gGap(5)}}>
          {!searchVisible ? (
            <View style={styles.headerContainer}>
              <View style={styles.headerLeftCon}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={styles.backCon}>
                  <ArrowLeft color={Colors.BodyText} size={22} />
                </TouchableOpacity>
                <Text style={styles.title}>Invitations</Text>
              </View>
              <View style={styles.headerRightCon}>
                {pendingDisplay ? (
                  <MaterialIcon
                    onPress={() => {
                      setPendingDisplay(false);
                    }}
                    size={30}
                    name={'playlist-remove'}
                    color={Colors.BodyText}
                  />
                ) : (
                  <MaterialIcon
                    onPress={() => {
                      setPendingDisplay(true);
                    }}
                    size={30}
                    name={'pending-actions'}
                    color={Colors.BodyText}
                  />
                )}
                <MaterialCommunityIcon
                  onPress={() => {
                    setPickerVisible(!pickerVisible);
                  }}
                  size={30}
                  name={'calendar'}
                  color={Colors.BodyText}
                />
                <IoniconsIcon
                  onPress={() => {
                    setSearchVisible(true);
                  }}
                  size={30}
                  name={'search'}
                  color={Colors.BodyText}
                />
              </View>
            </View>
          ) : (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutRight}
              style={styles.searchCon}>
              <TextInput
                value={searchText}
                onChangeText={handleSearchChange}
                style={styles.searchBox}
                placeholder="Search by title, description, host..."
                placeholderTextColor={Colors.BodyText}
                autoFocus={true}
                returnKeyType="search"
              />
              <MaterialIcon
                onPress={clearSearch}
                name="cancel"
                size={30}
                color={Colors.BodyText}
                style={{
                  position: 'absolute',
                  right: gPadding(5),
                }}
              />
            </Animated.View>
          )}
        </View>

        {/* Display search filter info when searching */}
        {searchText.length > 0 && (
          <View style={styles.searchInfoContainer}>
            <Text style={styles.searchInfoText}>
              Searching: "{searchText}" • {filteredMeetings.length} results
            </Text>
          </View>
        )}

        {displayInvitations.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <NoDataAvailable />
            {(searchText.length > 0 || pendingDisplay) && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  clearSearch();
                  setPendingDisplay(false);
                }}>
                <Text style={styles.resetFiltersText}>Reset Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={Colors.BodyText}
                refreshing={false}
                onRefresh={() => {
                  loadInvitations();
                }}
              />
            }
            data={displayInvitations}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({item, index}) => (
              <MeetingCard
                meeting={item}
                index={index}
                onViewDetails={handleDetails}
                onAccept={i => {
                  i.recurrence.isRecurring
                    ? (dispatch(
                        updateCalInfo({isEventDeleteOptionVisible: true}),
                      ),
                      setClickedEvent({...i, for: 'accepted'}))
                    : handleMeetingStatus(i, 'accepted', 'thisEvent', null);
                }}
                onAttend={i => {
                  setClickedEvent({...i, for: 'proposedNewTime'});
                  setProposeData({...proposeData, proposeVisible: true});
                }}
                onDecline={i => {
                  i.recurrence.isRecurring
                    ? (dispatch(
                        updateCalInfo({isEventDeleteOptionVisible: true}),
                      ),
                      setClickedEvent({...i, for: 'declined'}))
                    : handleMeetingStatus(i, 'declined', 'thisEvent', null);
                }}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {filteredMeetings.length > 5 && (
          <View style={styles.seeMoreButtonContainer}>
            <SeeMoreButton
              onPress={handleSeeMore}
              buttonStatus={loadMoreClicked}
              buttonContainerStyle={{marginVertical: 16}}
            />
          </View>
        )}
      </View>
      <DateSelector
        state={{
          visible: pickerVisible,
          from: date.from,
          to: date.to,
        }}
        setState={(d: any) => {
          setDate(d);
        }}
        onCancel={() => {
          setPickerVisible(!pickerVisible);
        }}
        onOkPress={() => {
          loadInvitations(date.from, date.to);
        }}
      />
      {selectedEventV2?._id && <EventDetailsModalV2 from={'invitations'} />}
      <EventDeleteOptionModalV2
        onRemove={o => {
          handleMeetingStatus(clickedEvent, clickedEvent.for, o, null);
        }}
      />

      <ProposeNewTimeModalV2
        data={proposeData}
        onCancel={(d: boolean) => {
          setProposeData({...proposeData, proposeVisible: d});
        }}
        onPropose={d => {
          handleMeetingStatus(clickedEvent, clickedEvent.for, 'thisEvent', d);
        }}
      />
    </View>
  );
};

export default MeetingInvitations;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    searchBox: {
      backgroundColor: Colors.Foreground,
      height: gHeight(40),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.circle,
      paddingHorizontal: gPadding(15),
      paddingRight: gPadding(50),
      position: 'relative',
      color: Colors.BodyText,
    },
    clearButton: {
      position: 'absolute',
      right: gPadding(45),
      height: gHeight(40),
      justifyContent: 'center',
      zIndex: 10,
    },
    searchCon: {
      justifyContent: 'center',
    },
    searchInfoContainer: {
      backgroundColor: Colors.Primary + '15',
      paddingVertical: gPadding(8),
      paddingHorizontal: gPadding(15),
      borderRadius: borderRadius.default,
      marginBottom: gGap(10),
    },
    searchInfoText: {
      color: Colors.Primary,
      fontSize: fontSizes.small,
    },
    resetFiltersButton: {
      marginTop: gGap(15),
      paddingVertical: gPadding(8),
      paddingHorizontal: gPadding(15),
      backgroundColor: Colors.Primary,
      borderRadius: borderRadius.default,
    },
    resetFiltersText: {
      color: Colors.PrimaryButtonTextColor,
      fontSize: fontSizes.small,
      fontWeight: '500',
    },
    backCon: {
      backgroundColor: Colors.Foreground,
      padding: gPadding(8),
      borderRadius: 100,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    headerContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: gMargin(5),
    },
    headerLeftCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gPadding(10),
    },
    headerRightCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gPadding(10),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.2),
      fontWeight: '600',
      color: Colors.Heading,
    },
    listContainer: {
      paddingBottom: responsiveScreenHeight(2),
    },
    seeMoreButtonContainer: {
      alignItems: 'center',
    },
  });

const getCardStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.Foreground,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: responsiveScreenHeight(2),
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground + '10',
      paddingVertical: responsiveScreenHeight(1.2),
      paddingHorizontal: responsiveScreenWidth(4),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    idContainer: {
      backgroundColor: '#3B82F6',
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    idText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: responsiveScreenFontSize(1.2),
    },
    titleText: {
      flex: 1,
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      fontWeight: '600',
    },
    statusContainer: {
      marginLeft: 10,
    },
    cardContent: {
      padding: gGap(10),
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: gGap(5),
    },
    infoLabel: {
      width: '25%',
    },
    infoValue: {
      width: '75%',
      justifyContent: 'center',
    },
    labelText: {
      color: Colors.Heading,
      fontSize: fontSizes.small,
      fontWeight: '500',
    },
    hostContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    hostTextContainer: {
      marginLeft: 8,
    },
    hostName: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
      fontWeight: '500',
    },
    hostRole: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.1),
    },
    agendaText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
    },
    scheduleText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
    },
    scheduleTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.1),
      marginTop: 2,
    },
    durationText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
    },
    guestsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attendeeAvatarWrapper: {
      // Used for positioning
    },
    plusMoreContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#6366F1',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    plusMoreText: {
      color: '#FFFFFF',
      fontSize: responsiveScreenFontSize(1),
      fontWeight: '600',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // width: gWidth(200),
      flex: 1,
    },
    locationType: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
      marginLeft: 5,
      flex: 1,
    },
    cardActions: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
      justifyContent: 'space-around',
    },
    actionButton: {
      alignItems: 'center',
      padding: responsiveScreenWidth(2),
    },
    actionText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.1),
      marginTop: 4,
    },
  });

const DateSelector: React.FC<any> = ({
  setState,
  state,
  onCancel,
  onOkPress,
}) => {
  const Colors = useTheme();
  return (
    <ReactNativeModal isVisible={state.visible}>
      <View
        style={{
          backgroundColor: Colors.Foreground,
          padding: gPadding(10),
          gap: gPadding(10),
          borderRadius: borderRadius.default,
        }}>
        <Text
          style={{
            color: Colors.Heading,
            fontSize: fontSizes.body,
            fontWeight: '500',
          }}>
          Start date
        </Text>

        <Calendar
          renderArrow={(direction: 'left' | 'right') =>
            direction === 'left' ? (
              <MaterialIcon
                name="chevron-left"
                size={30}
                color={Colors.BodyText}
              />
            ) : (
              <MaterialIcon
                name="chevron-right"
                size={30}
                color={Colors.BodyText}
              />
            )
          }
          theme={{
            calendarBackground: Colors.Background_color,
            selectedDayBackgroundColor: Colors.Primary,
            selectedDayTextColor: Colors.PureWhite,
            todayTextColor: Colors.Primary,
            dayTextColor: Colors.Heading,
            textDisabledColor: Colors.datePickerDisableTextColor,
            arrowColor: Colors.Primary,
            monthTextColor: Colors.Heading,
            textSectionTitleColor: Colors.Heading,
            textDayFontWeight: '500',
            textMonthFontWeight: '600',
          }}
          onDayPress={(day: {dateString: string}) => {
            setState({
              to: state.to,
              from: moment(day.dateString).startOf('day').toISOString(),
            });
          }}
          markedDates={{
            [moment(state.from).format('YYYY-MM-DD')]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
            },
          }}
        />
        <Text
          style={{
            color: Colors.Heading,
            fontSize: fontSizes.body,
            fontWeight: '500',
          }}>
          End date
        </Text>
        <Calendar
          renderArrow={(direction: 'left' | 'right') =>
            direction === 'left' ? (
              <MaterialIcon
                name="chevron-left"
                size={30}
                color={Colors.BodyText}
              />
            ) : (
              <MaterialIcon
                name="chevron-right"
                size={30}
                color={Colors.BodyText}
              />
            )
          }
          theme={{
            calendarBackground: Colors.Background_color,
            selectedDayBackgroundColor: Colors.Primary,
            selectedDayTextColor: Colors.PureWhite,
            todayTextColor: Colors.Primary,
            dayTextColor: Colors.Heading,
            textDisabledColor: Colors.datePickerDisableTextColor,
            arrowColor: Colors.Primary,
            monthTextColor: Colors.Heading,
            textSectionTitleColor: Colors.Heading,
            textDayFontWeight: '500',
            textMonthFontWeight: '600',
          }}
          onDayPress={(day: {dateString: string}) => {
            setState({
              to: moment(day.dateString).endOf('day').toISOString(),
              from: state.from,
            });
          }}
          markedDates={{
            [moment(state.to).format('YYYY-MM-DD')]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
            },
          }}
        />
        <View style={{flexDirection: 'row', gap: gGap(10)}}>
          <CustomButton
            textColor={Colors.SecondaryButtonTextColor}
            backgroundColor={Colors.SecondaryButtonBackgroundColor}
            buttonText={'Cancel'}
            toggleModal={onCancel}
            containerStyle={{
              borderColor: Colors.BorderColor,
              borderWidth: 1,
            }}
            textStyle={{}}
          />
          <CustomButton
            textColor={Colors.PrimaryButtonTextColor}
            backgroundColor={Colors.PrimaryButtonBackgroundColor}
            buttonText={'Ok'}
            toggleModal={() => {
              onCancel();
              onOkPress();
            }}
            containerStyle={{}}
            textStyle={{}}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};
