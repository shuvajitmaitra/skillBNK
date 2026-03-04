// Type for the `results` object
export type TTechnicalTestsResults = {
  acceptedItems: number;
  pendingItems: number;
  rejectedItems: number;
  totalItems: number;
  //   recurrent: number;
};

// Type for the `calendar` object
export type TTechnicalTests = {
  results: TTechnicalTestsResults;
};

// Type for the `data` object
export type TTechnicalTestsData = {
  assignment: TTechnicalTests;
};

// Type for the root API response
export type TTechnicalTestsApiResponse = {
  success: boolean;
  results: TTechnicalTestsResults;
};
