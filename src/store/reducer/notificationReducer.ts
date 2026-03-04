import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TNotification} from '../../screens/NotificationScreen';

interface NotificationCount {
  totalUnread: number;
  // Additional properties can be added as needed
  [key: string]: any;
}

interface NotificationState {
  notifications: TNotification[];
  notificationCount: NotificationCount;
}

const initialState: NotificationState = {
  notifications: [],
  notificationCount: {
    totalUnread: 0,
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<TNotification[]>) => {
      state.notifications = action.payload;
    },
    setNotificationCount: (state, action: PayloadAction<NotificationCount>) => {
      state.notificationCount = action.payload;
    },
    newNotification: (state, action: PayloadAction<TNotification>) => {
      state.notifications.unshift(action.payload);
      state.notificationCount = {
        ...state.notificationCount,
        totalUnread: state.notificationCount.totalUnread + 1,
      };
    },
    updateNotification: (state, action: PayloadAction<{_id: string}>) => {
      const index = state.notifications.findIndex(
        n => n._id === action.payload._id,
      );
      if (index !== -1) {
        state.notifications[index].opened = true;
      }
    },
  },
});

export const {
  setNotifications,
  newNotification,
  updateNotification,
  setNotificationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
