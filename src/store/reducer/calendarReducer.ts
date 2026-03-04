// src/store/reducer/calendarSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {generateRandomHexId} from '../../components/HelperFunction';
import moment from 'moment';

// Define the state interface. Adjust types as needed.
interface CalendarState {
  calendarEvent: any[];
  events: any[];
  invitations: any[];
  event: any | null;
  holidays: any[];
  weekends: any[];
  availabilities: any[];
  availabilityData: any;
  specificHours: any[];
  users: any[];
  pickedDate: string;
  filterState: string;
  eventNotification: any[];
  monthViewData: any[];
  notificationClicked: any | null;
  eventStatus: string;
  updateEventInfo: any | null;
  eventDetails: any | null;
}

const initialState: CalendarState = {
  calendarEvent: [],
  events: [],
  invitations: [],
  event: null,
  holidays: [],
  weekends: [],
  availabilities: [],
  availabilityData: {},
  specificHours: [],
  users: [],
  pickedDate: '',
  filterState: '',
  eventNotification: [],
  monthViewData: [],
  notificationClicked: null,
  eventStatus: 'all',
  updateEventInfo: null,
  eventDetails: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setNotificationClicked: (state, action: PayloadAction<any>) => {
      state.notificationClicked = action.payload;
    },
    setMonthViewData: (state, action: PayloadAction<any[]>) => {
      state.monthViewData = action.payload;
    },
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    updateCalendar: (state, action: PayloadAction<any[]>) => {
      state.calendarEvent = action.payload;
    },
    setEvents: (state, action: PayloadAction<any[]>) => {
      state.events = action.payload;
    },
    setInvitations: (state, action: PayloadAction<any[]>) => {
      state.invitations = action.payload;
    },
    updateInvitations: (state, action: PayloadAction<{id: string}>) => {
      const {id} = action.payload;
      state.invitations = state.invitations.filter(item => item._id !== id);
    },
    setSingleEvent: (state, action: PayloadAction<any>) => {
      state.event = action.payload;
    },
    setHolidays: (state, action: PayloadAction<any[]>) => {
      state.holidays = action.payload;
    },
    setWeekends: (state, action: PayloadAction<any[]>) => {
      state.weekends = action.payload;
    },
    setAvailabilityData: (state, action: PayloadAction<any>) => {
      state.availabilityData = action.payload;
    },
    setSpecificHoursData: (state, action: PayloadAction<any[]>) => {
      const wdayOrder = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const sortedData = action.payload
        .filter(item => item.type === 'date')
        .sort((a, b) => wdayOrder.indexOf(a.date) - wdayOrder.indexOf(b.date));
      state.specificHours = sortedData;
    },
    setAvailabilities: (state, action: PayloadAction<{data: any[]}>) => {
      const wdayOrder = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const {data} = action.payload;
      const sortedData = data
        .filter(
          item => item.wday && wdayOrder.includes(item.wday.toLowerCase()),
        )
        .sort(
          (a, b) =>
            wdayOrder.indexOf(a.wday.toLowerCase()) -
            wdayOrder.indexOf(b.wday.toLowerCase()),
        );
      state.availabilities = sortedData;
    },
    toggleAvailabilitySwitch: (
      state,
      action: PayloadAction<{index: number}>,
    ) => {
      const {index} = action.payload;
      if (state.availabilities[index].intervals?.length === 0) {
        state.availabilities[index].intervals = [
          {_id: generateRandomHexId(24), from: '11:00', to: '12:00'},
        ];
      } else {
        state.availabilities[index].intervals = [];
      }
    },
    addIntervals: (state, action: PayloadAction<{index: number}>) => {
      const {index} = action.payload;
      if (state.availabilities[index].intervals?.length) {
        state.availabilities[index].intervals = [
          ...state.availabilities[index].intervals,
          {_id: generateRandomHexId(24), from: '11:00', to: '12:00'},
        ];
      } else {
        state.availabilities[index].intervals = [];
      }
    },
    updateBulkInterval: (
      state,
      action: PayloadAction<{
        days: {day: string; checked?: boolean}[];
        index: number;
      }>,
    ) => {
      const {days, index} = action.payload;
      const intervals = state.availabilities[index].intervals;
      const checkedDaysMap = days.reduce((acc, item) => {
        if (item.checked) {
          acc[item.day.toLowerCase()] = true;
        }
        return acc;
      }, {} as {[key: string]: boolean});
      state.availabilities = state.availabilities.map(item => {
        if (checkedDaysMap[item.wday.toLowerCase()]) {
          return {...item, intervals};
        }
        return item;
      });
    },
    removeIntervals: (
      state,
      action: PayloadAction<{index: number; intervalIndex: number}>,
    ) => {
      const {index, intervalIndex} = action.payload;
      if (state.availabilities[index].intervals?.length) {
        state.availabilities[index].intervals = state.availabilities[
          index
        ].intervals.filter((_: any, idx: number) => idx !== intervalIndex);
      } else {
        state.availabilities[index].intervals = [];
      }
    },
    updateIntervalsTime: (
      state,
      action: PayloadAction<{
        index: number;
        intervalIndex: number;
        time: string;
        period: string;
      }>,
    ) => {
      const {index, intervalIndex, time, period} = action.payload;
      if (state.availabilities[index]?.intervals[intervalIndex]) {
        if (period === 'from') {
          state.availabilities[index].intervals[intervalIndex].from = time;
        }
        if (period === 'to') {
          state.availabilities[index].intervals[intervalIndex].to = time;
        }
      }
    },
    removeSpecificDateAvailability: (
      state,
      action: PayloadAction<{index: number}>,
    ) => {
      const {index} = action.payload;
      if (state.specificHours.length > 0) {
        state.specificHours = state.specificHours.filter(
          (_, idx) => idx !== index,
        );
      }
    },
    addSpecificInterval: (state, action: PayloadAction<{data: any}>) => {
      const {data} = action.payload;
      state.specificHours = [...state.specificHours, data];
    },
    setDayViewPickedDate: (state, action: PayloadAction<{time: string}>) => {
      state.pickedDate = action.payload.time;
    },
    updatePickedDate: (state, action: PayloadAction<any>) => {
      const {day, hour, from} = action.payload;
      if (from === 'month') {
        state.pickedDate = day;
        return;
      }
      if (!day || typeof hour !== 'number' || hour < 0 || hour > 23) {
        state.pickedDate = '';
      } else if (from === 'month') {
        try {
          // const date = new Date(day);
          // date.setDate(date.getDate());
          // date.setUTCMinutes(minutes);
          // date.setUTCHours(hour);
          state.pickedDate = day;
        } catch (error) {
          state.pickedDate = '';
        }
      } else {
        try {
          const date = new Date(day);
          date.setDate(date.getDate() + 1);
          date.setUTCHours(hour);
          const result = date.toISOString();
          const timeZone = new Date().getTimezoneOffset();
          state.pickedDate = moment(result)
            .add(parseInt(String(timeZone), 10), 'minutes')
            .toString();
        } catch (error) {
          state.pickedDate = '';
        }
      }
    },
    setFilterState: (state, action: PayloadAction<string>) => {
      state.filterState = action.payload;
    },
    setNewEvent: (state, action: PayloadAction<{event: any; time: string}>) => {
      const {event, time} = action.payload;
      const newState = [...state.calendarEvent];
      const newData = event;
      const dataIndex = newState.findIndex(item => item.title === time);
      if (dataIndex !== -1) {
        const updatedDataArray = [...newState[dataIndex].data, newData];
        return {
          ...state,
          calendarEvent: newState.map((item, index) =>
            index === dataIndex ? {...item, data: updatedDataArray} : item,
          ),
        };
      } else {
        const newDateEntry = {
          title: time,
          data: [newData],
        };
        return {
          ...state,
          calendarEvent: [...newState, newDateEntry],
        };
      }
    },
    deleteEvent: (
      state,
      action: PayloadAction<{eventId: string; time: string}>,
    ) => {
      const {eventId, time} = action.payload;
      const newState = [...state.calendarEvent];
      const dataIndex = newState.findIndex(item => item.title === time);
      if (dataIndex !== -1) {
        const updatedDataArray = newState[dataIndex].data.filter(
          (item: any) => item._id !== eventId,
        );
        state.calendarEvent[dataIndex].data = updatedDataArray;
      }
      return state;
    },
    setEventNotification: (state, action: PayloadAction<any[]>) => {
      state.eventNotification = action.payload;
    },
    setEventStatus: (state, action: PayloadAction<string>) => {
      state.eventStatus = action.payload;
    },
    setUpdateEventInfo: (state, action: PayloadAction<any>) => {
      state.updateEventInfo = {...state.updateEventInfo, ...action.payload};
    },
    clearUpdateEventInfo: state => {
      state.updateEventInfo = null;
    },
    setEventDetails: (state, action: PayloadAction<any>) => {
      state.eventDetails = {...state.eventDetails, ...action.payload};
    },
    clearEventDetails: state => {
      state.eventDetails = null;
    },
  },
});

export const {
  setEventDetails,
  clearEventDetails,
  clearUpdateEventInfo,
  setUpdateEventInfo,
  setEventStatus,
  setMonthViewData,
  setEventNotification,
  deleteEvent,
  setNewEvent,
  setFilterState,
  setUsers,
  setInvitations,
  updateInvitations,
  updateCalendar,
  setEvents,
  setSingleEvent,
  setHolidays,
  setWeekends,
  setAvailabilities,
  toggleAvailabilitySwitch,
  addIntervals,
  removeIntervals,
  setAvailabilityData,
  updateIntervalsTime,
  setSpecificHoursData,
  removeSpecificDateAvailability,
  addSpecificInterval,
  updateBulkInterval,
  updatePickedDate,
  setDayViewPickedDate,
  setNotificationClicked,
} = calendarSlice.actions;

export default calendarSlice.reducer;
