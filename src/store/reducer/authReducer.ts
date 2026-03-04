import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TOrganization} from '../../types/auth/auth';
interface User {
  [key: string]: any;
}

interface Enrollment {
  [key: string]: any;
}

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  enrollment: Enrollment | null;
  myEnrollments: Enrollment[];
  organizations: TOrganization[];
  selectedOrganization: TOrganization | null;
  appLoading: boolean;
  currentRoute: string | null;
  navigation: any;
  accessToken: string | null;
  drawer: boolean;
}

const initialState: AuthState = {
  user: {},
  isAuthenticated: false,
  enrollment: null,
  myEnrollments: [],
  organizations: [],
  selectedOrganization: null,
  appLoading: false,
  currentRoute: null,
  navigation: null,
  accessToken: null,
  drawer: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = {...state.user, ...action.payload};
    },
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    setEnrollment: (state, action: PayloadAction<Enrollment | null>) => {
      state.enrollment = action.payload;
    },
    setMyEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.myEnrollments = action.payload;
    },
    logoutSuccess: state => {
      state.user = {};
      state.isAuthenticated = false;
    },
    selectOrganizations: (state, action: PayloadAction<TOrganization[]>) => {
      state.organizations = action.payload;
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<TOrganization | null>,
    ) => {
      state.selectedOrganization = action.payload;
    },
    setCurrentRoute: (state, action: PayloadAction<string | null>) => {
      state.currentRoute = action.payload;
    },
    setNavigation: (state, action: PayloadAction<any>) => {
      state.navigation = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    toggleDrawer: state => {
      state.drawer = !state.drawer;
    },
  },
});

export const {
  toggleDrawer,
  setAccessToken,
  setNavigation,
  setCurrentRoute,
  setAppLoading,
  setSelectedOrganization,
  selectOrganizations,
  setUser,
  updateUser,
  setEnrollment,
  setMyEnrollments,
  logoutSuccess,
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
