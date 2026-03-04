type TPrice = {
  cost: {
    price: number;
    salePrice: number;
  };
  isFree: boolean;
};

type TMeta = {
  title: string;
  description: string;
};

type TAlumni = {
  images: string[];
  title: string;
};

type TObtainCertification = {
  title: string;
  description: string;
};

type TInstructor = {
  _id: string;
  name: string;
};

type TWhatLearn = {
  _id: string;
  key: number;
  title: string;
};

type TBenefit = {
  _id: string;
  title: string;
  description: string;
  icon: string;
};

type TProgress = {
  _id: string;
  id: string;
  title: string;
  limit: number;
};

type TFaq = {
  _id: string;
  question: string;
  answer: string;
};

type TLayoutSection = {
  isVisible: boolean;
  _id: string;
  id: string;
  title: string;
  defaultBranch?: string;
};

export type TCategory = {
  isActive: boolean;
  _id: string;
  name: string;
  slug: string;
};

type TCourseCategory = {
  _id: string;
  course: string;
  categories: TCategory[];
  branch: string;
  updatedAt: string;
};

type TCourseContent = {
  id: string;
  title: string;
  lessons?: TCourseContent[]; // Recursive structure for nested content
};

export type TCourse = {
  price: TPrice;
  meta: TMeta;
  alumni: TAlumni;
  obtainCertification: TObtainCertification;
  image: string;
  label: string;
  language: string;
  tags: string[];
  shortDetail: string;
  requirements: string;
  description: string;
  shortDescription: string;
  isDemo: boolean;
  content: TCourseContent[] | null;
  type: string;
  isPublished: boolean;
  isFeatured: boolean;
  country: string;
  branches: string[];
  _id: string;
  title: string;
  slug: string;
  category: string;
  subCategory: any | null;
  instructor: TInstructor;
  whatLearns: TWhatLearn[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  benefits: TBenefit[];
  organization: string;
  progress: TProgress[];
  faqs: TFaq[];
  layoutSections: TLayoutSection[];
  instructors: TInstructor[];
};

export interface ICourseData {
  success: boolean;
  course: TCourse;
  reviewStatus: string;
  rejectReason: string;
  category: TCourseCategory;
}

export interface IReviewUser {
  profilePicture: string;
  lastName: string;
  _id: string;
  firstName: string;
  fullName: string;
}

export interface IReview {
  videoUrl: string;
  starCount: number;
  status: string; // e.g., "approved"
  _id: string;
  text: string;
  reviewedBy: IReviewUser;
  course: string; // Course ID
  category: string; // e.g., "Student Recommendation"
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}

export interface IReviewResponse {
  success: boolean;
  review: IReview;
}
