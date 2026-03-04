import {showToast} from '../components/HelperFunction';
import store from '../store';
import {updateCMedia} from '../store/reducer/chatSlice';
import {TMediaQuery} from '../types/chat/chatTypes';
import axiosInstance from '../utility/axiosInstance';
// import {loadChats} from './chat-noti';

export const handleForwardMessage = (chatId: string, chatIds: string[]) => {
  try {
    axiosInstance
      .post(`/chat/message/forward/${chatId}`, {
        chatIds: chatIds,
      })
      .then(res => {
        if (res.data.success) {
          // loadChats();
          showToast({
            message: 'Message forwarded',
          });
        }
      })
      .catch(error => {
        console.log(
          'error to forward message',
          JSON.stringify(error.response.data.error, null, 2),
        );
      });
  } catch (error: any) {
    console.log('Error to forward message:', error);
    // console.log(
    //   'error to forward message',
    //   JSON.stringify(error?.response?.data?.error, null, 2),
    // );
    // showToast({
    //   message: error?.response?.data?.error || 'Forward failed',
    //   color: 'red',
    // });
  }
};

export const loadChatMedia = async (info: TMediaQuery): Promise<void> => {
  try {
    if (!info.chatId || !info.tab) {
      throw new Error('Missing required fields: chatId and tab are required');
    }
    const response = await axiosInstance.get<any>(
      `/chat/media/${info.chatId}`,
      {
        params: {
          page: info.page || 1,
          query: info.query || '',
          limit: info.limit || 10,
          type: info.type || '',
        },
      },
    );

    // Validate response data
    const {data} = response;
    if (!data || !Array.isArray(data.medias)) {
      throw new Error(
        'Invalid API response: medias array is missing or invalid',
      );
    }

    // Dispatch to updateCMedia with normalized payload
    store.dispatch(
      updateCMedia({
        ...info,
        tab: info.tab,
        page: info.page || 1,
        medias: data.medias, // Ensure medias is always an array
        total: data.total || 0, // Provide default for total if missing
        ...data, // Spread additional fields from response
      }),
    );
  } catch (error: any) {
    // Improved error handling
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to load chat media';

    console.error('Error loading chat media:', JSON.stringify(error, null, 2));

    showToast({
      message: errorMessage,
      background: 'red',
    });

    throw new Error(errorMessage); // Throw a normalized error for the caller
  }
};
