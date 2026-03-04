import {createSlice} from '@reduxjs/toolkit';
import {INote} from '../../types';
type TNotesProps = {
  notes: INote[];
  selectedNote: INote | null;
};

const initialState: TNotesProps = {
  notes: [],
  selectedNote: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    selectNote: (state, action) => {
      if (action.payload === null) {
        state.selectedNote = null;

        return;
      }
      state.selectedNote = {...(state.selectedNote || {}), ...action.payload};
    },
  },
});

export const {setNotes, selectNote} = notesSlice.actions;

// Export the reducer
export default notesSlice.reducer;
