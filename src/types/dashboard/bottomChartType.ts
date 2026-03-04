export type TBottomChartCommunityResult = {
  totalCommintyPost: number;
};
export type TBottomChartLastPasswordUpdateResult = {
  lastPasswordUpdate: null | number;
};
export type TBottomChartTotalTemplatesResult = {
  totalTemplates: number;
};
export type TBottomChartReviewResult = {
  totalReviews: number;
};
export type TBottomChartFamilyMemberResult = {
  familyMemberCount: number;
};

export type TBottomChartCommunity = {
  success: boolean;
  results: TBottomChartCommunityResult;
};
export type TBottomChartLastPassword = {
  success: boolean;
  results: TBottomChartLastPasswordUpdateResult;
};
export type TBottomChartTotalTemplates = {
  success: boolean;
  results: TBottomChartTotalTemplatesResult;
};
export type TBottomChartReview = {
  success: boolean;
  results: TBottomChartReviewResult;
};
export type TBottomChartFamilyMember = {
  success: boolean;
  results: TBottomChartFamilyMemberResult;
};
//  combine all
export type TBottomChartData = {
  community: TBottomChartCommunity;
  lastPasswordUpdate: TBottomChartLastPassword;
  template: TBottomChartTotalTemplates;
  review: TBottomChartReview;
  familyMember: TBottomChartFamilyMember;
};
