export type RootStackParamList = {
  HomeStack: {screen: keyof HomeStackParamList; params?: any};
  ProgramStack: {screen: keyof ProgramStackParamList; params?: any};
  MyCalendarStack: {screen: keyof CalendarStackParamList; params?: any};
  NotificationScreen: undefined;
  NewChatScreen: undefined;
  DefaultRoute: {title?: string; description?: string};
  CommentScreen: {contentId: string};
  BottomTabNavigator: undefined;
  MessageScreen: {animationEnabled?: boolean; from?: string};
  ThreadScreen: {
    parentMessage?: string;
    chat?: string;
  };
  ChatProfile: undefined;
  OtaScreen: undefined;
  ChatSheet: undefined;
  CreateNewUser: undefined;
  NoteDetails: undefined;
  NoteCreateScreen: undefined;
  MockInterview: undefined;
  MyProfileEdit: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  UserDashboard: undefined;
  DisplaySettingsScreen: undefined;
  MyProfile: undefined;
  ChangePasswordScreen: undefined;
  NewChatScreen: undefined;
  CreateNewUser: undefined;
  NotificationScreen: undefined;
  PurchasedScreen: undefined;
  LandingPage: undefined;
  MyPaymentScreen: {courseId: string};
  CourseDetails: {slug: string};
  BootCampsDetails: undefined;
  NotesScreen: undefined;
};

export type ProgramStackParamList = {
  Program: undefined;
  AudioVideoScreen: undefined;
  AudioVideoDetails: {index: number};
  ProgramDetails: {slug: string; routeName: string | null};
  TechnicalTestScreen: undefined;
  ShowAndTellScreen: undefined;
  ShowNTellDetails: undefined;
  TestNow: undefined;
  ViewStatus: undefined;
  ProgramTextDetails: undefined;
  LeaderBoardScreen: undefined;
  DayToDayActivities: undefined;
  ActivitiesDetails: {index: number};
  Progress: undefined;
  MockInterview: undefined;
  Presentation: undefined;
  PresentationDetailsView: undefined;
  InterviewDetails: undefined;
};
export type CalendarStackParamList = {
  CalendarScreenV2: undefined;
  CalendarScreen: undefined;
  CalendarInvitationsV2: undefined;
  EventDetailsScreen: undefined;
};
