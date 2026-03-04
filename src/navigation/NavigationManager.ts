/*




import {getFromMMKV} from '../utility/mmkvHelpers';

const hasMenu = (menuId: string) => {
  const navigationData = getFromMMKV('navigationData');
  console.log(
    'navigationData.length',
    JSON.stringify(navigationData.length, null, 2),
  );
  if (!Array.isArray(navigationData)) return false;

  return !!navigationData.find((menu: any) => menu.id === menuId);
};

// ====== INDIVIDUAL MENU ACCESS CHECKS ======

const hasDashboard = hasMenu('dashboard');
const hasProgram =
  hasMenu('my-program') ||
  hasMenu('portal-audio-video-sending') ||
  hasMenu('portal-template') ||
  hasMenu('portal-diagram') ||
  hasMenu('leaderboard');

const hasPayment = hasMenu('my-payment');
const hasChangePassword = hasMenu('change-password');
const hasMyProfile = hasMenu('my-profile');
const hasFamily = hasMenu('family');
const hasProgress = hasMenu('my-progress');

const hasChat = hasMenu('portal-my-chats');
const hasCalendar = hasMenu('portal-calendar');

const hasNotes = hasMenu('portal-my-notes');
const hasCommunity = hasMenu('portal-community');
const hasMockInterview =
  hasMenu('portal-mock-interviews') || hasMenu('mock-interviews');

const hasAudioVideo = hasMenu('portal-audio-video-sending');

const hasNotification =
  hasMenu('notifications') || hasMenu('notification-preferences');

const hasDocuments =
  hasMenu('portal-document-sending') ||
  hasMenu('portal-user-uploaded-documents') ||
  hasMenu('portal-documents-and-labs') ||
  hasMenu('portal-slide') ||
  hasMenu('portal-template');

const hasAgreement = hasMenu('agreement');
const hasUserManual = hasMenu('user-manual');
*/
