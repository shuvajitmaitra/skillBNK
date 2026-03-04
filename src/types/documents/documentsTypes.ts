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
