export interface TemplateApiResponse {
  success: boolean;
  templates: TemplateItem[];
  categories: string[];
  pagination?: Partial<PaginationState>;
}
export interface PaginationState {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}
export interface TemplateItem {
  filter: Filter;
  _id: string;
  attachments: Attachment[];
  programs: string[];
  sessions: string[];
  users: string[];
  isActive: boolean;
  branches: string[];
  title: string;
  category: string;
  createdBy: CreatedBy;
  organization: string;
  description: string;
  discussions: Discussion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  thumbnail: string | null;
}

export interface Filter {
  filterBy: FilterBy;
  filterScope: string;
}

export interface FilterBy {
  programs: string[];
  sessions: string[];
  groups: string[];
  users: string[];
}

export interface Attachment {
  _id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  createdAt: string;
}

export interface CreatedBy {
  _id: string;
  profilePicture: string;
  lastName: string;
  firstName: string;
  fullName: string;
}

export interface Discussion {
  _id: string;
  text: string;
  user: string;
  date: string;
}
