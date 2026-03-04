import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  showNTell: [],
};

const showNTellSlice = createSlice({
  name: 'showNTell',
  initialState,
  reducers: {
    setShowNTell: (state, action) => {
      state.showNTell = action.payload;
    },

    setAddShowNTell: (state, action) => {
      state.showNTell = [action.payload, ...state.showNTell] || [];
    },
    setUpdateShowNTell: (state, action) => {
      const sntIndex = state.showNTell.findIndex(
        item => item._id === action.payload._id,
      );

      if (sntIndex !== -1) {
        state.showNTell[sntIndex] = action.payload;
      }
    },
  },
});

export const {setShowNTell, setAddShowNTell, setUpdateShowNTell} =
  showNTellSlice.actions;

// Export the reducer
export default showNTellSlice.reducer;
