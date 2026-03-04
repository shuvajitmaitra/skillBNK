// interface ContentBlock {
//   detail: number;
//   format: number;
//   mode: string;
//   style: string;
//   text: string;
//   type: string;
//   version: number;
// }

// interface Node {
//   children: ContentBlock[] | Node[];
//   direction: string | null;
//   format: string;
//   indent: number;
//   type: string;
//   version: number;
//   tag?: string;
//   textFormat?: number;
//   textStyle?: string;
// }

// interface LexicalDescription {
//   root: Node;
// }

export interface INote {
  tags: string[];
  _id: string;
  title: string;
  description: string;
  attachments: any[];
  thumbnail: string;
  user: string;
  branch: string;
  enrollment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  purpose: {
    category: string;
    resourceId: string;
  };
  x?: number | null;
  y?: number | null;
}
