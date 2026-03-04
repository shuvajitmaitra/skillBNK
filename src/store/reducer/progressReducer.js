import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  progress: [],
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const {setProgress} = progressSlice.actions;

// Export the reducer
export default progressSlice.reducer;
