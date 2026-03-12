import moment from 'moment';
import axiosInstance from '../utility/axiosInstance';
import {IEventV2} from '../types';
import store from '../store';
import {
  ICalendarQuery,
  setDayViewEvents,
  setMonthViewEvents,
  setPendingInvitationCount,
  setSelectedEventV2,
  setWeekEventsObj,
  setWeeklyEvents,
} from '../store/reducer/calendarReducerV2';
import {showToast} from '../components/HelperFunction';
import {setBootcampsData} from '../store/reducer/dashboardReducer';
import {selectNote} from '../store/reducer/notesReducer';

interface EventsByHour {
  [hour: string]: IEventV2[];
}

interface TransformedEvents {
  [date: string]: EventsByHour;
}

const transformEvents = (events: IEventV2[]): TransformedEvents => {
  const result: TransformedEvents = {};

  events.forEach(event => {
    const startDateTime = moment(event.startTime);
    const dateStr = startDateTime.format('YYYY-MM-DD');
    const hourStr = startDateTime.hour().toString();

    if (!result[dateStr]) {
      result[dateStr] = {};
    }
    if (!result[dateStr][hourStr]) {
      result[dateStr][hourStr] = [];
    }
    result[dateStr][hourStr].push(event);
  });

  return result;
};

type ViewType = 'day' | 'week' | 'month';

