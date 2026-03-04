import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  allMessages: {},
};

const newChatSlice = createSlice({
  name: 'newChat',
  initialState,
  reducers: {
    setAllMessages: (state, {payload}) => {
      const {chatId, messages} = payload;

      const updatedAllMessages = {
        ...state.allMessages,
        [chatId]: [...(state.allMessages[chatId] || []), ...messages],
      };
      state.allMessages = updatedAllMessages;
    },
    addNewMessage: (state, {payload}) => {
      const {chatId, message} = payload;

      const updatedAllMessages = {
        ...state.allMessages,
        [chatId]: [message, ...(state.allMessages[chatId].slice(0, 15) || [])],
      };
      state.allMessages = updatedAllMessages;
    },
  },
});

export const {setAllMessages, addNewMessage} = newChatSlice.actions;

// Export the reducer
export default newChatSlice.reducer;
