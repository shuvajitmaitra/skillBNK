export type TMessages = {
  totalMessage: number;
  totalChat: number;
  totalUnreadChat: number;
  totalReadChat: number;
  totalPinnedMessages: number;
  totalUnreadCrowd: number;
  totalUnreadDirect: number;
};

export type TMessagesRes = {
  success: boolean;
  results: TMessages;
};
