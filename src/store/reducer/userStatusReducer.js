import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: 'online',
};

const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState,
  reducers: {
    setUserStatus: (state, {payload}) => {
      state.status = payload;
    },
  },
});

export const {setUserStatus} = userStatusSlice.actions;

// Export the reducer
export default userStatusSlice.reducer;
