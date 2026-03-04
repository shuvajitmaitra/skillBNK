export interface TTotalData {
  success: boolean;
  results: TResult[];
  notFoundProgressLists: any[]; // Adjust if you know the specific type
  leaderBoardId: string;
  program: ProgramInfo;
  session: SessionInfo;
  myData: MyData;
  lastUpdated: string;
  updateFrequency: string;
}

export interface TResult {
  _id: string;
  metrics: Metrics;
  enrollment: string;
  user: User;
  rank: number;
}

export interface Metrics {
  totalMark: number;
  totalObtainedMark: number;
  overallPercentageAllItems: number;
}

export interface User {
  profilePicture: string;
  lastName: string;
  _id: string;
  firstName: string;
  fullName: string;
}

export interface ProgramInfo {
  _id: string;
  title: string;
}

export interface SessionInfo {
  _id: string;
  name: string;
}

export interface MyData {
  rank: number;
  user?: User;
  metrics?: {
    totalObtainedMark?: number;
    totalMark?: number;
    overallPercentageAllItems?: number;
  };
}
