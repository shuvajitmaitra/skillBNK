import {createSlice} from '@reduxjs/toolkit';
import {TFile} from '../../types/chat/messageTypes';

type TInitialState = {
  chatFooterInfo: {
    inputOptionModal: boolean;
    text: string;
    files: TFile[];
    audioRecordModal: boolean;
    isUploading: boolean;
  } | null;
};

const initialState: TInitialState = {
  chatFooterInfo: {
    inputOptionModal: false,
    text: '',
    files: [],
    audioRecordModal: false,
    isUploading: false,
  },
};

const chatFooterSlice = createSlice({
  name: 'chatFooter',
  initialState,
  reducers: {
    setChatFooterInfo: (state, {payload}) => {
      state.chatFooterInfo = payload;
    },
    updateChatFooterInfo: (state, {payload}) => {
      const pre = {...state.chatFooterInfo};
      state.chatFooterInfo = {...pre, ...payload};
    },
  },
});

export const {updateChatFooterInfo, setChatFooterInfo} =
  chatFooterSlice.actions;

export default chatFooterSlice.reducer;
