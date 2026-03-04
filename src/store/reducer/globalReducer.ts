import {createSlice} from '@reduxjs/toolkit';

type TInitialState = {
  confirmModalInfo: {
    isConfirmModalVisible: boolean;
    modalTitle?: string;
    modalMessage?: string;
    onConfirmCallback: (() => void) | null;
    type: 'delete' | 'info';
  };
};

const initialState: TInitialState = {
  confirmModalInfo: {
    isConfirmModalVisible: false,
    modalTitle: '',
    modalMessage: '',
    onConfirmCallback: null,
    type: 'delete',
  },
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showConfirmationModal: (state, {payload}) => {
      state.confirmModalInfo.isConfirmModalVisible = true;
      state.confirmModalInfo.modalTitle = payload.title || 'Confirm Action';
      state.confirmModalInfo.modalMessage = payload.message || 'Are you sure?';
      state.confirmModalInfo.onConfirmCallback = payload.onConfirm;
      state.confirmModalInfo.type = payload.type;
    },
    hideConfirmationModal: state => {
      state.confirmModalInfo.isConfirmModalVisible = false;
      state.confirmModalInfo.modalTitle = '';
      state.confirmModalInfo.modalMessage = '';
      state.confirmModalInfo.onConfirmCallback = null;
      state.confirmModalInfo.type = 'delete';
    },
  },
});

export const {showConfirmationModal, hideConfirmationModal} =
  globalSlice.actions;

export default globalSlice.reducer;
