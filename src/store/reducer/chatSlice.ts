import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IMessage} from '../../types/chat/messageTypes';
import {loadChatMedia} from '../../actions/chatApiCall';
import {TMediaQuery} from '../../types/chat/chatTypes';

interface CrowdMember {
  [key: string]: any;
}

interface ChatState {
  localMessages: IMessage[];
  crowdMembers: CrowdMember[];
  pinnedMessages: IMessage[];
  threadMessages: IMessage[];
  selectedMember: CrowdMember | null;
  NMData: any;
  selectedMessage: IMessage | null;
  forwardInfo: IMessage | null;
  chatMediaQuery: TMediaQuery | null;
  chatImagesInfo: any;
  chatFilesInfo: any;
  chatVoicesInfo: any;
  chatLinksInfo: any;
  chatMemberInfo: any;
  draftMessages: {[key: string]: string};
}
// draftMessages: {[key: string]: {text: string; files: TFile[]}} | {};

const initialState: ChatState = {
  localMessages: [],
  crowdMembers: [],
  pinnedMessages: [],
  threadMessages: [],
  selectedMember: null,
  NMData: null,
  selectedMessage: null,
  forwardInfo: null,
  chatMediaQuery: null,
  chatImagesInfo: null,
  chatFilesInfo: null,
  chatVoicesInfo: null,
  chatLinksInfo: null,
  chatMemberInfo: null,
  draftMessages: {},
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    updateMQ: (state, action: PayloadAction<any>) => {
      if (action.payload === null) {
        state.chatMediaQuery = null;
      } else {
        const pre = state.chatMediaQuery;
        state.chatMediaQuery = {...pre, ...action.payload};
        loadChatMedia(action.payload);
      }
    },
    setChatMemberInfo: (state, action: PayloadAction<any | null>) => {
      state.chatMemberInfo = action.payload;
    },
    updateDraftMessages: (state, action: PayloadAction<any | null>) => {
      const {chatId, text} = action.payload;
      state.draftMessages = {...(state.draftMessages || {}), [chatId]: text};
    },
    updateCMedia: (state, action: PayloadAction<any>) => {
      if (action.payload === null) {
        state.chatVoicesInfo = null;
        state.chatFilesInfo = null;
        state.chatImagesInfo = null;
        state.chatLinksInfo = null;
        return;
      }

      const {tab, page, medias = []} = action.payload;

      if (tab === 'image') {
        if (page === 1) {
          state.chatImagesInfo = {...action.payload, medias};
        } else {
          const preMedias = state.chatImagesInfo || {medias: []};
          state.chatImagesInfo = {
            ...preMedias,
            ...action.payload,
            medias: [...preMedias.medias, ...medias],
          };
        }
      } else if (tab === 'file') {
        if (page === 1) {
          state.chatFilesInfo = {...action.payload, medias};
        } else {
          const preMedias = state.chatFilesInfo || {medias: []};
          state.chatFilesInfo = {
            ...preMedias,
            ...action.payload,
            medias: [...preMedias.medias, ...medias],
          };
        }
      } else if (tab === 'voice') {
        if (page === 1) {
          state.chatVoicesInfo = {...action.payload, medias};
        } else {
          const preMedias = state.chatVoicesInfo || {medias: []};
          state.chatVoicesInfo = {
            ...preMedias,
            ...action.payload,
            medias: [...preMedias.medias, ...medias],
          };
        }
      } else if (tab === 'link') {
        if (page === 1) {
          state.chatLinksInfo = {...action.payload, medias};
        } else {
          const preMedias = state.chatLinksInfo || {medias: []};
          state.chatLinksInfo = {
            ...preMedias,
            ...action.payload,
            medias: [...preMedias.medias, ...medias],
          };
        }
      }
    },

    setForwardInfo: (state, action: PayloadAction<IMessage | null>) => {
      if (action.payload === null) {
        state.forwardInfo = null;
      } else {
        state.forwardInfo = {...action.payload!, ...state.forwardInfo};
      }
    },
    setSelectedMessage: (state, action: PayloadAction<IMessage | null>) => {
      state.selectedMessage = action.payload;
    },
    setLocalMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.localMessages = action.payload;
    },
    appendLocalMessage: (state, action: PayloadAction<IMessage>) => {
      // If no localMessages exist, simply add the new one.
      if (state.localMessages.length === 0) {
        state.localMessages = [action.payload];
        return;
      }
      // Ensure the incoming message belongs to the same chat as the first message.
      if (action.payload.chat !== state.localMessages[0].chat) {
        return;
      }
      // Avoid appending a duplicate message.
      if (action.payload._id === state.localMessages[0]._id) {
        return;
      }
      state.localMessages = [action.payload, ...state.localMessages];
    },
    setCrowdMembers: (state, action: PayloadAction<CrowdMember[]>) => {
      state.crowdMembers = action.payload;
    },
    updateCrowdMembers: (state, action: PayloadAction<CrowdMember>) => {
      state.crowdMembers = [action.payload, ...state.crowdMembers];
    },
    setSelectedMembers: (state, action: PayloadAction<CrowdMember>) => {
      state.selectedMember = action.payload;
    },
    setPinnedMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.pinnedMessages = action.payload;
    },
    updatePinnedMessage: (state, action: PayloadAction<IMessage>) => {
      const messageIndex = state.localMessages.findIndex(
        item => item._id === action.payload._id,
      );
      if (messageIndex !== -1) {
        state.localMessages[messageIndex] = {
          ...state.localMessages[messageIndex],
          ...action.payload,
        };
      }
    },
    updateDeletedMessage: (state, action: PayloadAction<IMessage>) => {
      const messageIndex = state.localMessages.findIndex(
        item => item._id === action.payload._id,
      );
      if (messageIndex !== -1) {
        state.localMessages[messageIndex] = {
          ...state.localMessages[messageIndex],
          ...action.payload,
        };
      }
    },
    updateMessage: (state, action: PayloadAction<IMessage>) => {
      const messageIndex = state.localMessages.findIndex(
        item => item._id === action.payload._id,
      );
      if (messageIndex !== -1) {
        state.localMessages[messageIndex] = {
          ...state.localMessages[messageIndex],
          ...action.payload,
        };
      }
    },
    setThreadMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.threadMessages = action.payload;
    },
    addThreadMessages: (state, action: PayloadAction<IMessage>) => {
      // If there are no thread messages yet, add the new one.
      if (state.threadMessages.length === 0) {
        state.threadMessages = [action.payload];
        return;
      }
      // Ensure the incoming message belongs to the same chat as the first thread message.
      if (action.payload.chat !== state.threadMessages[0].chat) {
        return;
      }
      state.threadMessages = [action.payload, ...state.threadMessages];
    },
    updateThreadMessage: (state, action: PayloadAction<IMessage>) => {
      const messageIndex = state.threadMessages.findIndex(
        item => item._id === action.payload._id,
      );
      if (messageIndex !== -1) {
        state.threadMessages[messageIndex] = {
          ...state.threadMessages[messageIndex],
          ...action.payload,
        };
      }
    },
    updateRepliesCount: (state, action: PayloadAction<string>) => {
      const messageIndex = state.localMessages.findIndex(
        item => item._id === action.payload,
      );
      if (messageIndex !== -1) {
        const currentCount = state.localMessages[messageIndex].replyCount || 0;
        state.localMessages[messageIndex] = {
          ...state.localMessages[messageIndex],
          replyCount: currentCount + 1,
        };
      }
    },
    updateEmoji: (state, action: PayloadAction<IMessage>) => {
      // console.log('action.payload', JSON.stringify(action.payload, null, 2));
      if (action.payload.parentMessage) {
        const messageIndex = state.threadMessages.findIndex(
          item => item._id === action.payload._id,
        );
        if (messageIndex !== -1) {
          state.threadMessages[messageIndex] = {
            ...state.threadMessages[messageIndex],
            ...action.payload,
          };
        }
      }
      const messageIndex = state.localMessages.findIndex(
        item => item._id === action.payload._id,
      );
      if (messageIndex !== -1) {
        state.localMessages[messageIndex] = {
          ...state.localMessages[messageIndex],
          ...action.payload,
        };
      }
    },
    setNMData: (state, action: PayloadAction<any>) => {
      state.NMData = action.payload;
    },
  },
});

export const {
  updateDraftMessages,
  updateCMedia,
  updateMQ,
  setSelectedMessage,
  setNMData,
  updateCrowdMembers,
  updateThreadMessage,
  setSelectedMembers,
  updateEmoji,
  updateRepliesCount,
  setThreadMessages,
  addThreadMessages,
  updateMessage,
  updateDeletedMessage,
  setLocalMessages,
  appendLocalMessage,
  setCrowdMembers,
  setPinnedMessages,
  updatePinnedMessage,
  setForwardInfo,
  setChatMemberInfo,
} = chatSlice.actions;

export default chatSlice.reducer;
