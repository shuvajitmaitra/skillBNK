import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import moment from 'moment';
import {TChat} from '../../types/chat/chatTypes';

// Define interfaces for Chat, Message, and GroupName (adjust as needed)
interface Chat {
  _id: string;
  latestMessage?: {
    createdAt: string;
    [key: string]: any;
  };
  membersCount?: number;
  typingData?: any;
  myData?: {[key: string]: any};
  unreadCount?: number | null;
  isArchived?: boolean;
  lastSync?: string;
  [key: string]: any;
}

interface Message {
  _id: string;
  chat: string;
  parentMessage?: string;
  replies?: Message[];
  replyCount?: number;
  [key: string]: any;
}

interface GroupName {
  data: string;
  type: string;
}

// Define the slice state interface
interface ChatState {
  chats: TChat[];
  chatsObj: Record<string, Chat>;
  onlineUsers: any[]; // Adjust with your proper user type if available
  chatMessages: Record<string, Message[]>;
  bots: any[];
  displayMode: string;
  pinned: any[];
  chat: any;
  groupNameId: GroupName[];
  singleMessage: any;
  playingAudio: any;
  socketStatus: boolean;
  messages: Message[];
  singleChat: any;
  onlineUsersObj: Record<string, any>;
  offlineUsersObj: Record<string, any>;
  archivedChats: TChat[];
}

// Helper function with TS types
function sortByLatestMessage(data: Message[] = []): Message[] {
  return data.slice().sort((a, b) => {
    const dateA =
      a?.latestMessage && a.latestMessage.createdAt
        ? new Date(a.latestMessage.createdAt)
        : new Date(0);
    const dateB =
      b?.latestMessage && b.latestMessage.createdAt
        ? new Date(b.latestMessage.createdAt)
        : new Date(0);

    return dateB.getTime() - dateA.getTime(); // For descending order
  });
}

