// interviewSlice.ts
import {createSlice} from '@reduxjs/toolkit';
import {Submission, TConversation, TInterview} from '../../types';
type stateProps = {
  interviews: TInterview[];
  singleInterview: {
    success: boolean;
    interview: TInterview;
    submission: Submission;
    conversations: TConversation[];
  } | null;
};
const initialState: stateProps = {
  interviews: [],
  singleInterview: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    setSingleInterview: (state, action) => {
      state.singleInterview = action.payload;
    },
    updateInterviewAnswer: (state, {payload}) => {
      const {answer, interviewId} = payload;

      const interviewIndex = state.interviews.findIndex(
        item => item._id === interviewId,
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].submission = [
          ...state.interviews[interviewIndex].submission,
          answer,
        ];
      }
    },
    updateInterviewComments: (state, {payload}) => {
      const {comments, interviewId} = payload;

      const interviewIndex = state.interviews.findIndex(
        item => item._id === interviewId,
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].submission[0].comments = comments;
      }
    },
  },
});

export const {
  setSingleInterview,
  setInterviews,
  updateInterviewAnswer,
  updateInterviewComments,
} = interviewSlice.actions;

export default interviewSlice.reducer;
