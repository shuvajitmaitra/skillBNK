type DashboardSection<T = Record<string, unknown> | unknown[]> = {
  success?: boolean;
  results?: T;
  [key: string]: unknown;
};

type CourseResults = unknown[];

type ShowTellResults = {
  totalItems?: number;
  acceptedItems?: number;
  pendingItems?: number;
  rejectedItems?: number;
  [key: string]: unknown;
};

type AssignmentResults = {
  totalItems?: number;
  pendingItems?: number;
  acceptedItems?: number;
  rejectedItems?: number;
  [key: string]: unknown;
};

type ReviewResults = {
  totalReviews?: number;
  [key: string]: unknown;
};

type DayTodayResults = unknown[];

type DocumentLabResults = {
  documentLab?: number;
  [key: string]: unknown;
};

type MyDocumentResults = {
  myDocument?: number;
  [key: string]: unknown;
};

type MockInterviewResults = {
  totalInterview?: number;
  submitted?: number;
  completed?: number;
  pending?: number;
  [key: string]: unknown;
};

type CommunityResults = {
  totalCommunityPost?: number;
  [key: string]: unknown;
};

type TemplateResults = {
  totalTemplates?: number;
  [key: string]: unknown;
};

type LastPasswordUpdateResults = {
  lastPasswordUpdate?: string;
  [key: string]: unknown;
};

type FamilyMemberResults = {
  familyMemberCount?: number;
  [key: string]: unknown;
};

type CalendarResults = {
  total?: number;
  finished?: number;
  current?: number;
  upcoming?: number;
  recurrent?: number;
  [key: string]: unknown;
};

type MessageResults = {
  totalMessage?: number;
  totalChat?: number;
  totalUnreadChat?: number;
  totalReadChat?: number;
  totalPinnedMessages?: number;
  totalUnreadCrowd?: number;
  totalUnreadDirect?: number;
  [key: string]: unknown;
};

export type DashboardResponse = {
  course?: DashboardSection<CourseResults>;
  showTell?: DashboardSection<ShowTellResults>;
  assignment?: DashboardSection<AssignmentResults>;
  review?: DashboardSection<ReviewResults>;
  dayToday?: DashboardSection<DayTodayResults>;
  documentLab?: DashboardSection<DocumentLabResults>;
  myDocument?: DashboardSection<MyDocumentResults>;
  mockInterview?: DashboardSection<MockInterviewResults>;
  community?: DashboardSection<CommunityResults>;
  template?: DashboardSection<TemplateResults>;
  lastPasswordUpdate?: DashboardSection<LastPasswordUpdateResults>;
  familyMember?: DashboardSection<FamilyMemberResults>;
  calendar?: DashboardSection<CalendarResults>;
  message?: DashboardSection<MessageResults>;
  [key: string]: DashboardSection<any> | unknown;
};
