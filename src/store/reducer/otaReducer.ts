import {createSlice} from '@reduxjs/toolkit';
import {TUpdateInfo} from '../../types';
type TInitialState = {
  updateInfo: TUpdateInfo | null;
};
const initialState: TInitialState = {
  updateInfo: null,
};

const otaSlice = createSlice({
  name: 'ota',
  initialState,
  reducers: {
    setUpdateInfo: (state, {payload}) => {
      state.updateInfo = payload;
    },
  },
});

export const {setUpdateInfo} = otaSlice.actions;

// Export the reducer
export default otaSlice.reducer;