export const getCalendarEvents = async ({
  view,
  offset,
  filterParameter,
}: {
  view: ViewType;
  offset: number;
  filterParameter: ICalendarQuery | null;
}) => {
  // Calculate the startTime and end dates based on view type and offset
  console.log('Load calender event -------------------------');
  let start: moment.Moment;
  let end: moment.Moment;

  switch (view) {
    case 'day':
      start = moment().add(offset, 'days').startOf('day');
      end = moment().add(offset, 'days').endOf('day');
      break;
    case 'week':
      start = moment().add(offset, 'weeks').startOf('week');
      end = moment().add(offset, 'weeks').endOf('week');
      break;
    case 'month':
      start = moment().add(offset, 'months').startOf('month');
      end = moment().add(offset, 'months').endOf('month');
      break;
    default:
      throw new Error('Invalid view type');
  }

  try {
    const response = await axiosInstance.get('/v2/calendar/event/myevents', {
      params: {
        from: start.toISOString(),
        to: end.toISOString(),
        ...filterParameter,
      },
    });
    // console.log(
    //   'response.data.success',
    //   JSON.stringify(response.data, null, 2),
    // );

    // Dispatch the correct action based on view type
    console.log('view', JSON.stringify(view, null, 2));
    if (view === 'month') {
      const groupedData = response.data.events.reduce(
        (acc: {[key: string]: IEventV2[]}, item: IEventV2) => {
          const key = moment(item.startTime).format('YYYY-M-D');
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        },
        {} as {[key: string]: IEventV2[]},
      );
      store.dispatch(setMonthViewEvents(groupedData));
    } else if (view === 'week') {
      store.dispatch(setWeekEventsObj(transformEvents(response.data.events)));
    } else if (view === 'day') {
      store.dispatch(setDayViewEvents(response.data.events || []));
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const handleDeleteEvent = async (
  eventId: string,
  deleteOption: string,
  eventType: 'event' | 'task',
) => {
  try {
    const url = `/v2/calendar/event/delete/${eventId}?deleteOption=${deleteOption}`;
    const response = await axiosInstance.delete(url);

    if (response.data.success) {
      await LoadUpcomingEvent(0);

      showToast({
        message: `${
          eventType === 'event' ? 'Event' : 'Task'
        } deleted successfully`,
      });
      getCalendarEvents({
        offset:
          store.getState().calendarV2.calendarInfo.selectedView === 'day'
            ? store.getState().calendarV2.calendarInfo.dayOffset
            : store.getState().calendarV2.calendarInfo.selectedView === 'week'
            ? store.getState().calendarV2.calendarInfo.weekOffset
            : store.getState().calendarV2.calendarInfo.monthOffset,
        filterParameter: store.getState().calendarV2.filterParameter,
        view: store.getState().calendarV2.calendarInfo.selectedView,
      });
      store.dispatch(setSelectedEventV2(null));
    }
  } catch (error: any) {
    console.error('Error deleting event:', error);
    console.log(
      'Error deleting event:',
      JSON.stringify(error.response.data.error, null, 2),
    );
    showToast({message: error.response.data.error || 'Unable to delete'});
    throw error.response?.data || error;
  }
};

function filterByDateRange(
  startDate: string,
  endDate: string,
  events: IEventV2[],
) {
  // Validate inputs
  if (
    !moment.isMoment(moment(startDate)) ||
    !moment.isMoment(moment(endDate)) ||
    !Array.isArray(events)
  ) {
    return [];
  }

  // Convert input dates to Moment objects
  const start = moment(startDate);
  const end = moment(endDate);

  // Filter events where startTime is between startDate and endDate (inclusive)
  return events.filter(event => {
    if (event && event.startTime) {
      const eventTime = moment(event.startTime);
      return eventTime.isValid() && eventTime.isBetween(start, end, null, '[]');
    }
    return false;
  });
}

export const LoadUpcomingEvent = async (weekOffset: number) => {
  const from = moment().add(weekOffset, 'weeks').startOf('week').toISOString();
  const to = moment().add(weekOffset, 'weeks').endOf('week').toISOString();
  await axiosInstance
    .get('/v2/calendar/event/myevents', {
      params: {
        from,
        to,
      },
    })
    .then(res => {
      const e = filterByDateRange(from, to, res.data.events);
      store.dispatch(
        setWeeklyEvents(
          e.sort((a: any, b: any) => {
            const dateA = moment(a.startTime);
            const dateB = moment(b.startTime);
            return dateA.valueOf() - dateB.valueOf();
          }),
        ),
      );
    })
    .catch(error => {
      console.log(
        '/v2/calendar/event/myevents in Calendar Data 2',
        JSON.stringify(error.response.data.error, null, 2),
      );
      showToast({
        message: error.response.data.error || 'Unknown error',
        background: 'red',
      });
    });
};

export const handleUpdateEvent = async (eventId: string, body: any) => {
  try {
    const url = `/v2/calendar/event/update/${eventId}`;

    const response = await axiosInstance.patch(url, body);
    console.log('response.data', JSON.stringify(response.data, null, 2));
    if (response.data.success) {
      showToast({
        message: `${
          response.data.event.type === 'event' ? 'Event' : 'Task'
        } updated successfully`,
      });
      getCalendarEvents({
        offset:
          store.getState().calendarV2.calendarInfo.selectedView === 'day'
            ? store.getState().calendarV2.calendarInfo.dayOffset
            : store.getState().calendarV2.calendarInfo.selectedView === 'week'
            ? store.getState().calendarV2.calendarInfo.weekOffset
            : store.getState().calendarV2.calendarInfo.monthOffset,
        filterParameter: store.getState().calendarV2.filterParameter,
        view: store.getState().calendarV2.calendarInfo.selectedView,
      });
      LoadUpcomingEvent(0);
    }
  } catch (error: any) {
    console.error('Error update event:', error);
    console.log(
      'error to update event',
      JSON.stringify(error.response.data.error, null, 2),
    );
    showToast({message: error.response.data.error || 'Unable to update'});
    throw error.response?.data || error;
  }
};

export const loadInvitationsCount = async (f = '', t = '') => {
  try {
    const from = f || moment().startOf('month').toISOString();
    const to = t || moment().endOf('month').toISOString();
    const response = await axiosInstance.get(
      `/v2/calendar/event/myevents?from=${from}&to=${to}`,
    );

    if (response.data.success) {
      const pending = response.data.events.filter(
        (item: any) =>
          item?.myResponseStatus === 'needsAction' &&
          item?.organizer?._id !== store.getState().auth.user?._id,
      ).length;
      store.dispatch(setPendingInvitationCount(pending || 0));
    }
  } catch (error) {
    console.log('Error loading meetings:', JSON.stringify(error, null, 2));
  }
};

export const loadSingleChapter = async () => {
  const event = store.getState().calendarV2.selectedEventV2;
  try {
    const response = await axiosInstance.get(
      `/course/chapterv2/get-single/chapter/${event?.purpose?.resourceId}`,
    );
    if (response.data.success) {
      if (response.data.chapter.type === 'chapter') {
        const p = {
          category: event?.purpose?.category,
          resourceId: event?.purpose?.resourceId,
          name: response.data.chapter.chapter.name,
        };
        store.dispatch(setSelectedEventV2({...event, purpose: p} as IEventV2));
      } else {
        const p = {
          category: event?.purpose?.category,
          resourceId: event?.purpose?.resourceId,
          name: response.data.chapter.lesson.title,
        };
        store.dispatch(setSelectedEventV2({...event, purpose: p} as IEventV2));
      }
    }
  } catch (error) {
    console.log('Error to load single chapter:', error);
  }
};
export const loadSingleChapterForNotes = async () => {
  const note = store.getState().notes.selectedNote;
  try {
    const response = await axiosInstance.get(
      `/course/chapterv2/get-single/chapter/${note?.purpose?.resourceId}`,
    );
    if (response.data.success) {
      if (response.data.chapter.type === 'chapter') {
        const p = {
          category: note?.purpose?.category,
          resourceId: note?.purpose?.resourceId,
          name: response.data.chapter.chapter.name,
        };
        store.dispatch(selectNote({...note, purpose: p} as IEventV2));
      } else {
        const p = {
          category: note?.purpose?.category,
          resourceId: note?.purpose?.resourceId,
          name: response.data.chapter.lesson.title,
        };
        store.dispatch(selectNote({...note, purpose: p} as IEventV2));
      }
    }
  } catch (error) {
    console.log('Error to load single chapter:', error);
  }
};

export const loadBootcampProgress = async () => {
  try {
    const response = await axiosInstance.post('/dashboard/portal', {
      bootcamp: {},
    });
    if (response.data.success) {
      store.dispatch(setBootcampsData(response.data.data.bootcamp.results));
    }
  } catch (error: any) {
    console.log(
      'Error to load dashboard bootcamp data',
      JSON.stringify(error.response.data.error, null, 2),
    );
    showToast({message: error.response.data.error});
  }
};
