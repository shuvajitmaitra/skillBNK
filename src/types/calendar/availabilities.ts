export interface IAvailability {
  _id: string;
  type: string;
  intervals: IInterval[];
  wday?: string;
  date?: string;
}
export interface ISpecificHour {
  _id: string;
  type: string;
  intervals: IInterval[];
  date: string;
}

export interface IInterval {
  _id: string;
  from: string;
  to: string;
}
