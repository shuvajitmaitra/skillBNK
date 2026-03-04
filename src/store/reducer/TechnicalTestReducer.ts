// TechnicalTestReducer.js
import {createSlice} from '@reduxjs/toolkit';

interface IAssignment {
  id: number | string;
  question?: string;
  category?: string;
  workshop?: string;
  dueDate?: string;
  mark?: number;
  submission?: {
    status?: string;
    mark?: number;
  };
}

type technicalTestProps = {
  assignments: IAssignment[];
  totalTestCount: number | null;
  currentPage: number;
  isLoading: boolean;
  hasMoreData: boolean;
  testStats: {
    completionRate: number;
    totalAnswers: number;
    totalQuestions: number;
    totalTechnicalAssignments: number;
    totalTechnicalQuestions: number;
    totalTechnicalTasks: number;
  };
};

const initialState: technicalTestProps = {
  assignments: [],
  totalTestCount: null,
  currentPage: 1,
  isLoading: false,
  hasMoreData: true,
  testStats: {
    completionRate: 0,
    totalAnswers: 0,
    totalQuestions: 0,
    totalTechnicalAssignments: 0,
    totalTechnicalQuestions: 0,
    totalTechnicalTasks: 0,
  },
};

const technicalTestSlice = createSlice({
  name: 'technicalTest',
  initialState,
  reducers: {
    setTechnicalTest: (state, action) => {
      const {assignments, data} = action.payload;
      // First page load - replace data
      if (data && data.page === 1) {
        state.assignments = assignments;
      }
      // Pagination - append data
      else if (data && data.page > 1) {
        state.assignments = [...state.assignments, ...assignments];
      }
      // When no data parameter - just replace assignments
      else {
        state.assignments = assignments;
      }

      // Check if we've reached the end
      if (
        assignments.length === 0 ||
        (state.totalTestCount &&
          state.assignments.length >= state.totalTestCount)
      ) {
        state.hasMoreData = false;
      } else {
        state.currentPage = state.currentPage + 1;
      }
    },
    setTotalTestCount: (state, action) => {
      state.totalTestCount = action.payload;
      // Update hasMoreData based on total count
      state.hasMoreData = state.assignments.length < action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTestStats: (state, action) => {
      state.testStats = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetPagination: state => {
      state.currentPage = 1;
      state.hasMoreData = true;
    },
    submitAssignments: (state, action) => {
      const {answer, questionNumber} = action.payload;
      state.assignments[questionNumber].submission = answer;
    },
  },
});

export const {
  setTestStats,
  setTechnicalTest,
  submitAssignments,
  setTotalTestCount,
  setCurrentPage,
  setLoading,
  resetPagination,
} = technicalTestSlice.actions;

// Export the reducer
export default technicalTestSlice.reducer;
