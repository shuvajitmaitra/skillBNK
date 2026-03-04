// types/calendar/event.ts
export interface ITimeRange {
  repeatDays: any[]; // Replace with a more specific type if available, e.g. string[]
  turnOn: boolean;
  repeatPeriod: string;
  repeatIteration?: number;
}

export interface INotification {
  chatGroups?: any;
  timeBefore: number;
  methods: string[];
  crowds: any[]; // Adjust if a more specific type is known
}

export interface IEventUser {
  profilePicture: string;
  lastName: string;
  _id: string;
  email: string;
  firstName: string;
  fullName: string;
}

export interface IParticipant {
  userInfo: {
    answers: any[]; // Adjust as needed
  };
  status: string;
  proposedTime?: {
    start: string;
    end: string;
  };
  _id: string;
  user: IEventUser;
  addedAt: string;
  updatedAt: string;
}
export interface IEventsMap {
  [date: string]: {
    [hour: string]: IEvent[];
  };
}
export interface ITotalEvents {
  title: string;
  data: IEvent[];
}
export interface IEvent {
  timeRange: ITimeRange;
  isAllDay: boolean;
  agenda: string;
  meetingLink: string;
  actionItems: string;
  followUp: string;
  attachments: any[];
  eventType: string;
  _id: string;
  title: string;
  start: string;
  end: string;
  createdBy: IEventUser;
  participants: IParticipant[];
  organization: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  notifications: INotification[];
  myParticipantData: {
    user: string;
    status: 'accepted' | 'pending' | 'denied' | 'canceled';
    _id?: string;
  };
  status?: string;
}
export type ISchedule = {
  data: IData;
  userId: string;
};

export interface IData {
  _id: string;
  type: string;
  intervals: Interval[];
  wday: string;
}

export interface Interval {
  _id: string;
  from: string;
  to: string;
}
