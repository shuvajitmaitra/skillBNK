import {combineReducers, Action} from 'redux';
import authReducers from './authReducer';
import chatReducer from './chatReducer';
import notificationReducer from './notificationReducer';
import navigationReducer from './navigationReducer';
import pinReducer from './pinReducer';
import dashboardReducer from './dashboardReducer';
import activitiesReducer from './activitiesReducer';
import showNTellReducer from './showNTellReducer';
import calendarReducer from './calendarReducer';
import calendarReducerV2 from './calendarReducerV2';
import TechnicalTestReducer from './TechnicalTestReducer';
import InterviewReducer from './InterviewReducer';
import communityReducer from './communityReducer';
import audioVideoReducer from './audioVideoReducer';
import commentReducer from './commentReducer';
import programReducer from './programReducer';
import progressReducer from './progressReducer';
import modalReducer from './ModalReducer';
import newChatReducer from './newChatReducer';
import chatSlice from './chatSlice';
import userStatusReducer from './userStatusReducer';
import landingReducer from './landingReducer';
import otaReducer from './otaReducer';
import globalReducer from './globalReducer';
import notesReducer from './notesReducer';
import chatFooterReducer from './chatFooterReducer';
import {RESET_APP} from '../action';

const appReducer = combineReducers({
  auth: authReducers,
  chat: chatReducer,
  notification: notificationReducer,
  navigations: navigationReducer,
  pin: pinReducer,
  dashboard: dashboardReducer,
  activities: activitiesReducer,
  showNTell: showNTellReducer,
  calendar: calendarReducer,
  calendarV2: calendarReducerV2,
  technicalTest: TechnicalTestReducer,
  interview: InterviewReducer,
  community: communityReducer,
  medias: audioVideoReducer,
  comment: commentReducer,
  program: programReducer,
  progress: progressReducer,
  modal: modalReducer,
  newChat: newChatReducer,
  userStatus: userStatusReducer,
  chatSlice: chatSlice,
  landing: landingReducer,
  ota: otaReducer,
  global: globalReducer,
  notes: notesReducer,
  chatFooter: chatFooterReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (
  state: RootState | undefined,
  action: Action,
): RootState => {
  if (action.type === RESET_APP) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
