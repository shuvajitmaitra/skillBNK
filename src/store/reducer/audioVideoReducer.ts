import {createSlice} from '@reduxjs/toolkit';
import {TMediaItem} from '../../types';
type TAudioVideoProps = {
  medias: TMediaItem[];
};
const initialState: TAudioVideoProps = {
  medias: [],
};

const mediaSlice = createSlice({
  name: 'medias',
  initialState,
  reducers: {
    setMedias: (state, action) => {
      state.medias = action.payload;
    },
  },
});

export const {setMedias} = mediaSlice.actions;

// Export the reducer
export default mediaSlice.reducer;