// Define the initial state with type annotation
const initialState: ChatState = {
  chats: [],
  archivedChats: [],
  chatsObj: {},
  onlineUsers: [],
  chatMessages: {},
  bots: [],
  displayMode: 'default',
  pinned: [],
  chat: {},
  groupNameId: [],
  singleMessage: {},
  playingAudio: null,
  socketStatus: false,
  messages: [],
  singleChat: {},
  onlineUsersObj: {},
  offlineUsersObj: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setArchivedChats: (
      state,
      {payload}: PayloadAction<{action: 'add' | 'update'; chats: TChat[]}>,
    ) => {
      const {action, chats} = payload;

      if (action === 'add') {
        state.archivedChats = chats;
      }
      if (action === 'update') {
        state.archivedChats = [...chats, ...state.archivedChats];
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setNewMessages: (state, action: PayloadAction<Message>) => {
      if (state.messages.length > 0) {
        const oldId = state.messages[0].chat || '';
        const newId = action.payload.chat;
        const old = state.messages[0]._id;
        const n = action.payload._id;
        if (oldId === newId && old !== n) {
          state.messages = [action.payload, ...state.messages];
        }
      }
    },
    setSocketStatus: (state, action: PayloadAction<boolean>) => {
      state.socketStatus = action.payload;
    },
    setPlayingAudio: (state, action: PayloadAction<any>) => {
      state.playingAudio = action.payload;
    },
    clearPlayingAudio: state => {
      state.playingAudio = null;
    },
    updateMembersCount: (
      state,
      action: PayloadAction<{_id: string; membersCount: number}>,
    ) => {
      const {_id, membersCount} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === _id);
      if (chatIndex !== -1) {
        state.chats[chatIndex].membersCount = membersCount;
      } else {
        console.log('it is -1');
      }
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      state.chat = action.payload;
    },
    setPinned: (state, action: PayloadAction<any[]>) => {
      state.pinned = action.payload;
    },
    setDisplayMode: (state, action: PayloadAction<string>) => {
      state.displayMode = action.payload;
    },
    setGroupNameId: (state, action: PayloadAction<Chat[]>) => {
      const result = action.payload.reduce<Record<string, Chat>>((acc, obj) => {
        acc[obj._id] = obj;
        return acc;
      }, {});
      state.chatsObj = result;
      const filteredChats =
        action.payload.filter(c => c.isChannel === true && c.name) || [];

      const groupNameId: GroupName[] = filteredChats.map(item => ({
        data: item._id,
        type: item.name,
      }));
      state.groupNameId = groupNameId;
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload as TChat[];
    },
    setBots: (state, action: PayloadAction<any[]>) => {
      state.bots = action.payload;
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(x => x?._id !== action.payload);
    },
    updateChats: (state, action: PayloadAction<Chat>) => {
      state.chats = updateArray(state.chats, action.payload as TChat);
    },
    setTyping: (
      state,
      action: PayloadAction<{chatId: string; typingData: any}>,
    ) => {
      const {chatId, typingData} = action.payload;
      const typingChatIndex = state.chats.findIndex(x => x?._id === chatId);
      if (typingChatIndex !== -1) {
        state.chats[typingChatIndex].typingData = typingData;
      }
    },
    updateMyData: (
      state,
      action: PayloadAction<{_id: string; field: string; value: any}>,
    ) => {
      const {_id, field, value} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === _id);
      if (chatIndex !== -1) {
        state.chats[chatIndex].myData = {
          ...state.chats[chatIndex].myData,
          [field]: value,
        };
      } else {
        console.log('it is -1');
      }
    },
    updateLatestMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        latestMessage: Partial<Message>;
        counter?: string | number;
      }>,
    ) => {
      const {chatId, latestMessage, counter} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].latestMessage = {
          ...(state.chats[chatIndex].latestMessage || {}),
          ...latestMessage,
        };
        state.chats[chatIndex].unreadCount = counter
          ? parseInt(String(state.chats[chatIndex].unreadCount), 10) +
            parseInt(String(counter), 10)
          : null;
      }
    },
    markRead: (state, action: PayloadAction<{chatId: string}>) => {
      const {chatId} = action.payload;
      const chatIndex = state.chats.findIndex(x => x?._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    setOnlineUsers: (state, action: PayloadAction<any[]>) => {
      state.onlineUsers = action.payload;
      state.onlineUsersObj = action.payload.reduce<Record<string, any>>(
        (acc, user) => {
          acc[user._id] = user;
          return acc;
        },
        {},
      );
    },
    addOnlineUser: (state, action: PayloadAction<any>) => {
      state.onlineUsers = addToArray(state.onlineUsers, action.payload);
      if (!state.onlineUsersObj[action.payload._id]) {
        delete state.offlineUsersObj[action.payload._id];
        state.onlineUsersObj = {
          ...state.onlineUsersObj,
          [action.payload._id]: action.payload,
        };
      }
    },
    removeOnlineUser: (state, action: PayloadAction<any>) => {
      state.onlineUsers = removeFromArray(
        state.onlineUsers,
        action.payload,
        '_id',
      );
      state.onlineUsers = state.onlineUsers.filter(
        user => user._id !== action.payload._id,
      );
      if (state.onlineUsersObj[action.payload._id]) {
        delete state.onlineUsersObj[action.payload._id];
        state.offlineUsersObj = {
          ...state.offlineUsersObj,
          [action.payload._id]: {
            ...action.payload,
            offlineAt: new Date().toISOString(),
          },
        };
      }
    },
    updateChatMessages: (
      state,
      action: PayloadAction<{chat: string; messages: Message[]}>,
    ) => {
      const {chat, messages} = action.payload;
      state.chatMessages[chat] = messages;
      // Optionally set last sync time in chats here
    },
    syncMessage: (
      state,
      action: PayloadAction<{
        chat: string;
        messages: Message[];
        lastSync?: string;
      }>,
    ) => {
      const {chat, messages, lastSync} = action.payload;
      let updatedChatMessages = [...(state.chatMessages[chat] || [])];

      messages.forEach(msg => {
        const index = updatedChatMessages.findIndex(x => x?._id === msg._id);
        if (index !== -1) {
          // Replace the existing message by creating a new object
          updatedChatMessages[index] = {
            ...updatedChatMessages[index],
            ...msg,
          };
        } else {
          // Concatenate the new message to avoid direct mutation
          updatedChatMessages = updatedChatMessages.concat(msg);
        }
      });

      // Sort messages
      updatedChatMessages = sortByLatestMessage(updatedChatMessages);

      // Return new state
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [chat]: updatedChatMessages,
        },
        chats: state.chats.map(c =>
          c._id === chat
            ? {
                ...c,
                lastSync: lastSync || moment().toISOString(),
              }
            : c,
        ),
      };
    },
    pushHistoryMessages: (
      state,
      action: PayloadAction<{chat: string; messages: Message[]}>,
    ) => {
      const {chat, messages} = action.payload;
      let messagesArray = state.chatMessages[chat] || [];
      messagesArray = [...messages, ...messagesArray];
      state.chatMessages[chat] = messagesArray;
    },
    pushMessage: (state, action: PayloadAction<{message: Message}>) => {
      const {message} = action.payload;
      const chatId = message.chat;
      let messagesArray = state.chatMessages[chatId] || [];

      if (message.parentMessage) {
        const parentMessageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );
        if (parentMessageIndex !== -1) {
          messagesArray[parentMessageIndex].replies =
            messagesArray[parentMessageIndex].replies || [];
          messagesArray[parentMessageIndex].replies?.push(message);
          messagesArray[parentMessageIndex] = {
            ...messagesArray[parentMessageIndex],
            replyCount: (messagesArray[parentMessageIndex].replyCount || 0) + 1,
          };
        }
      } else {
        const existingMessageIndex = messagesArray.findIndex(
          m => m?._id === message._id,
        );
        if (existingMessageIndex !== -1) {
          messagesArray[existingMessageIndex] = {
            ...messagesArray[existingMessageIndex],
            ...message,
          };
        } else {
          messagesArray.push(message);
          messagesArray = messagesArray.slice(
            Math.max(messagesArray.length - 20, 0),
            messagesArray.length,
          );
        }
      }
      state.chatMessages[chatId] = messagesArray;
    },
    updateMessage: (state, action: PayloadAction<{message: Message}>) => {
      const {message} = action.payload;
      const chatId = message.chat;
      const messagesArray = state.chatMessages[chatId] || [];

      if (message.parentMessage) {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );
        if (messageIndex !== -1) {
          let replies = messagesArray[messageIndex].replies || [];
          let replyIndex = replies.findIndex(x => x?._id === message._id);
          if (replyIndex !== -1) {
            replies[replyIndex] = {...replies[replyIndex], ...message};
          }
          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            replies,
          };
        }
      } else {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message._id,
        );
        if (messageIndex !== -1) {
          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            ...message,
          };
        }
      }
      state.chatMessages[chatId] = messagesArray;
    },
    updateSendingInfo: (
      state,
      action: PayloadAction<{message: Message; trackingId: string}>,
    ) => {
      const {message, trackingId} = action.payload;
      const chatId = message.chat;
      let messagesArray = [...(state.chatMessages[chatId] || [])];

      if (message.parentMessage) {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === message.parentMessage,
        );
        let replies = [...(messagesArray[messageIndex]?.replies || [])];
        let replyIndex = replies.findIndex(m => m?._id === trackingId);
        if (replyIndex !== -1) {
          replies[replyIndex] = {
            ...replies[replyIndex],
            ...message,
          };
        }
        messagesArray[messageIndex] = {
          ...messagesArray[messageIndex],
          replies,
        };
      } else {
        const messageIndex = messagesArray.findIndex(
          m => m?._id === trackingId,
        );
        if (messageIndex !== -1) {
          messagesArray[messageIndex] = {
            ...messagesArray[messageIndex],
            ...message,
          };
        }
      }
      state.chatMessages[chatId] = messagesArray;
    },
    setSingleMessage: (state, action: PayloadAction<any>) => {
      state.singleMessage = action.payload;
    },
    setSingleChat: (state, action: PayloadAction<any>) => {
      // console.log('action.payload', JSON.stringify(action.payload, null, 2));
      state.singleChat = action.payload;
    },
    updateSingleChatMyData: (
      state,
      {payload}: PayloadAction<{field: string; value: any}>,
    ) => {
      state.singleChat = {
        ...state.singleChat,
        myData: {
          ...(state.singleChat?.myData || {}),
          [payload.field]: payload.value,
        },
      };
    },
    updateSingleChatMemberCount: (
      state,
      {payload}: PayloadAction<'remove' | any>,
    ) => {
      if (payload === 'remove') {
        state.singleChat = {
          ...state.singleChat,
          membersCount: (state.singleChat?.membersCount || 0) - 1,
        };
      } else {
        state.singleChat = {
          ...state.singleChat,
          membersCount: (state.singleChat?.membersCount || 0) + 1,
        };
      }
    },
    updateFavoriteSingleChat: (
      state,
      {payload}: PayloadAction<{isFavourite: boolean}>,
    ) => {
      state.singleChat = {
        ...state.singleChat,
        myData: {
          ...(state.singleChat?.myData || {}),
          isFavourite: payload.isFavourite,
        },
      };
    },
    updateSingleChatArchive: (state, {payload}: PayloadAction<any>) => {
      state.singleChat = {
        ...state.singleChat,
        ...payload,
      };
    },
    updateChatsArchive: (
      state,
      {payload}: PayloadAction<{_id: string; field: string; value: any}>,
    ) => {
      const {_id, field, value} = payload;
      if (field === 'isArchived' && value === true) {
        const chatIndex = state.chats.findIndex(x => x?._id === _id);

        if (chatIndex !== -1) {
          state.archivedChats = [
            state.chats[chatIndex],
            ...state.archivedChats,
          ];
          state.chats.splice(chatIndex, 1);
        }
      }
      if (field === 'isArchived' && value === false) {
        const chatIndex = state.archivedChats.findIndex(x => x?._id === _id);
        if (chatIndex !== -1) {
          state.chats = [state.archivedChats[chatIndex], ...state.chats];
          state.archivedChats.splice(chatIndex, 1);
        }
      }

      // const chatIndex = state.chats.findIndex(x => x?._id === _id);
      // if (chatIndex !== -1 && field === 'isArchived') {
      //   state.chats[chatIndex] = {
      //     ...state.chats[chatIndex],
      //     isArchived: value,
      //   };
      // }
    },
    updateSingleChatProfile: (state, {payload}: PayloadAction<any>) => {
      state.singleChat = {
        ...state.singleChat,
        ...payload,
      };
    },
  },
});

