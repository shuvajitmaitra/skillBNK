export type TUser = {
  profilePicture: string;
  lastName: string;
  _id: string;
  firstName: string;
  fullName: string;
};

export type TComment = {
  _id: string;
  contentId: string;
  comment: string;
  user: TUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
  repliesCount: number;
  parentId?: string;
  isUpdateOpen?: boolean;
  replies?: TComment[];
  isReplyOpen?: boolean;
  x?: number;
  y?: number;
  popupVisible?: boolean;
};
