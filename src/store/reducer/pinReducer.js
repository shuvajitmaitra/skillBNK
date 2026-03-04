import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  pin: false,
};

const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    isPinned: (state, action) => {
      state.pin = action.payload;
    },
  },
});

export const {isPinned} = pinSlice.actions;

// Export the reducer
export default pinSlice.reducer;
