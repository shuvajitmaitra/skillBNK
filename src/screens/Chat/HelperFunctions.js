import axios from '../../utility/axiosInstance';
import {updateChatMessages} from '../../store/reducer/chatReducer';

export function truncateString(text, num) {
  let str = text.replace(/<[^>]*>?/gm, '').trim();
  if (str?.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

export const messageTimeFormate = time => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let formattedHours = hours % 12 || 12;
  const period = hours < 12 ? 'AM' : 'PM';

  // Add leading zeros to minutes if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');

  const formattedTime = `${formattedHours}.${formattedMinutes} ${period}`;
  return formattedTime;
};

export const fetchMessages = ({options}) => {
  return async dispatch => {
    try {
      let res = await axios.post('/chat/messages', options);

      dispatch(
        updateChatMessages({
          chat: res.data?.chat?._id,
          messages: res.data.messages,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };
};
