// Represents the course information inside an order
export type TOrderCourse = {
  type: string;
  _id: string;
  title: string;
};

// Represents the order object
export type TOrder = {
  status: string;
  amount: number;
  _id: string;
  course: TOrderCourse;
  user: string;
  organization: string;
  createdAt: string; // You can use Date if you convert it
  updatedAt: string; // You can use Date if you convert it
  __v: number;
};

// Represents a transaction associated with the order
export interface TTransaction {
  amount: number;
  status: string;
  note: string;
  category: string;
  _id: string;
  method: string;
  date: string; // Alternatively, use Date if you convert these
  attachment: string | null;
  user: string;
  order: string;
  organization: string;
  course: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// Represents the complete API response object
export type TOrderResponse = {
  success: boolean;
  order: TOrder;
  transactions: TTransaction[];
};
// types/paymentModal.ts
export type TAddPaymentModalProps = {
  handleAddPayment: () => void;
  method: string;
  amount: number;
  date: Date | null;
  note: string;
  attachment: any; // Change this to a more specific type if available (e.g. string, File, etc.)
  setMethod: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setAttachment: React.Dispatch<React.SetStateAction<any>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  toggleAddPaymentModal: () => void;
  isAddPaymentModalVisible: boolean;
};
