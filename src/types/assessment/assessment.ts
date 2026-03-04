type TProgram = {
  _id: string;
  title: string;
};

export type TTest = {
  program: TProgram;
  status: string;
  totalTestTime: number;
  textQuestionQuantity: number;
  answeredAt: string | null;
};


type TOption = {
  _id: string;
  option: string;
};

export type TQuestion = {
  program: any[]; 
  isActive: boolean;
  _id: string;
  question: string;
  options: TOption[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  organization: string;
};

export type TQuestionsData = {
  questions: TQuestion[];
};
