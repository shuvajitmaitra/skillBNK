export type TUserData = {
  phone: string;
  isEmailVerified: IsEmailVerified;
  family: Family;
  chatPermissions: ChatPermissions;
  suspension: Suspension;
  botInfo: BotInfo;
  personalData: PersonalData;
  profileStatus: ProfileStatus;
  profilePicture: string;
  lastName: string;
  about: string;
  type: string;
  readingLists: any[];
  isLockExcluded: boolean;
  _id: string;
  isApproved: boolean;
  email: string;
  firstName: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
  lastActive: string;
  gender: string;
  lastPasswordChange: string;
  deviceToken: string;
  isDemo: boolean;
  fullName: string;
};

export interface IsEmailVerified {
  status: boolean;
  token: string;
}

export interface Family {}

export interface ChatPermissions {
  isSuspended: boolean;
  canJoinChat: boolean;
  canInitiateChat: boolean;
  canCreateChannel: boolean;
  canReadMessage: boolean;
  canSendMessage: boolean;
}

export interface Suspension {
  isSuspended: boolean;
  suspendedUntil: any;
  reason: string;
}

export interface BotInfo {
  branches: any[];
  description: string;
  isActive: boolean;
}

export interface PersonalData {
  address: Address;
  socialMedia: SocialMedia;
  resume: string;
  bio: string;
}

export interface Address {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  state: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
}

export interface ProfileStatus {
  recurring: Recurring;
  currentStatus: string;
}

export interface Recurring {
  isDailyRecurring: boolean;
  fromTime: string;
  toTime: string;
}
