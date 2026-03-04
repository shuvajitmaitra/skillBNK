export interface IHoliday {
  _id?: string;
  id?: string;
  date: DateRange;
  type: string;
  message: string;
  timeRanges?: TimeRange[];
  image?: string | null;
  dateCount: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface TimeRange {
  _id?: string;
  start: string | null;
  end: string | null;
}
