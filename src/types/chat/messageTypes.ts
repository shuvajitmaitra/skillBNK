export type IMessage = {
  forwardedFrom?: any;
  _id: string;
  type: string;
  status: string;
  sender: Sender;
  text: string;
  chat: string;
  files: TFile[];
  organization?: string;
  emoji?: Emoji[];
  createdAt: string | Date;
  updatedAt?: string;
  id?: number;
  __v?: number;
  replyCount?: number;
  reactionsCount?: number;
  myReaction?: any;
  reactions?: Reactions;
  editedAt?: string;
  parentMessage?: string;
  isSameDate?: boolean;
  metaData?: {
    eventId?: string;
  };
  pinnedBy?: TPinnedBy;
  forwardModalVisible?: boolean;
};
export type TPinnedBy = {
  profilePicture: string;
  lastName: string;
  type: string;
  _id: string;
  firstName: string;
  fullName: string;
};
export interface Sender {
  profilePicture: string;
  lastName: string;
  type: string;
  _id: string;
  firstName: string;
  fullName: string;
}

export interface TFile {
  uri?: string;
  text: string;
  _id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
  sender?: {
    profilePicture: string;
    lastName: string;
    _id: string;
    firstName: string;
    fullName: string;
  };
}

export interface Emoji {
  _id: string;
  user: string;
  symbol: string;
  createdAt: string;
}

export interface Reactions {
  [key: string]: number;
}

export interface TTempMessage {
  text: string;
  files: any[];
  parentMessage: string;
  _id: number;
  sender: Sender;
  createdAt: number;
  status: string;
  chat: string;
  type: string;
}
