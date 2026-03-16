export interface IDocument {
  _id: string;
  description: string;
  attachment: string[]; // Array of URLs or file paths
  name: string;
  user: string;
  branch: string;
  enrollment: string;
  comments: any[]; // You can specify the type of comments if needed
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface IDocumentResponse {
  success: boolean;
  documents: IDocument[];
  count: number;
}
export interface FilterModalInfo {
  isVisible: boolean;
  selectedDate: string;
}

export interface PaginationState {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface DocumentsResponse {
  documents?: DocumentItem[];
  pagination?: Partial<PaginationState>;
  success: boolean;
}

export const DEFAULT_PAGINATION: PaginationState = {
  total: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  limit: 10,
};

type Priority = 'low' | 'medium' | 'high' | string;

interface CreatedBy {
  _id: string;
  profilePicture?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
}

export interface DocumentItem {
  _id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category?: string;
  priority?: Priority;
  createdAt: string;
  createdBy?: CreatedBy;
}
