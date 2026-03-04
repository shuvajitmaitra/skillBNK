import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICreatePost, IPost} from '../../types/community/community';
type TComInfo = {
  page: number;
  limit: number;
  query: string;
  tags: string;
  user: string;
  filterBy: string;
  [arg: string]: any;
};
type initialStateProps = {
  posts: IPost[];
  emptyPosts: boolean;
  isLoading: boolean;
  totalPost: number | null;
  singlePost: IPost | null;
  selectedPost: IPost | null;
  comInfo: TComInfo;
  repostInfo: IPost | null;
  createPost: ICreatePost | null;
};

const initialState: initialStateProps = {
  posts: [],
  emptyPosts: false,
  isLoading: false,
  totalPost: null,
  singlePost: null,
  selectedPost: null,
  comInfo: {
    page: 1,
    limit: 10,
    query: '',
    tags: '',
    user: '',
    filterBy: '',
  },
  repostInfo: null,
  createPost: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setComInfo: (
      state,
      {payload}: PayloadAction<{action: 'set' | 'update'; data: any}>,
    ) => {
      const {action, data} = payload;
      const pre = {...state.comInfo};
      if (action === 'set') {
        state.comInfo = data;
      }
      if (action === 'update') {
        state.comInfo = {...pre, ...data};
      }
    },
    setCommunityPosts: (state, action) => {
      if (action.payload.length === 0) {
        state.posts = action.payload;
      } else {
        state.posts = [...(state.posts || []), ...action.payload];
      }
    },
    setEmptyPost: (state, action) => {
      state.emptyPosts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTotalPost: (state, action) => {
      state.totalPost = action.payload;
    },
    setReactions: (state, {payload}) => {
      const {_id: postId, reactionsCount, myReaction, reactions} = payload;

      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].reactionsCount = reactionsCount;
        state.posts[postIndex].reactions = reactions;

        state.posts[postIndex].myReaction = myReaction;
      }
    },
    setQueryPosts: (state, {payload}) => {
      state.posts = payload;
    },
    setReported: ({posts}, {payload}) => {
      const postIndex = posts.findIndex(post => post._id === payload.post);
      if (postIndex !== -1) {
        posts[postIndex].isReported = false;
      }
    },
    setCommentCount: ({posts}, {payload}) => {
      const {contentId, action, replyCount} = payload;
      const postIndex = posts.findIndex(post => post._id === contentId);
      if (postIndex !== -1) {
        if (action === 'add') {
          posts[postIndex].commentsCount += 1;
        } else {
          posts[postIndex].commentsCount =
            posts[postIndex].commentsCount - (replyCount + 1);
        }
      }
    },
    setSavePost: ({posts}, {payload}) => {
      const postIndex = posts.findIndex(post => post._id === payload._id);

      if (postIndex !== -1) {
        posts[postIndex].isSaved = !posts[postIndex].isSaved;
      }
    },
    setSinglePost: (state, {payload}) => {
      state.singlePost = payload;
    },
    setCreatePost: (state, {payload}) => {
      state.createPost = payload;
    },
    setRepostInfo: (state, {payload}) => {
      if (payload === null) {
        state.repostInfo = null;
        return;
      }
      const pre = {...state.repostInfo};
      state.repostInfo = {...pre, ...payload};
    },
    filterPosts: (state, {payload}) => {
      state.posts = state.posts.filter(post => post._id !== payload);
    },
  },
});

export const {
  setCreatePost,
  setRepostInfo,
  setSelectedPost,
  filterPosts,
  setSinglePost,
  setSavePost,
  setCommentCount,
  setCommunityPosts,
  setEmptyPost,
  setIsLoading,
  setTotalPost,
  setReactions,
  setQueryPosts,
  setReported,
  setComInfo,
} = communitySlice.actions;

// Export the reducer
export default communitySlice.reducer;
