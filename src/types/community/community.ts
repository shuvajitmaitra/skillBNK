// Define the user type for the "createdBy" field
export interface User {
  profilePicture: string;
  lastName: string;
  _id: string;
  firstName: string;
  fullName: string;
}

// Define a type for the reactions object
export interface Reactions {
  [emoji: string]: number;
}

// Define the main type for the release note
export interface IPost {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: User;
  attachments: any[]; // Adjust the type if you have a more specific structure for attachments
  reactions: Reactions;
  createdAt: string; // Consider using Date if you plan to convert these strings to Date objects
  commentsCount: number;
  reactionsCount: number;
  myReaction: any; // Adjust this type based on what "myReaction" should be (null in the provided example)
  isSaved: boolean;
  isReported: boolean;
  x?: number;
  y?: number;
  repostModalVisible?: boolean;
  comment?: string;
}
export interface IContributor {
  user: User;
  count: number;
}

export interface IAttachment {
  _id?: string;
  url: string;
  name?: string;
  type?: string;
  size?: number;
}

// Update your ICreatePost interface to use Attachment instead of any.
export interface ICreatePost {
  _id?: string;
  title: string;
  description: string;
  tags?: string[];
  attachments?: IAttachment[];
}
