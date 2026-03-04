// Type for the `results` object
export type TShowNTellChartResults = {
  acceptedItems: number;
  pendingItems: number;
  rejectedItems: number;
  totalItems: number;
  //   recurrent: number;
};

// Type for the `calendar` object
export type TShowNTellChart = {
  results: TShowNTellChartResults;
};

// Type for the `data` object
export type TShowNTellChartData = {
  showTell: TShowNTellChart;
};

// Type for the root API response
export type TShowNTellChartApiResponse = {
  success: boolean;
  results: TShowNTellChartResults;
};
