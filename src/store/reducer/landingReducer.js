import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageInformation: {},
  bootCampInformation: {},
  courseInformation: {},
  totalCourse: 0,
  totalBootCamp: 0,
  bootCampDetails: {},
};

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    setPageInformation: (state, { payload }) => {
      state.pageInformation = payload;
    },
    setBootCampInformation: (state, { payload }) => {
      state.bootCampInformation = payload;
    },
    setCourseInformation: (state, { payload }) => {
      state.courseInformation = payload;
    },
    setTotalCourse: (state, { payload }) => {
      state.totalCourse = payload;
    },
    setTotalBootCamp: (state, { payload }) => {
      state.totalBootCamp = payload;
    },
    setBootCampDetails: (state, { payload }) => {
      state.bootCampDetails = payload;
    },
  },
});

export const {
  setPageInformation,
  setBootCampInformation,
  setCourseInformation,
  setTotalCourse,
  setTotalBootCamp,
  setBootCampDetails,
} = landingSlice.actions;

// Export the reducer
export default landingSlice.reducer;
