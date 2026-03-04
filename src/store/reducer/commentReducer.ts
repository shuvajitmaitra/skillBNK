import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TComment} from '../../types';

interface CommentState {
  comments: TComment[];
  selectedComment: TComment | null;
  commentId: string;
  singleComment: TComment | null;
}

interface UpdateCommentPayload {
  commentId: string;
  data: Partial<TComment>;
}

interface DeleteCommentPayload {
  _id: string;
  parentId?: string;
}

interface AddRepliesPayload extends TComment {
  parentId: string;
}

const initialState: CommentState = {
  comments: [],
  selectedComment: null,
  commentId: '',
  singleComment: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<TComment[]>) => {
      state.comments = action.payload;
    },
    addComment: (state, action: PayloadAction<TComment>) => {
      state.comments = [action.payload, ...state.comments];
    },
    addReplies: (state, action: PayloadAction<AddRepliesPayload>) => {
      const {parentId} = action.payload;
      const commentIndex = state.comments.findIndex(
        comment => comment._id === parentId,
      );
      if (commentIndex !== -1) {
        // Use nullish coalescing to ensure replies is an array
        const currentReplies = state.comments[commentIndex].replies ?? [];
        state.comments[commentIndex].replies = [
          action.payload,
          ...currentReplies,
        ];
      }
    },
    setSelectedComment: (state, action: PayloadAction<TComment | null>) => {
      state.selectedComment = action.payload;
    },
    setCommentId: (state, action: PayloadAction<string>) => {
      state.commentId = action.payload;
    },
    updateComment: (state, action: PayloadAction<UpdateCommentPayload>) => {
      const {commentId, data} = action.payload;
      if (data.parentId) {
        const parentIndex = state.comments.findIndex(
          comment => comment._id === data.parentId,
        );
        if (parentIndex !== -1 && state.comments[parentIndex].replies) {
          const replyIndex = state.comments[parentIndex].replies.findIndex(
            reply => reply._id === data._id,
          );
          if (replyIndex !== -1) {
            state.comments[parentIndex].replies[replyIndex] = {
              ...state.comments[parentIndex].replies[replyIndex],
              ...data,
            };
          }
        }
      } else {
        const commentIndex = state.comments.findIndex(
          comment => comment._id === commentId,
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex] = {
            ...state.comments[commentIndex],
            ...data,
          };
        }
      }
    },
    deleteComment: (state, action: PayloadAction<DeleteCommentPayload>) => {
      const {_id, parentId} = action.payload;
      if (parentId) {
        const parentIndex = state.comments.findIndex(
          comment => comment._id === parentId,
        );
        if (parentIndex !== -1 && state.comments[parentIndex].replies) {
          state.comments[parentIndex].replies = state.comments[
            parentIndex
          ].replies.filter(reply => reply._id !== _id);
        }
      } else {
        state.comments = state.comments.filter(comment => comment._id !== _id);
      }
    },
  },
});

export const {
  addComment,
  addReplies,
  setComments,
  setSelectedComment,
  setCommentId,
  updateComment,
  deleteComment,
} = commentSlice.actions;

export default commentSlice.reducer;
