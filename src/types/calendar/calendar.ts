interface DiffItem {
  newValue: string | number | boolean | null; // adjust the union as needed
  oldValue?: string | number | boolean | null; // adjust the union as needed
}

interface Diff {
  [key: string]: DiffItem;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface THistory {
  _id: string;
  collectionId: string;
  diff: Diff;
  version: number;
  user: User;
  reason: string;
  createdAt: string; // or Date if you plan to convert these values
  updatedAt: string; // or Date if you plan to convert these values
  __v: number;
}
