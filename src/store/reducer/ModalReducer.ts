import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Alert {
  visible: boolean;
  data: any;
}

interface ModalState {
  selectedMessageScreen: string | null;
  isThreadOpen: boolean;
  params: Record<string, any>;
  alert: Alert;
  commentModalIndex: number;
  bottomSheetVisible: boolean;
  messageOptionData: any;
}

const initialState: ModalState = {
  selectedMessageScreen: null,
  isThreadOpen: false,
  params: {},
  alert: {visible: false, data: {}},
  commentModalIndex: -1,
  bottomSheetVisible: false,
  messageOptionData: null,
};

const modalSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setSelectedMessageScreen: (state, action: PayloadAction<string | null>) => {
      state.selectedMessageScreen = action.payload;
    },
    setThreadOpen: (state, action: PayloadAction<boolean>) => {
      state.isThreadOpen = action.payload;
    },
    setParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.params = action.payload;
    },
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload;
    },
    setCommentModalIndex: (state, action: PayloadAction<number>) => {
      state.commentModalIndex = action.payload;
    },
    setBottomSheetVisible: (state, action: PayloadAction<boolean>) => {
      state.bottomSheetVisible = action.payload;
    },
    setMessageOptionData: (state, action: PayloadAction<any>) => {
      state.messageOptionData = action.payload;
    },
  },
});

export const {
  setMessageOptionData,
  setSelectedMessageScreen,
  setThreadOpen,
  setParams,
  setAlert,
  setCommentModalIndex,
  setBottomSheetVisible,
} = modalSlice.actions;

export default modalSlice.reducer;
