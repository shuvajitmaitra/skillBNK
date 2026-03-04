export type TInterview = {
  _id: string;
  name: string;
  type: 'manual' | 'ai';
  isActive: boolean;
  index: number;
  branches: string[];
  createdBy: string;
  organization: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  questions: Question[];
  submission: Submission[]; // Changed from Submission[] to Submission
  filter: Filter;
  groups: Group[];
  aiData?: AIData; // Present only if type is 'ai'
  shareModal?: boolean;
  interviewComment?: boolean;
  startInterview?: boolean;
};

type Question = {
  _id: string;
  title: string;
  type: 'audio' | 'video' | string;
  video: string;
  hint: string;
  index: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Submission = {
  _id: string;
  mark: number;
  attachment: string;
  users: string[];
  remarks: string;
  interview: string;
  user: string;
  organization: string;
  enrollment: string;
  comments: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Filter = {
  filterScope: 'program' | 'global' | 'user'; // Added 'user' to filterScope
  filterBy: {
    users: string[];
    programs: string[];
    sessions: string[];
    groups: string[];
  };
};

type Group = {
  _id: string;
  title: string;
  activeStatus: {
    isActive: boolean;
    activeUntill: string;
  };
};

type AIData = {
  instruction: string;
  duration: number;
  complexity: string;
  customQuestions: string;
};

export type TConversation = {
  _id: string;
  video: string | null;
  audio: string | null;
  interview: string;
  user: string;
  aiConversationData: {
    id: string;
    content: {
      type: 'audio' | 'input_audio' | 'input_text';
      transcript?: string;
      text?: string;
    }[];
    role: 'user' | 'assistant';
    type: 'message';
    transcript: string;
    audioUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
