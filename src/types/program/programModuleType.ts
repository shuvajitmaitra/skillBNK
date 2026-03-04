// programModuleType.ts

// =================================================
// Main Types
// =================================================

export interface TProgramMain {
  success: boolean;
  program: TProgram;
  session: TSession;
  status: string;
  enrollment: TEnrollment;
}

export type TCategory = {
  _id: string;
  course: string;
  categories: TCategories[];
  branch: string;
  updatedAt: string; // or Date if parsed
};

// =================================================
// Program Types
// =================================================

export interface TProgram {
  price: TPrice;
  meta: TMeta;
  alumni: TAlumni;
  obtainCertification: TObtainCertification;
  image: string;
  label: string;
  language: string;
  tags: any[];
  shortDetail: string;
  requirements: string;
  description: string;
  shortDescription: string;
  isDemo: boolean;
  content: any;
  type: string;
  isPublished: boolean;
  isFeatured: boolean;
  country: string;
  branches: string[];
  _id: string;
  title: string;
  slug: string;
  category: string;
  subCategory: any;
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
  instructors: any[];
  deliveryType?: 'scorm' | 'native';
}

// =================================================
// Price, Meta, Alumni, Certification, Instructor, WhatLearn, Benefit, Progress, FAQ, LayoutSection
// =================================================

export interface TPrice {
  cost: TCost;
  isFree: boolean;
}

export interface TCost {
  price: number;
  salePrice: number;
}

export interface TMeta {
  title: string;
  description: string;
}

export interface TAlumni {
  images: string[];
  title: string;
}

export interface TObtainCertification {
  title: string;
  description: string;
}

export interface TInstructor {
  about: string;
  image: string;
  isActive: boolean;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  organization: string;
}

export interface TWhatLearn {
  _id: string;
  key: number;
  title: string;
}

export interface TBenefit {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TProgress {
  _id: string;
  id: string;
  title: string;
  limit: number;
}

export interface TFaq {
  _id: string;
  question: string;
  answer: string;
}

export interface TLayoutSection {
  isVisible: boolean;
  _id: string;
  id: string;
  title: string;
}

// =================================================
// Session & Enrollment Types
// =================================================

export interface TSession {
  isActive: boolean;
  _id: string;
  name: string;
  startingDate: any;
  organization: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TEnrollment {
  status: string;
  _id: string;
  totalAmount: number;
  user: string;
  organization: {name: string; slug: string};
  branch: {name: string; slug: string};
  program: TProgram;
  session: TSession;
  formStepsData: TFormStep[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  activeTill: any;
  id: string;
}

export interface TFormStep {
  _id: string;
  label: string;
  icon: string;
  type: string;
  id: string;
  rows: TFormRow[];
}

export interface TFormRow {
  _id: string;
  label: string;
  icon: string;
  type: string;
  id: string;
  fields: TFormField[];
}

export interface TFormField {
  options: TOption[];
  children: string[];
  _id: string;
  id: string;
  icon: string;
  label: string;
  isDefault: boolean;
  isRequired: boolean;
  type: string;
  description: string;
  value?: any;
}

export interface TOption {
  value: string;
}

export type TMyProgramMetrics = {
  totalMark: number;
  totalObtainedMark: number;
  overallPercentageAllItems: number;
  // Additional numeric metrics can be added here
  [key: string]: number;
};

export type TCategories = {
  isActive: boolean;
  _id: string;
  name: string;
  slug: string;
};

// =================================================
// Chapter & Lesson Types
// =================================================

// Enums for Chapter and Lesson types
export enum ChapterType {
  CHAPTER = 'chapter',
  LESSON = 'lesson',
}

// Lesson Info type
export type LessonType = 'video' | 'link' | 'file' | 'slide';

export type TLessonInfo = {
  type: LessonType;
  isFree: boolean;
  duration: number;
  _id: string;
  title: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  data: {
    behavioral: string;
    implementation: string;
    interview: string;
    summary: string;
    transcription: string;
  };
  behavioral: string;
  implementation: string;
  interview: string;
  summary: string;
  transcription: string;
};

// MyCourse type
export type TMyCourse = {
  course: string;
  isOwner: boolean;
  parent: string;
  groups: string[];
  prev: string;
  isPublished: boolean;
  category: string;
  isPreview?: boolean;
  sessions: string[];
  _id: string;
};

// Lesson type
export type TLesson = {
  _id: string;
  key?: string;
  title?: string;
  type: ChapterType.LESSON; // "lesson"
  isLeaf?: boolean;
  lesson: TLessonInfo;
  createdAt?: string;
  myCourse: TMyCourse;
  priority: number;
  isPinned: boolean;
  isCompleted: boolean;
  isFocused: boolean;
  isLocked: boolean;
  isSpecial: boolean;
  parentPath?: string[];
};

// Chapter Info type
export type TChapterInfo = {
  name: string;
  description: string | null;
  subTitle: string | null;
  subDescription: string | null;
  image: string;
  isFree: boolean;
  updatedAt?: string;
  createdAt?: string;
  _id?: string;
  children?: TContent[]; // Nested children using updated TContent type
};

// Chapter type
export type TChapter = {
  _id: string;
  type: ChapterType.CHAPTER;
  chapter: TChapterInfo;
  priority: number;
  myCourse: TMyCourse;
  isPinned: boolean;
  isCompleted: boolean;
  isFocused: boolean;
  isLocked: boolean;
  isSpecial: boolean;
  createdAt?: string;
  lesson?: TLessonInfo;
  title?: string;
  parentPath?: string[];
};

// *** Updated TContent type as a union of TChapter and TLesson with optional title ***
export type TContent = (TChapter | TLesson) & {title?: string};

// Chapters API Response type
export type TChaptersResponse = {
  chapters: TContent[];
  success: boolean;
};
