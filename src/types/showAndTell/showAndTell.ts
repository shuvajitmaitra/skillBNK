
type TUser ={
  profilePicture: string;
  lastName: string;
  _id: string;
  email: string;
  firstName: string;
  fullName: string;
}


type TReviewDetails = {
  mark: number;
  answer: string;
}


export type TSNT = {
  reviewDetails: TReviewDetails;
  status: "accepted" | "pending";
  agenda: string;
  attachments: Array<string>; 
  users: TUser[];
  _id: string;
  title: string;
  date: string; 
  creator: string;
  branch: string;
  enrollment: string;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
  thumbnail?: string | null; 
  reviewedBy?: string; 
}
