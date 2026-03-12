import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IEventV2, Reminder} from '../../types';

// Define allowed literal types for each property
type Role = 'organizer' | 'attendee';
type Status = 'accepted' | 'pending' | 'denied' | 'finished';
type State = 'confirmed' | 'cancelled' | 'todo' | 'inprogress' | 'completed';
type Priority = 'low' | 'medium' | 'high';

// Define the interface for the query parameters
export interface ICalendarQuery {
  // Required ISO 8601 date strings
  from?: string; // Start of date range
  to?: string; // End of date range

  // Optional filters
  roles?: Role[]; // Filter by user's role in events
  statuses?: Status[]; // Filter by attendee response status
  states?: State[]; // Filter by event/task state
  priorities?: Priority[]; // Filter by importance level

  // Optional flag to include attendee details
  includeAttendees?: boolean;
}

interface EventsByHour {
  [hour: string]: IEventV2[];
}

export interface TransformedEvents {
  [date: string]: EventsByHour;
}
interface INewEventData {
  isModalVisible?: boolean;
  text?: string;
  isRepeatClicked?: boolean;
  eventType?: 'task' | 'event';
}

interface Interval {
  _id: string;
  from: string;
  to: string;
}

interface Availability {
  _id: string;
  type: string;
  intervals: Interval[];
  wday: string;
}

interface ISchedule {
  _id: string;
  name: string;
  availability: Availability[];
  timeZone: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CalendarState {
  weeklyEvents: IEventV2[];
  weekEventsObj: TransformedEvents | null;
  selectedEventV2: IEventV2 | null;
  filterParameter: ICalendarQuery | null;
  weekOffset: number; // Added week offset for pagination
  newEventData: INewEventData | null;
  calendarInfo: {
    selectedView: 'day' | 'week' | 'month';
    dayOffset: number;
    weekOffset: number;
    monthOffset: number;
    isEventDeleteOptionVisible?: boolean;
    updateEventVisible?: boolean;
    searchText: string;
  };
  monthViewEvents: TransformedEvents | null;
  dayViewEvents: IEventV2[];
  pendingInvitationCount: number;
  eventReminders: Reminder | null;
  availabilitiesInfo: ISchedule | null;
}

const initialState: CalendarState = {
  availabilitiesInfo: null,
  weeklyEvents: [],
  weekEventsObj: null,
  selectedEventV2: null,
  filterParameter: {},
  weekOffset: 0,
  newEventData: null,
  calendarInfo: {
    selectedView: 'day',
    dayOffset: 0,
    weekOffset: 0,
    monthOffset: 0,
    searchText: '',
  },
  monthViewEvents: {},
  dayViewEvents: [],
  pendingInvitationCount: 0,
  eventReminders: {
    methods: ['email'],
    offsetMinutes: 5,
    crowds: [],
  },
};

const calendarSliceV2 = createSlice({
  name: 'calendarV2',
  initialState,
  reducers: {
    setEventReminders: (state, action: PayloadAction<Reminder>) => {
      state.eventReminders = action.payload;
    },
    setPendingInvitationCount: (state, action: PayloadAction<number>) => {
      state.pendingInvitationCount = action.payload;
    },
    setDayViewEvents: (state, action: PayloadAction<IEventV2[]>) => {
      state.dayViewEvents = action.payload;
    },
    setMonthViewEvents: (state, action: PayloadAction<TransformedEvents>) => {
      state.monthViewEvents = action.payload;
    },
    setWeeklyEvents: (state, action: PayloadAction<IEventV2[]>) => {
      state.weeklyEvents = action.payload;
    },
    updateCalInfo: (state, action: PayloadAction<any>) => {
      const pre = state.calendarInfo;

      state.calendarInfo = {...pre, ...action.payload};
    },
    setCalInfo: (state, action: PayloadAction<any>) => {
      state.calendarInfo = action.payload;
    },
    setNewEventData: (state, action: PayloadAction<INewEventData | null>) => {
      if (action.payload === null) {
        state.newEventData = null;
      } else {
        state.newEventData = {...state.newEventData, ...action.payload};
      }
    },

    // Updated to safely handle and type-convert filter parameters
    setFilterParameter: (state, action: PayloadAction<Record<string, any>>) => {
      if (Object.values(action.payload)[0]?.length === 0) {
        const keyToRemove = Object.keys(
          action.payload,
        )[0] as keyof typeof state.filterParameter;
        const newFilterParameter = {...state.filterParameter};
        delete newFilterParameter[keyToRemove];
        state.filterParameter = newFilterParameter;
      }
      // Update state with type-safe values
      if (state.filterParameter === null) {
        state.filterParameter = action.payload;
      } else {
        state.filterParameter = {...state.filterParameter, ...action.payload};
      }
    },

    clearFilterParameters: state => {
      state.filterParameter = {};
    },

    setWeekOffset: (state, action: PayloadAction<number>) => {
      state.weekOffset = action.payload;
    },

    setWeekEventsObj: (state, action: PayloadAction<TransformedEvents>) => {
      state.weekEventsObj = action.payload;
      // if (state.weekEventsObj === null) {
      // } else {
      //   state.weekEventsObj = {...state.weekEventsObj, ...action.payload};
      // }
    },

    setSelectedEventV2: (state, action: PayloadAction<IEventV2 | null>) => {
      state.selectedEventV2 = action.payload;
      if (action.payload == null) {
        state.eventReminders = null;
      } else {
        state.eventReminders = {
          methods: action?.payload?.reminders?.[0]?.methods || ['email'],
          offsetMinutes: action?.payload?.reminders?.[0]?.offsetMinutes || 5,
          crowds: action?.payload?.reminders?.[0]?.crowds || [],
        };
      }
    },
  },
});

export const {
  setEventReminders,
  updateCalInfo,
  setWeeklyEvents,
  setWeekEventsObj,
  setSelectedEventV2,
  setFilterParameter,
  clearFilterParameters,
  setWeekOffset,
  setNewEventData,
  setMonthViewEvents,
  setDayViewEvents,
  setPendingInvitationCount,
  setCalInfo,
} = calendarSliceV2.actions;

export default calendarSliceV2.reducer;
