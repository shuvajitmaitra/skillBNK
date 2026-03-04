import React from 'react';
import moment from 'moment';
import {Text} from 'react-native';

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function transFormDate(text) {
  // Define regex pattern to match {{DATE:...}}
  let regexPattern = /\{\{DATE:(.*?)\}\}/g;
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Replace all occurrences of the pattern with formatted time and timezone
  return text?.replace(regexPattern, (match, startTime) => {
    // Format startTime using moment.js
    return `${moment(startTime).format(
      'MMMM Do YYYY, h:mm A z',
    )} (${userTimezone})`;
  });
}

export const generateActivityText = (message, senderName) => {
  let activity = message.activity;
  if (activity?.type === 'createChannel') {
    return (
      <>
        <Text style={{color: 'green', fontWeight: '600'}}>
          Channel created by {senderName}
        </Text>
      </>
    );
  } else if (activity?.type === 'add') {
    return (
      <>
        {senderName} <Text style={{color: 'green'}}>added</Text>{' '}
        {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'remove') {
    return (
      <>
        {senderName} <Text style={{color: 'red'}}>removed</Text>{' '}
        {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'join') {
    return (
      <>
        {message.activity?.user?.fullName}{' '}
        <Text style={{color: 'green'}}>joined</Text>{' '}
      </>
    );
  } else if (activity?.type === 'leave') {
    return (
      <>
        {message.activity?.user?.fullName}{' '}
        <Text style={{color: 'red'}}>left</Text>
        {' this channel'}
      </>
    );
  } else {
    return <>N/A</>;
  }
};

export function autoLinkify(text) {
  // Regular expression to match valid URLs with common domain extensions
  const urlRegex =
    /\b((?:https?|ftp):\/\/[^\s\]]+|(?<!:\/\/)[^\s\]]+\.(com|net|org|edu|gov|mil|int|io|co|info|biz|dev|tv|me)(\b|\/)[^\s\]]*)\b/gi;

  const maxDisplayLength = 100; // Adjust this threshold as needed for your UI

  // Replace plain text URLs with Markdown links, truncating display if too long
  return text.replace(urlRegex, match => {
    // Check if the match is already within Markdown link syntax
    if (text.includes(`[${match}](${match})`)) {
      return match; // Return the match unchanged
    } else {
      const display =
        match.length > maxDisplayLength
          ? match.slice(0, maxDisplayLength - 3) + '...'
          : match;
      return `[${display}](${match})`; // Convert to Markdown link with possibly truncated display
    }
  });
}

export function sliceText(orgText, readMore) {
  if (readMore) {
    return orgText;
  }
  if (orgText.length <= 300) {
    return orgText;
  }

  let cutPos = 300;

  // Regex to find Markdown links [display](url). Assumes no ) in URLs; if your URLs may have ), consider URL-encoding them upstream.
  const linkRegex = /\[([^\]]+?)\]\(([^)]+?)\)/g;
  let match;
  while ((match = linkRegex.exec(orgText)) !== null) {
    const linkStart = match.index;
    const linkEnd = linkRegex.lastIndex;
    if (linkStart <= cutPos && cutPos < linkEnd) {
      // Cut point is inside this link, so extend to the end of the link
      cutPos = linkEnd;
      // No need to continue, as links don't overlap
      break;
    }
  }

  // Optional: Append '...' if we sliced (your original code doesn't, but it improves UX)
  const sliced = orgText.slice(0, cutPos);
  return sliced; // Or return sliced + (cutPos < orgText.length ? '...' : '');
}

export function removeHtmlTags(inputString) {
  return inputString?.replace(/<[^>]*>/g, '');
}

