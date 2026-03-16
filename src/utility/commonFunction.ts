import moment from 'moment';
import {Alert, Share} from 'react-native';
import {showToast} from '../components/HelperFunction';
import store from '../store';
import Clipboard from '@react-native-clipboard/clipboard';
import {setAlert} from '../store/reducer/ModalReducer';
import {resetApp} from '../store/action';
import {storage} from './mmkvInstance';
import lodash from 'lodash';
import {TUserProfile} from '../components/MockInterviewCom/ShareInterviewModal';
import {mStore} from './mmkvStoreName';
import {showConfirmationModal} from '../store/reducer/globalReducer';
import {IEventV2} from '../types';
import axiosInstance from './axiosInstance';
import {loadCommunityPosts} from '../actions/chat-noti';
import {setComInfo} from '../store/reducer/communityReducer';
import {OneSignal} from 'react-native-onesignal';
// Regular expressions and helper function for link conversion.
const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;
const WWW_REGEX = /(^|[^\\/])(www\.[\S]+(\b|$))/gim;

export const convertLink = (text: string): string => {
  let textWithLinks = text.replace(
    URL_REGEX,
    '<a target="_blank" href="$1">$1</a>',
  );
  return textWithLinks.replace(
    WWW_REGEX,
    '$1<a target="_blank" href="http://$2">$2</a>',
  );
};
/**
 * Generates a random hex color.
 * @param opacity - Optional value between 0 (transparent) and 1 (opaque).
 */
export const randomHexColor = (opacity?: number): `#${string}` => {
  // Generate random 24-bit color
  const n = Math.floor(Math.random() * 0xffffff);
  const color = n.toString(16).padStart(6, '0');

  // Handle Alpha Channel
  let alpha = '';
  if (opacity !== undefined) {
    // Clamp to [0, 1], scale to 255, and convert to hex
    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    alpha = Math.round(clampedOpacity * 255)
      .toString(16)
      .padStart(2, '0');
  }

  return `#${color}${alpha}` as `#${string}`;
};
export function replaceSpaceWithDash(value: string): string {
  const result = value.replace(/\s+/g, '-');

  return result;
}

