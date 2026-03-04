// Union types for fixed values
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type LocationType = 'meet' | 'zoom' | 'call' | 'custom';
export type ReminderMethod =
  | 'email'
  | 'push'
  | 'text'
  | 'directMessage'
  | 'crowds';
export type EventType = 'event' | 'task';
export type Priority = 'low' | 'medium' | 'high' | 'notdefined';
export type ResponseStatus =
  | 'needsAction'
  | 'accepted'
  | 'declined'
  | 'tentative'
  | 'proposednewtime'
  | 'proposedNewTime';

// Core interfaces
export interface Organizer {
  profilePicture: string;
  lastName: string;
  _id: string;
  email?: string;
  firstName: string;
  fullName: string;
}

export interface Recurrence {
  isRecurring: boolean;
  frequency: Frequency;
  interval: number;
  daysOfWeek: number[]; // 1=Monday to 7=Sunday
  endRecurrence: string | null; // ISO 8601 date
}

export interface Location {
  type: LocationType;
  link: string;
}

export interface Reminder {
  methods: ReminderMethod[];
  crowds: string[];
  offsetMinutes: number;
}

export interface Attachment {
  name: string;
  type: string; // MIME type
  size: number; // Bytes
  url: string;
}

export interface AttendeeStatistics {
  needsAction: number;
  accepted: number;
  denied: number;
}

export type Attendee = {
  profilePicture: any;
  user: {
    profilePicture: string;
    lastName: string;
    _id: string;
    email: string;
    firstName: string;
    fullName: string;
  };
  status?: ResponseStatus;
};

export interface Permissions {
  modifyEvent: boolean;
  inviteOthers: boolean;
  seeGuestList: boolean;
}

// Main event interface
export interface IEventV2 {
  // Required core properties
  title: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601

  // Optional properties
  _id?: string;
  description?: string;
  location?: Location;
  isAllDay?: boolean;
  timeZone?: string;
  eventColor?: string;
  recurrence?: Recurrence;
  attendees?: Attendee[];
  reminders?: Reminder[];
  priority?: Priority;
  attachments?: Attachment[];
  type?: EventType;
  permissions?: Permissions;

  // System properties (optional unless guaranteed)
  organization?: string;
  organizer?: Organizer;
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  attendeeCount?: number;
  seriesId?: string;
  createdBy?: {_id: string};
  myResponseStatus?: ResponseStatus;
  attendeeStatistics?: AttendeeStatistics;

  // Legacy/deprecated properties
  status?: string; // Consider using proper union type
  eventType?: string; // Redundant with 'type'?
  updateEventVisible?: boolean;
  purpose?: {
    category?: string;
    resourceId?: string;
    name?: string;
  };
  invitationScreen?: boolean;
}
