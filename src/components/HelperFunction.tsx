/* eslint-disable no-useless-escape */
import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';

export function extractFileName(url: string): string {
  try {
    console.log('Input URL:', url);

    const cleanUrl = url.split('#')[0].split('?')[0];
    console.log('Clean URL:', cleanUrl);

    const lastSlash = cleanUrl.lastIndexOf('/');
    const rawFileName =
      lastSlash >= 0 ? cleanUrl.substring(lastSlash + 1) : cleanUrl;

    let fileName = rawFileName;
    try {
      fileName = decodeURIComponent(rawFileName);
    } catch (e) {
      console.log('decodeURIComponent failed, using raw filename:', e);
    }

    // ✅ remove leading numbers + optional separators like "-" "_" " "
    const cleanedFileName = fileName.replace(/^\d+[-_\s]+/, '');

    console.log('Extracted File Name:', fileName);
    console.log('Cleaned File Name:', cleanedFileName);

    return cleanedFileName;
  } catch (error) {
    console.error('Error extracting file name:', error);
    return '';
  }
}
export const handleOpenLink = (link: string): void => {
  // Ensure the link begins with 'https://'
  const url = link.startsWith('https://') ? link : `https://${link}`;
  Linking.openURL(url);
};

export function generateRandomHexId(length: number): string {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}

export function createIsoTimestamp(
  day: number,
  month: number,
  year: number,
): string {
  // Ensure the day and month are two digits
  const dayStr = day.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');

  // Create the ISO 8601 timestamp string
  const isoTimestamp = `${year}-${monthStr}-${dayStr}T00:00:00.000Z`;
  return isoTimestamp;
}

// export function removeMarkdown(markdownText: string): string {
//   return markdownText?.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
// }
export function removeLinkMarkdown(str: string) {
  // Match HTML anchor tags and markdown links [text](url)
  return str.replace(
    /<a[^>]*href="[^"]*"[^>]*>[^<]*<\/a>|\[([^\]]*)\]\(([^\)]*)\)/g,
    (match, text) => {
      // For markdown links, return the text; for HTML links, return the inner text or URL
      return (
        text || match.replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/, '$2')
      );
    },
  );
}
export function removeMarkdown(text: string) {
  if (!text) {
    return '';
  }

  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italics
    .replace(/~~(.*?)~~/g, '$1') // Strikethrough
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/^\s*#{1,6}\s*/gm, '') // Headers
    .replace(/>\s?/g, '') // Blockquotes
    .replace(/^-{3,}\s*$/gm, '') // Horizontal rules
    .replace(/(?:^|\n)\s*-\s+/g, '\n') // Unordered lists
    .replace(/(?:^|\n)\s*\d+\.\s+/g, '\n') // Ordered lists
    .replace(/&#x20;/g, ' ') // Replace HTML space entity
    .replace(/\n{2,}/g, '\n') // Collapse newlines
    .replace(/\\([\\*_`~#\->.)])/g, '$1') // Unescape markdown specials
    .trim();
}

export function CalendarFormatTime(timestamp: string): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

  return hours + (minutesStr === '00' ? '' : ':' + minutesStr) + ' ' + ampm;
}
interface ToastOptions {
  message?: string;
  color?: string;
  background?: string;
}

export const showToast = ({message, color, background}: ToastOptions): void => {
  Toast.show({
    type: 'tomatoToast', // This matches the key defined in toastConfig
    text1: message,
    position: 'bottom',
    props: {color, background},
  });
};