export function convertToCorrectMarkdown(inputMarkdown) {
  let text = inputMarkdown;
  // Step 1: Remove triple backslashes
  text = text.replace(/\\\\\\/g, '\\');

  // Step 2: Unescape markdown special characters
  text = text.replace(/\\([\\*_`~#>\-])/g, '$1');

  // Step 3: Fix list items starting with escaped asterisks
  text = text.replace(/^(\s*)\\\*\s+/gm, '$1* ');

  // Step 4: Remove space before closing bold markers
  text = text.replace(/(\*\*[^*]+?)\s+\*\*/g, '$1**');

  // Step 5: Clean empty bold markers
  text = text.replace(/\*\*(\s*)\*\*/g, '$1');

  // Step 6: Collapse excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  // Step 1: Remove excessive escaping (triple backslashes)
  text = text.replace(/\\\\\\/g, '\\');

  // Step 2: Remove escaping from markdown special characters
  text = text.replace(/\\([*_`~#>\-])/g, '$1');

  // Step 3: Fix list items that start with escaped asterisks
  text = text.replace(/^(\s*)\\\*\s+/gm, '$1* ');

  // Step 4: Collapse excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  // Step 1: Fix escaped inline code (e.g., \`code\` to `code`)
  text = text.replace(/\\`([^`]+)\\`/g, '`$1`');

  // Step 2: Fix escaped bold and italic formatting
  // Bold: \*\*text\*\* to **text** (only when escaped)
  text = text.replace(/\\\*\\\*([^\\*][^\*]*[^\\*])\\\*\\\*/g, '**$1**');
  // Italic: \*text\* to *text* (only when escaped)
  text = text.replace(/\\\*([^\*][^\*]*[^\\*])\\\*/g, '*$1*');

  // Step 3: Fix escaped list items (e.g., \*\ to * for bullet lists)
  text = text.replace(/^(\s*)\\\*\s+/gm, '$1* ');

  // Step 4: Fix escaped blockquotes (e.g., \> to >)
  text = text.replace(/\\>/g, '>');

  // Step 5: Fix escaped backslashes before quotes or other characters
  text = text.replace(/\\([\\"])/g, '$1');

  // Step 6: Preserve correct Markdown structures (headers, tables, etc.)
  // Ensure headers have proper spacing (only adjust if escaped)
  text = text.replace(/^(\s*)#+(\s*[^#].*)$/gm, (match, spaces, content) => {
    return `${spaces}${
      content.startsWith('\\') ? content.replace(/^\\+/, '') : match
    }`;
  });

  // Step 7: Normalize horizontal rules (only convert incorrect forms, preserve ---)
  text = text.replace(/^\s*(\*\*\*|___)\s*$/gm, '---');

  // Step 8: Ensure single blank lines between elements (avoid excessive newlines)
  text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');

  // Step 9: Trim leading/trailing whitespace
  text = text.trim();

  return text;
}

// 1) ছোট লেবেল বানানোর হেল্পার
function shortenUrlLabel(url, max = 40) {
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    const host = u.hostname.replace(/^www\./, '');
    let path = u.pathname + (u.search || '') + (u.hash || '');
    if (path === '/') path = '';
    const label = (host + (path ? '/' : '') + path).replace(/\/{2,}/g, '/');
    if (label.length <= max) return label;
    // মাঝখান থেকে এলিপসিস
    const keep = Math.max(10, Math.floor((max - 1) / 2));
    return label.slice(0, keep) + '…' + label.slice(-keep);
  } catch {
    return url.length > max ? url.slice(0, max - 1) + '…' : url;
  }
}

// 2) লিঙ্কিফাই — কিন্তু ছোট লেবেল সহ
export function autoLinkifySmart(text) {
  const urlRegex =
    /\b((?:https?:\/\/|ftp:\/\/)[^\s\]]+|(?<!:\/\/)[^\s\]]+\.(?:com|net|org|edu|gov|mil|int|io|co|info|biz|dev|tv|me)(?:[^\s\]]*)?)/gi;

  return text.replace(urlRegex, match => {
    // ইতিমধ্যেই markdown link হয়ে থাকলে অপরিবর্তিত রাখুন
    // (সহজ চেক: "[...](...)" স্ট্রাকচারের মধ্যে আছে কি না)
    // খুব কড়া চেক দরকার নেই, সাধারণ কেস কাভার করলেই যথেষ্ট
    if (/\[[^\]]+\]\([^)]+\)/.test(match)) return match;

    const url = match.startsWith('http') ? match : `https://${match}`;
    const label = shortenUrlLabel(match);
    return `[${label}](${url})`;
  });
}

// 3) নিরাপদ ট্রাঙ্কেট — লিঙ্ক ব্লকের ভেতরে কাটবে না
export function safeTruncateMarkdown(md, limit = 300) {
  if (!md || md.length <= limit) return md;

  // সব markdown link ব্লকের অবস্থান বের করা: [label](url)
  const linkRanges = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    linkRanges.push({start: m.index, end: m.index + m[0].length});
  }

  let cut = limit;

  // কাটপয়েন্ট কোনো লিঙ্ক রেঞ্জের ভেতরে পড়লে ঠিক করুন
  const inRange = linkRanges.find(r => cut > r.start && cut < r.end);
  if (inRange) {
    // অপশন A: ব্লক শেষের পর কাটা (ওভারফ্লো ঠিক আছেন?)
    const after = inRange.end;
    // অপশন B: ব্লক শুরুর আগে কাটা
    const before = inRange.start;

    // যত কম ড্যামেজ, সেটি নিন। যদি after খুব jauh হয়ে যায়, before নিন।
    // এখানে একটি ছোট থ্রেশহোল্ড রাখলাম (২০ ক্যারেক্টার)
    const overflow = after - limit;
    if (overflow <= 20 && after <= md.length) {
      cut = after;
    } else {
      cut = before;
    }
  } else {
    // লিঙ্কে না পড়লে, বড় শব্দ/টোকেন মাঝখানে কাটা এড়াতে কাছাকাছি স্পেসে কাটুন
    const space = md.lastIndexOf(' ', limit - 1);
    if (space > limit - 50) cut = space; // 50-char এর মধ্যে স্পেস পেলে সেখানে কাটুন
  }

  const trimmed = md.slice(0, cut).trimEnd();
  return trimmed + '…';
}
