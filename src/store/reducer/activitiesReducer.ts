import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TActivities} from '../../types';

interface ActivitiesState {
  activities: TActivities[];
  activitiesCount: number;
}

interface InitialActivitiesPayload {
  data: TActivities[];
  page: number;
}

const initialState: ActivitiesState = {
  activities: [],
  activitiesCount: 0,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    initialActivities: (
      state,
      action: PayloadAction<InitialActivitiesPayload>,
    ) => {
      const {data, page} = action.payload;
      if (page === 1) {
        state.activities = data;
      } else {
        state.activities = [...state.activities, ...data];
      }
    },
    setActivitiesCount: (state, action: PayloadAction<number>) => {
      state.activitiesCount = action.payload;
    },
  },
});

export const {initialActivities, setActivitiesCount} = activitiesSlice.actions;
export default activitiesSlice.reducer;