export function convertSize(bits: number) {
  const units = ['bit', 'KB', 'MB', 'GB', 'TB'];
  const factor = 1024;

  if (bits < 0) return '0 bit';

  let i = 0;
  let size = bits * 8; // Convert bits to bytes

  while (size >= factor && i < units.length - 1) {
    size /= factor;
    i++;
  }

  return `${size.toFixed(2)} ${units[i]}`;
}
// Compare two objects deeply
export const filterDuplicateUsers = (users: TUserProfile[]) => {
  const uniqueUsers = lodash.uniqWith(users, lodash.isEqual);
  return (
    uniqueUsers.filter(
      (item: TUserProfile) => item._id !== store.getState().auth.user._id,
    ) || []
  );
};
export function compareObject(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, i) => compareObject(val, b[i]))
    );
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  for (const key in a) {
    if (!(key in b) || !compareObject(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

// Convert event type to a human-readable string
export const eventTypes = (type?: string) => {
  if (!type) {
    return '';
  }
  return type === 'showNTell'
    ? 'Show N Tell'
    : type === 'mockInterview'
    ? 'Mock Interview'
    : type === 'orientation'
    ? 'Orientation Meeting'
    : type === 'technicalInterview'
    ? 'Technical Interview'
    : type === 'behavioralInterview'
    ? 'Behavioral Interview'
    : type === 'syncUp'
    ? 'Sync up call'
    : type === 'reviewMeeting'
    ? 'Review Meeting'
    : type === 'other'
    ? 'Others'
    : 'Select Type';
};

// Format a date dynamically (Today, Yesterday, etc.)
export function formatDynamicDate(dateStr: string | Date): string {
  const momentDate = moment(dateStr);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const startOfWeek = moment().startOf('week');

  if (momentDate.isSame(today, 'day')) {
    return 'Today';
  }

  if (momentDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }

  if (momentDate.isSameOrAfter(startOfWeek)) {
    return `${momentDate.format('ddd')}, ${momentDate.format('MMM D, YYYY')}`;
  }

  return momentDate.format('MMM D, YYYY');
}

// Replace the time part in an ISO datetime string with a new time.
export function replaceTimeInDatetime(
  datetimeString: string,
  newTime: string,
): string {
  const originalMoment = moment(datetimeString);
  const newTimeMoment = moment(newTime, 'hh:mm A');

  originalMoment.set({
    hour: newTimeMoment.hour(),
    minute: newTimeMoment.minute(),
    second: 0,
  });

  const modifiedDatetimeString = originalMoment.format(
    'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  );
  console.log('modifieded', JSON.stringify(modifiedDatetimeString, null, 1));
  return modifiedDatetimeString;
}

// Props for combining date and time
export type CombineDateAndTimeProps = {
  fullDate?: string;
  date?: string;
  time?: string;
};

// Combine date and time values into an ISO string.
export function combineDateAndTime(props: CombineDateAndTimeProps): string {
  const {fullDate, date, time} = props;

  if (date) {
    const combinedDate = moment(fullDate)
      .set({
        year: moment(date, 'YYYY-MM-DD').year(),
        month: moment(date, 'YYYY-MM-DD').month(),
        date: moment(date, 'YYYY-MM-DD').date(),
      })
      .toISOString();

    return combinedDate;
  } else if (fullDate && time) {
    console.log('fullDate', JSON.stringify(fullDate, null, 2));
    console.log('time', JSON.stringify(time, null, 2));
    const newDate = moment(fullDate)
      .set({
        hour: moment(time, 'hh:mm A').hour(),
        minute: moment(time, 'hh:mm A').minute(),
        second: moment(time, 'hh:mm A').second(),
        millisecond: moment(time, 'hh:mm A').millisecond(),
      })
      .toISOString();
    return newDate;
  } else {
    return moment().toISOString();
  }
}

// Extract hashtag texts from a given string.
export function getHashtagTexts(text: string): string[] | undefined {
  if (!text) {
    return;
  }
  const regex = /#(\w+)/g;
  const matches = text.matchAll(regex);
  return Array.from(matches, match => match[1]).filter(tag =>
    /^[a-zA-Z0-9_]+$/.test(tag),
  );
}

// Format a date into a readable string.
export function formattingDate(date: string | number | Date): string {
  const dateObject = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = dateObject.toLocaleDateString('en-US', options);
  return formattedDate;
}

// Generate an array of random numbers.
export function generateRandomNumbers(max: number): number[] {
  const count = Math.floor(max / 3);
  const randomNumbers: number[] = [];
  for (let i = 0; i < count; i++) {
    randomNumbers.push(Math.floor(Math.random() * (max - 2 + 1)) + 2);
  }
  return randomNumbers;
}

// Share a message using the native share dialog.
export const onShare = async (message: string): Promise<void> => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};

// Copy text to clipboard and show a toast.
export const handleCopyText = (text: string): void => {
  console.log('text', JSON.stringify(text, null, 1));
  try {
    Clipboard.setString(text);
    showToast({message: 'Link copied!'});
  } catch (error) {
    console.error('Error while copying to clipboard:', error);
  }
};

// Trim a full name to at most three words.
export const nameTrim = (fullName: string): string => {
  const n = fullName || 'New User';
  let name = n.split(' ').slice(0, 3).join(' ');
  return name;
};

// Dispatch an alert modal action.
export const showAlertModal = (data: any): void => {
  store.dispatch(setAlert({visible: true, data}));
};

// Debounce function: delays execution until a delay has passed without calls.
export const debounce = (
  func: (...args: any[]) => void,
  delay = 500,
): ((...args: any[]) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastArgs: any;
  let isPending = false;

  const execute = () => {
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
      isPending = false;
    }
  };

  return function (...args: any[]) {
    lastArgs = args;

    if (isPending) {
      clearTimeout(timeoutId);
    }

    isPending = true;
    timeoutId = setTimeout(execute, delay);
  };
};
const handleRemoveDeviceToken = async () => {
  try {
    const response = await axiosInstance.post('/user/save-device-token/v2', {
      action: 'remove',
    });
    console.log(
      'Device token removed from backend successfully! success:',
      response.data.success,
    );
  } catch (error: any) {
    console.log(
      'To remove device token',
      JSON.stringify(error.response.data, null, 2),
    );
  }
};
// Sign out by clearing tokens and resetting the app.
export const handleSignOut = async (): Promise<void> => {
  await handleRemoveDeviceToken();
  OneSignal.logout();
  storage?.delete(mStore.USER_TOKEN);
  storage?.delete(mStore.ACTIVE_ENROLLMENT);
  storage?.delete(mStore.ALL_CROWDS_MEMBERS);
  storage?.delete(mStore.ALL_CROWDS_VOICES);
  storage?.delete(mStore.ALL_MESSAGES);
  storage?.delete(mStore.COMMUNITY_POSTS);
  storage?.delete(mStore.ORGANIZATION);
  store.dispatch(resetApp());
};

export const openConfirmModal = ({
  title,
  des,
  func,
  type,
}: {
  type?: 'info' | 'delete';
  title?: string;
  des?: string;
  func: () => void;
}) => {
  store.dispatch(
    showConfirmationModal({
      title: title || 'Delete Item',
      message: des || 'Do you want to delete this item?',
      onConfirm: func || showToast({message: 'No function found'}),
      type: type || 'delete',
    }),
  );
};

export const validateEvent = async (params: IEventV2): Promise<boolean> => {
  // Check title
  if (!params?.title?.trim()) {
    showToast({message: 'Title is required'});
    return false;
  }

  // Check startTime
  if (!params?.startTime || isNaN(new Date(params.startTime).getTime())) {
    showToast({message: 'Valid start time is required'});
    return false;
  }

  // Check endTime
  if (!params?.endTime || isNaN(new Date(params.endTime).getTime())) {
    showToast({message: 'Valid end time is required'});
    return false;
  }

  // Check that endTime is after startTime
  if (
    params.startTime &&
    params.endTime &&
    new Date(params.endTime) <= new Date(params.startTime)
  ) {
    showToast({message: 'End time must be after start time'});
    return false;
  }

  return true;
};
export const validateCreateEvent = async (
  params: IEventV2,
): Promise<boolean> => {
  // Check title
  if (!params?.title?.trim()) {
    showToast({message: 'Title is required'});
    return false;
  }

  // Check startTime
  if (!params?.startTime || isNaN(new Date(params.startTime).getTime())) {
    showToast({message: 'Valid start time is required'});
    return false;
  }

  // Check endTime
  if (!params?.endTime || isNaN(new Date(params.endTime).getTime())) {
    showToast({message: 'Valid end time is required'});
    return false;
  }

  // Check that endTime is after startTime
  if (
    params.startTime &&
    params.endTime &&
    new Date(params.endTime) <= new Date(params.startTime)
  ) {
    showToast({message: 'End time must be after start time'});
    return false;
  }

  // Check recurrence.endRecurrence if isRecurring is true
  if (params?.recurrence?.isRecurring) {
    if (
      !params.recurrence.endRecurrence ||
      isNaN(new Date(params.recurrence.endRecurrence).getTime())
    ) {
      showToast({
        message: 'Valid recurrence end date is required for recurring events',
      });
      return false;
    }

    // Ensure endRecurrence is within 1 year of startTime
    if (params.startTime && params.recurrence.endRecurrence) {
      const start = new Date(params.startTime);
      const endRecurrence = new Date(params.recurrence.endRecurrence);
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(start.getFullYear() + 1);

      if (endRecurrence > oneYearLater) {
        showToast({
          message: 'Recurrence end date must be within one year of start time',
        });
        return false;
      }
    }
  }

  return true;
};

export const loadComPostNewly = () => {
  store.dispatch(
    setComInfo({
      action: 'set',
      data: {
        page: 1,
        limit: 10,
        query: '',
        tags: [],
        user: '',
        filterBy: '',
      },
    }),
  );
  loadCommunityPosts();
};

export function calculateOverallProgress(
  data: Array<{
    category: {name: string; slug: string};
    totalItems: number;
    completedItems: number;
    pinnedItems: number;
    incompletedItems: number;
  }>,
): number {
  const totalCompleted =
    data && data?.length > 0
      ? data?.reduce((acc, curr) => acc + Number(curr.completedItems), 0)
      : 0;
  const totalIncomplete =
    data && data?.length > 0
      ? data?.reduce((acc, curr) => acc + Number(curr.incompletedItems), 0)
      : 0;

  if (totalCompleted + totalIncomplete === 0) return 0;

  return (
    Math.round((totalCompleted / (totalCompleted + totalIncomplete)) * 100) || 0
  );
}

export function timeFromNow(inputDate: string) {
  // Parse input date
  const pastDate = new Date(inputDate);
  if (isNaN(pastDate.getTime())) {
    return 'Invalid date';
  }

  // Current date: May 16, 2025, 05:23 PM +06
  const currentDate = new Date('2025-05-16T11:23:00Z'); // Converted +06 to UTC (05:23 PM +06 = 11:23 AM UTC)

  // Calculate time difference
  const diffMs = currentDate.getTime() - pastDate.getTime();
  const absDiffMs = Math.abs(diffMs);

  // Convert to seconds, minutes, hours, days
  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Calculate exact months and years
  let years = currentDate.getUTCFullYear() - pastDate.getUTCFullYear();
  let months = currentDate.getUTCMonth() - pastDate.getUTCMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (currentDate.getUTCDate() < pastDate.getUTCDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  console.log('days', JSON.stringify(days, null, 2));
  // Return single unit string based on hierarchy
  if (years >= 1) {
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } else if (months >= 1) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else if (days >= 1) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  }
}

export const theme = () => {
  const t = storage?.getString('displayMode');
  if (t === 'light' || t === 'default') {
    return 'light';
  } else if (t === 'dark') {
    return 'dark';
  }
  return 'light';
};
