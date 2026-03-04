export type TChat = IGroupChat | TPrivateChat;
export interface IOnlineUser {
  profilePicture: string;
  lastName: string;
  _id: string;
  email: string;
  firstName: string;
  fullName: string;
}

export type TPrivateChat = {
  latestMessage: ILatestMessage;
  memberScope: string;
  _id: string;
  isChannel: boolean;
  isPublic: boolean;
  isArchived: boolean;
  organization: string;
  membersCount: number;
  isReadOnly: boolean;
  unreadCount: number | null;
  otherUser: OtherUser;
  name: string;
  avatar: any;
  myData: MyData;
  typingData: any;
  isChecked?: boolean;
};
export interface IGroupChat {
  description?: string;
  otherUser?: OtherUser;
  latestMessage: ILatestMessage;
  memberScope: string;
  _id: string;
  isChannel: boolean;
  isPublic: boolean;
  isArchived: boolean;
  organization: string;
  membersCount: number;
  isReadOnly: boolean;
  unreadCount?: number | null;
  name: string;
  avatar?: any;
  myData: MyData;
  typingData?: any;
  isChecked?: boolean;
}

export interface ILatestMessage {
  type: string;
  status: string;
  _id: string;
  sender: Sender;
  text: string;
  files: any[];
  emoji: Emoji[];
  createdAt: string;
  id: number;
  activity?: Activity;
}

export interface Sender {
  profilePicture: string;
  lastName: string;
  _id: string;
  firstName: string;
  fullName: string;
}

export interface Emoji {
  _id: string;
  user: string;
  symbol: string;
  createdAt: string;
}

export interface Activity {
  type?: string;
  user: {
    fullName: string;
  };
}

export interface MyData {
  user: string;
  isFavourite: boolean;
  isBlocked: boolean;
  role: string;
  mute: Mute;
  notification: {
    isOn: boolean;
  };
}

export interface Mute {
  isMuted: boolean;
}

export interface OtherUser {
  profilePicture: string;
  lastName: string;
  type: string;
  _id: string;
  firstName: string;
  fullName: string;
}
export type TMediaQuery = {
  tab: 'image' | 'voice' | 'file' | 'link';
  type: 'image' | 'voice' | 'file' | 'link';
  limit: number;
  page: number;
  query: string;
  chatId: string;
};
