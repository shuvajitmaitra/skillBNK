import {showToast} from '../components/HelperFunction';
import {Meeting} from '../screens/NewCalendar/CalendarInvitationsV2';
import axiosInstance from '../utility/axiosInstance';

export const calendarService = {
  handleMeetingStatus: async (
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
        // loadInvitations(date.from, date.to);
        showToast({
          message: `Event ${responseStatus}`,
        });
      }
    } catch (error: any) {
      showToast({message: error.response.data.error});
      console.log(
        'Error loading meetings:',
        JSON.stringify(error.response.data.error, null, 2),
      );
    }
  },
  updateArrayOfObjects: (array: Meeting[], newObject: any, id: string) => {
    const index = array.findIndex(item => item._id === id);
    console.log('index', JSON.stringify(index, null, 2));
    if (index !== -1) {
      let a = [...array];
      a[index] = {...a[index], ...newObject};
      console.log('a', JSON.stringify(a, null, 2));
      return a;
    }
    return array;
  },
};
