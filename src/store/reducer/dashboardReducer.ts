import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  dashboardData: {},
  pieData: [],
  progressData: [],
  calendar: {},
  mockInterview: {},
  bootcamp: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.bootcamp = action.payload.bootcamp.results;
      state.dashboardData = action.payload;
    },
    setPieData: (state, action) => {
      state.pieData = action.payload;
    },
    setProgressData: (state, action) => {
      state.progressData = action.payload;
    },
    setCalendar: (state, action) => {
      state.calendar = action.payload;
    },
    setMockInterview: (state, action) => {
      console.log(
        'Mock interview data',
        JSON.stringify(action.payload, null, 2),
      );
      state.mockInterview = action.payload;
    },
    setBootcampsData: (state, action) => {
      state.bootcamp = action.payload;
    },
  },
});

export const {
  setBootcampsData,
  setDashboardData,
  setPieData,
  setProgressData,
  setCalendar,
  setMockInterview,
} = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
