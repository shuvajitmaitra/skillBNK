// Type for the `results` object
export type TCalendarResults = {
  total: number;
  finished: number;
  current: number;
  upcoming: number;
  recurrent: number;
};

// Type for the `calendar` object
export type TCalendar = {
  results: TCalendarResults;
};

// Type for the `data` object
export type TCalendarData = {
  calendar: TCalendar;
};

// Type for the root API response
export type TCalendarChartApiResponse = {
  success: boolean;
  data: TCalendarData;
};
