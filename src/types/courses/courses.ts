export type TCourseData = {
  image: string;
  type: string;
  _id: string;
  title: string;
  slug: string;
  instructor: string;
};

export type TCourse = {
  _id: string;
  status: string;
  amount: number;
  course: TCourseData;
  user: string;
  organization: string;
  createdAt: string; // Alternatively, use Date if you convert these strings when parsing
  updatedAt: string; // Alternatively, use Date
  __v: number;
  paid: number;
};
