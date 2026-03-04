import store from '../store';
import {setSingleInterview} from '../store/reducer/InterviewReducer';
import axiosInstance from '../utility/axiosInstance';

export const fetchSingleInterview = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `/interview/single-interview/${id}`,
    );
    if (response.data.success && response.data.interview?._id) {
      store.dispatch(setSingleInterview(response.data));
    }
  } catch (error: any) {
    console.error(
      'Fetch single interview failed:',
      error.response?.data || error.message,
    );
  }
};