// Export actions generated by createSlice
export const {
  setArchivedChats,
  updateSingleChatMyData,
  updateChatsArchive,
  updateSingleChatArchive,
  updateSingleChatProfile,
  updateSingleChatMemberCount,
  updateFavoriteSingleChat,
  setNewMessages,
  setSingleChat,
  setMessages,
  setSocketStatus,
  clearPlayingAudio,
  setPlayingAudio,
  setSingleMessage,
  setGroupNameId,
  updateChat,
  updateMembersCount,
  setPinned,
  setDisplayMode,
  setChats,
  setBots,
  removeChat,
  updateChats,
  setTyping,
  updateMyData,
  updateLatestMessage,
  markRead,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  updateChatMessages,
  pushMessage,
  updateMessage,
  updateSendingInfo,
  pushHistoryMessages,
  syncMessage,
} = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;

// Helper functions with generic types
const updateArray = <T extends {[key: string]: any}>(
  array: T[],
  item: T,
  key: string = '_id',
): T[] => {
  const index = array.findIndex(el => el[key] === item[key]);
  if (index === -1) {
    return [item, ...array];
  }
  const updatedArray = [...array];
  updatedArray[index] = {...updatedArray[index], ...item};
  return updatedArray;
};

const addToArray = <T extends {_id: string}>(array: T[], item: T): T[] => {
  if (!array.find(el => el._id === item._id)) {
    return [item, ...array];
  }
  return array;
};

const removeFromArray = <T extends {[key: string]: any}>(
  array: T[],
  item: T,
  key: string = '_id',
): T[] => {
  return array.filter(el => el[key] !== item[key]);
};
