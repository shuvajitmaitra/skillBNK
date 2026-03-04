export interface TSender {
  profilePicture: string;
  lastName: string;
  _id: string;
  email: string;
  firstName: string;
  fullName: string;
}

export interface TActivities {
  attachments: string[];
  branch: string;
  category: string;
  createdAt: string;
  description: string;
  enrollment: string;
  sender: TSender;
  status: string;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
