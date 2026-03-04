import {diffChars} from 'diff';
// @ts-ignore the lib do not have TS declarations yet
import matchAll from 'string.prototype.matchall';
import {RegularFonts} from '../../../../constants/Fonts';

/**
 * Helper functions for proper Unicode/emoji handling
 */

// Get proper grapheme length (handles emojis correctly)
const getGraphemeLength = (str: string): number => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', {granularity: 'grapheme'});
    return Array.from(segmenter.segment(str)).length;
  }

  // Fallback: count surrogate pairs as single characters
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate, skip the next character (low surrogate)
      i++;
    }
    length++;
  }
  return length;
};

// Get substring with proper emoji handling
const getEmojiAwareSubstring = (
  str: string,
  start: number,
  end?: number,
): string => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', {granularity: 'grapheme'});
    const segments = Array.from(segmenter.segment(str));
    return segments
      .slice(start, end)
      .map(s => s.segment)
      .join('');
  }

  // Fallback using Array.from which handles surrogate pairs
  const chars = Array.from(str);
  return chars.slice(start, end).join('');
};

// Get last index with emoji awareness
const getEmojiAwareLastIndexOf = (
  str: string,
  searchStr: string,
  fromIndex?: number,
): number => {
  const chars = Array.from(str);
  const searchChars = Array.from(searchStr);

  const endIndex = fromIndex !== undefined ? fromIndex : chars.length - 1;

  for (let i = endIndex; i >= 0; i--) {
    let match = true;
    for (let j = 0; j < searchChars.length; j++) {
      if (i + j >= chars.length || chars[i + j] !== searchChars[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      // Convert back to string index
      return chars.slice(0, i).join('').length;
    }
  }
  return -1;
};

/**
 * RegEx grouped results. Example - "@[Full Name](123abc)"
 * We have 4 groups here:
 * - The whole original string - "@[Full Name](123abc)"
 * - Mention trigger - "@"
 * - Name - "Full Name"
 * - Id - "123abc"
 */
const mentionRegEx = /((.)\[([^[]*)]\(([^(^)]*)\))/gi;

const defaultMentionTextStyle = {
  fontWeight: 'bold',
  color: 'blue',
  fontSize: RegularFonts.BR,
};

const defaultPlainStringGenerator = ({trigger}, {name}) => `${trigger}${name}`;

const isMentionPartType = partType => {
  return partType.trigger != null;
};

const getPartIndexByCursor = (
  parts: any[],
  cursor: number,
  isIncludeEnd: boolean | undefined,
) => {
  return parts.findIndex(one =>
    cursor >= one.position.start && isIncludeEnd
      ? cursor <= one.position.end
      : cursor < one.position.end,
  );
};

/**
 * The method for getting parts between two cursor positions with emoji support.
 */
const getPartsInterval = (parts: any[], cursor: number, count: number) => {
  const newCursor = cursor + count;

  const currentPartIndex = getPartIndexByCursor(parts, cursor, false);
  const currentPart = parts[currentPartIndex];

  const newPartIndex = getPartIndexByCursor(parts, newCursor, true);
  const newPart = parts[newPartIndex];

  let partsInterval: any[] = [];

  if (!currentPart || !newPart) {
    return partsInterval;
  }

  // Push whole first affected part or sub-part of the first affected part
  if (
    currentPart.position.start === cursor &&
    currentPart.position.end <= newCursor
  ) {
    partsInterval.push(currentPart);
  } else {
    const startOffset = cursor - currentPart.position.start;
    const subText = getEmojiAwareSubstring(
      currentPart.text,
      startOffset,
      startOffset + count,
    );
    partsInterval.push(generatePlainTextPart(subText));
  }

  if (newPartIndex > currentPartIndex) {
    // Concat fully included parts
    partsInterval = partsInterval.concat(
      parts.slice(currentPartIndex + 1, newPartIndex),
    );

    // Push whole last affected part or sub-part of the last affected part
    if (
      newPart.position.end === newCursor &&
      newPart.position.start >= cursor
    ) {
      partsInterval.push(newPart);
    } else {
      const endOffset = newCursor - newPart.position.start;
      const subText = getEmojiAwareSubstring(newPart.text, 0, endOffset);
      partsInterval.push(generatePlainTextPart(subText));
    }
  }

  return partsInterval;
};

const getMentionPartSuggestionKeywords = (
  parts: any[],
  plainText: string | Iterable<unknown> | ArrayLike<unknown>,
  selection: {start: any; end: any},
  partTypes: any[],
) => {
  const keywordByTrigger: {[key: string]: string | undefined} = {};

  // Remove emojis from plainText for processing
  const cleanedText = removeEmojis(String(plainText));

  partTypes
    ?.filter(isMentionPartType)
    .forEach(({trigger, allowedSpacesCount = 1}) => {
      keywordByTrigger[trigger] = undefined;

      // Skip if there's a selection range (not typing a mention)
      if (selection?.end !== selection?.start) {
        return;
      }

      // Find the part containing the cursor
      const part = parts.find(
        one =>
          selection?.end >= one.position?.start &&
          selection?.end <= one.position?.end,
      );

      // Skip if cursor is in a mention part or no part is found
      if (!part || part?.data != null) {
        return;
      }

      // Adjust cursor position to account for removed emojis
      const originalTextBeforeCursor = String(plainText).slice(
        0,
        selection?.end,
      );
      const cleanedTextBeforeCursor = removeEmojis(originalTextBeforeCursor);
      const adjustedCursor = cleanedTextBeforeCursor.length;

      // Find the last trigger in the cleaned text
      const triggerIndex = cleanedText.lastIndexOf(trigger, adjustedCursor);

      // Skip if trigger is not found or is outside the current part
      if (
        triggerIndex === -1 ||
        triggerIndex < part?.position?.start ||
        triggerIndex >= part?.position?.end
      ) {
        return;
      }

      // Check for valid characters before the trigger
      let isValidTrigger = true;
      if (triggerIndex > 0) {
        const charBefore = cleanedText[triggerIndex - 1];
        // Allow spaces, newlines, or start of string before the trigger
        isValidTrigger = /\s|\n/.test(charBefore) || triggerIndex === 0;
      }

      if (!isValidTrigger) {
        return;
      }

      // Count spaces between trigger and adjusted cursor
      let spacesCount = 0;
      for (
        let cursor = adjustedCursor - 1;
        cursor > triggerIndex;
        cursor -= 1
      ) {
        if (cleanedText[cursor] === '\n') {
          return; // Newline breaks the mention
        }
        if (cleanedText[cursor] === ' ') {
          spacesCount += 1;
          if (spacesCount > allowedSpacesCount) {
            return; // Too many spaces
          }
        }
      }

      // Extract keyword after trigger
      keywordByTrigger[trigger] = cleanedText.slice(
        triggerIndex + trigger.length,
        adjustedCursor,
      );
    });

  return keywordByTrigger;
};
/**
 * Generates new value when we changing text with emoji support.
 */
const generateValueFromPartsAndChangedText = (
  parts: any[],
  originalText: string,
  changedText: string,
) => {
  // Use a more sophisticated diff that handles emojis better
  const changes = diffChars(originalText, changedText);

  let newParts: any[] = [];
  let cursor = 0;

  changes.forEach(change => {
    switch (true) {
      case change.removed: {
        cursor += getGraphemeLength(change.value);
        break;
      }

      case change.added: {
        newParts.push(generatePlainTextPart(change.value));
        break;
      }

      default: {
        if (change.count !== 0) {
          newParts = newParts.concat(
            getPartsInterval(parts, cursor, getGraphemeLength(change.value)),
          );
          cursor += getGraphemeLength(change.value);
        }
        break;
      }
    }
  });

  return getValueFromParts(newParts);
};

/**
 * Method for adding suggestion to the parts and generating value with emoji support.
 */
const generateValueWithAddedSuggestion = (
  parts,
  mentionType,
  plainText,
  selection,
  suggestion,
) => {
  const currentPartIndex = parts.findIndex(
    one =>
      selection.end >= one.position.start && selection.end <= one.position.end,
  );
  const currentPart = parts[currentPartIndex];

  if (!currentPart) {
    return;
  }

  const triggerPartIndex = getEmojiAwareLastIndexOf(
    currentPart.text,
    mentionType.trigger,
    selection.end - currentPart.position.start,
  );

  const newMentionPartPosition = {
    start: triggerPartIndex,
    end: selection.end - currentPart.position.start,
  };

  const isInsertSpaceToNextPart =
    mentionType.isInsertSpaceAfterMention &&
    // Cursor is at the very end of parts or text row
    (getGraphemeLength(plainText) === selection.end ||
      parts[currentPartIndex]?.text?.startsWith(
        '\n',
        newMentionPartPosition.end,
      ));

  return getValueFromParts([
    ...parts.slice(0, currentPartIndex),

    // Create part with string before mention
    generatePlainTextPart(
      getEmojiAwareSubstring(currentPart.text, 0, newMentionPartPosition.start),
    ),
    generateMentionPart(mentionType, {
      original: getMentionValue(mentionType.trigger, suggestion),
      trigger: mentionType.trigger,
      ...suggestion,
    }),

    // Create part with rest of string after mention and add a space if needed
    generatePlainTextPart(
      `${isInsertSpaceToNextPart ? '' : ''}${getEmojiAwareSubstring(
        currentPart.text,
        newMentionPartPosition.end,
      )}`,
    ),

    ...parts.slice(currentPartIndex + 1),
  ]);
};

/**
 * Method for generating part for plain text
 */
const generatePlainTextPart = (text, positionOffset = 0) => ({
  text,
  position: {
    start: positionOffset,
    end: positionOffset + getGraphemeLength(text),
  },
});

/**
 * Method for generating part for mention
 */
const generateMentionPart = (mentionPartType, mention, positionOffset = 0) => {
  const text = mentionPartType.getPlainString
    ? mentionPartType.getPlainString(mention)
    : defaultPlainStringGenerator(mentionPartType, mention);

  return {
    text,
    position: {
      start: positionOffset,
      end: positionOffset + getGraphemeLength(text),
    },
    partType: mentionPartType,
    data: mention,
  };
};

/**
 * Generates part for matched regex result
 */
const generateRegexResultPart = (partType, result, positionOffset = 0) => ({
  text: result[0],
  position: {
    start: positionOffset,
    end: positionOffset + getGraphemeLength(result[0]),
  },
  partType,
});

/**
 * Method for generation mention value that accepts mention regex
 */
const getMentionValue = (trigger, suggestion) =>
  `${trigger}[${suggestion.name}](${suggestion.id})`;

const getMentionDataFromRegExMatchResult = ([
  ,
  original,
  trigger,
  name,
  id,
]) => ({
  original,
  trigger,
  name,
  id,
});

/**
 * Recursive function for deep parse MentionInput's value and get plainText with parts
 * Updated with emoji-aware string operations
 */
const parseValue = (value, partTypes, positionOffset = 0) => {
  if (value === null) {
    value = '';
  }

  let plainText = '';
  let parts = [];

  // We don't have any part types so adding just plain text part
  if (partTypes?.length === 0) {
    plainText += value;
    parts.push(generatePlainTextPart(value, positionOffset));
  } else {
    const [partType, ...restPartTypes] = partTypes;

    const regex = isMentionPartType(partType) ? mentionRegEx : partType.pattern;

    const matches = Array.from(matchAll(value ?? '', regex));

    // In case when we didn't get any matches continue parsing value with rest part types
    if (matches?.length === 0) {
      return parseValue(value, restPartTypes, positionOffset);
    }

    // In case when we have some text before matched part parsing the text with rest part types
    if (matches[0].index !== 0) {
      const text = getEmojiAwareSubstring(value, 0, matches[0].index);

      const plainTextAndParts = parseValue(text, restPartTypes, positionOffset);
      parts = parts.concat(plainTextAndParts.parts);
      plainText += plainTextAndParts.plainText;
    }

    // Iterating over all found pattern matches
    for (let i = 0; i < matches?.length; i++) {
      const result = matches[i];

      if (isMentionPartType(partType)) {
        const mentionData = getMentionDataFromRegExMatchResult(result);

        // Matched pattern is a mention and the mention doesn't match current mention type
        // We should parse the mention with rest part types
        if (mentionData.trigger !== partType.trigger) {
          const plainTextAndParts = parseValue(
            mentionData.original,
            restPartTypes,
            positionOffset + getGraphemeLength(plainText),
          );
          parts = parts.concat(plainTextAndParts.parts);
          plainText += plainTextAndParts.plainText;
        } else {
          const part = generateMentionPart(
            partType,
            mentionData,
            positionOffset + getGraphemeLength(plainText),
          );

          parts.push(part);
          plainText += part.text;
        }
      } else {
        const part = generateRegexResultPart(
          partType,
          result,
          positionOffset + getGraphemeLength(plainText),
        );

        parts.push(part);
        plainText += part.text;
      }

      // Check if the result is not at the end of whole value so we have a text after matched part
      // We should parse the text with rest part types
      if (
        result.index + getGraphemeLength(result[0]) !==
        getGraphemeLength(value)
      ) {
        // Check if it is the last result
        const isLastResult = i === matches?.length - 1;

        // So we should to add the last substring of value after matched mention
        const startPos = result.index + getGraphemeLength(result[0]);
        const endPos = isLastResult ? undefined : matches[i + 1].index;
        const text = getEmojiAwareSubstring(value, startPos, endPos);

        const plainTextAndParts = parseValue(
          text,
          restPartTypes,
          positionOffset + getGraphemeLength(plainText),
        );
        parts = parts.concat(plainTextAndParts.parts);
        plainText += plainTextAndParts.plainText;
      }
    }
  }

  // Exiting from parseValue
  return {
    plainText,
    parts,
  };
};

/**
 * Function for generation value from parts array
 */
const getValueFromParts = (parts: any[]) =>
  parts.map(item => (item?.data ? item?.data?.original : item?.text)).join('');

/**
 * Replace all mention values in value to some specified format
 */
const replaceMentionValues = (
  value: string,
  replacer: (arg0: {original: any; trigger: any; name: any; id: any}) => any,
) =>
  value.replace(
    mentionRegEx,
    (fullMatch: any, original: any, trigger: any, name: any, id: any) =>
      replacer({
        original,
        trigger,
        name,
        id,
      }),
  );

export {
  mentionRegEx,
  defaultMentionTextStyle,
  isMentionPartType,
  getMentionPartSuggestionKeywords,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  generatePlainTextPart,
  generateMentionPart,
  getMentionValue,
  parseValue,
  getValueFromParts,
  replaceMentionValues,
  getGraphemeLength,
  getEmojiAwareSubstring,
  getEmojiAwareLastIndexOf,
};
export const removeEmojis = (str: string): string => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}|\u{200D}/gu;
  return str.replace(emojiRegex, '');
};

export const withOpacity = (hexColor: string, opacity: number) => {
  let hex = hexColor.replace('#', '').trim();

  // Expand #RGB -> #RRGGBB
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }

  // If #RRGGBBAA provided, drop the AA (we’ll replace it)
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }

  if (hex.length !== 6) {
    // fallback: return original (avoid crashing)
    return hexColor;
  }

  const alpha = Math.round(Math.min(1, Math.max(0, opacity)) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  // Return #RRGGBBAA (React Native supports this)
  return `#${hex.toUpperCase()}${alpha}`;
};
