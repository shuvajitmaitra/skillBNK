/* eslint-disable react-hooks/exhaustive-deps */
// TypeScript declaration for Intl.Segmenter (for environments where it's missing)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Intl {
    // You can replace 'any' with a more specific type if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Segmenter: any;
  }
}

// mention-input.tsx (Fixed version with emoji support)
import React, {
  FC,
  MutableRefObject,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputProps,
  TextInputSelectionChangeEventData,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputKeyPressEventData,
  TextInputChangeEventData,
  TextInputFocusEventData,
} from 'react-native';

import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  getValueFromParts,
  isMentionPartType,
  parseValue,
  removeEmojis,
} from './Mention/utils';

// Helper functions for proper emoji handling
const getGraphemeLength = (str: string): number => {
  // Use Intl.Segmenter if available (newer environments)
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', {granularity: 'grapheme'});
    return Array.from(segmenter.segment(str)).length;
  }

  // Fallback: Use a more comprehensive emoji regex
  const emojiRegex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  // Replace emojis with single characters for counting
  const withoutEmojis = str.replace(emojiRegex, 'X');
  return withoutEmojis.length;
};

const getGraphemeAt = (str: string, index: number): string => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', {granularity: 'grapheme'});
    type SegmentData = {segment: string};
    const segments = Array.from(segmenter.segment(str)) as SegmentData[];
    return segments[index]?.segment || '';
  }

  // Fallback for older environments
  return str.charAt(index);
};

// const getGraphemeSubstring = (
//   str: string,
//   start: number,
//   end?: number,
// ): string => {
//   if (typeof Intl !== 'undefined' && Intl.Segmenter) {
//     const segmenter = new Intl.Segmenter('en', {granularity: 'grapheme'});
//     const segments = Array.from(segmenter.segment(str));
//     return segments
//       .slice(start, end)
//       .map(s => s.segment)
//       .join('');
//   }

//   // Fallback
//   return str.substring(start, end);
// };

export interface MentionPartType {
  trigger: string | null;
  renderSuggestions?: (params: {
    keyword: string;
    onSuggestionPress: (suggestion: any) => void;
  }) => JSX.Element;
  isBottomMentionSuggestionsRender?: boolean;
  textStyle?: TextStyle;
  isInsertSpaceAfterMention?: boolean;
}

interface Part {
  text: string;
  partType?: MentionPartType;
  data?: any;
  position: {start: number; end: number};
}

interface ParsedValue {
  plainText: string;
  parts: Part[];
}

export interface MentionInputProps
  extends Omit<TextInputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (newValue: string) => void;
  partTypes?: MentionPartType[];
  inputRef?: React.Ref<TextInput>;
  containerStyle?: StyleProp<ViewStyle>;
  onSelectionChange?: (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;
}

const MentionInput: FC<MentionInputProps> = ({
  value,
  onChange,
  partTypes = [],
  inputRef: propInputRef,
  containerStyle,
  onSelectionChange,
  ...textInputProps
}) => {
  const textInput = useRef<TextInput | null>(null);
  const lastKeyRef = useRef<string | null>(null);
  const [selection, setSelection] = useState<{start: number; end: number}>({
    start: 0,
    end: 0,
  });

  // Track focus state to maintain it during emoji operations
  const [isFocused, setIsFocused] = useState(false);

  // Handle emoji styling issues without losing focus
  useEffect(() => {
    const hasEmojis =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        value,
      );

    if (hasEmojis && isFocused) {
      // Small workaround for emoji styling issues without losing focus
      // This forces a style recalculation without remounting the component
      const input = textInput.current;
      if (input) {
        const currentSelection = selection;
        setTimeout(() => {
          if (input && isFocused) {
            input.setNativeProps({
              style:
                textInputProps.style && typeof textInputProps.style === 'object'
                  ? {...textInputProps.style}
                  : {},
            });
            // Restore selection if needed
            input.setSelection?.(currentSelection.start, currentSelection.end);
          }
        }, 0);
      }
    }
  }, [value, isFocused]);

  const {plainText, parts} = useMemo<ParsedValue>(
    () => parseValue(value, partTypes),
    [value, partTypes],
  );

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    setSelection(event.nativeEvent.selection);
    onSelectionChange && onSelectionChange(event);
  };

  const combinedChangeHandler = (changedText: string, key: string | null) => {
    // Handle backspace with proper emoji support
    if (key === 'Backspace' && selection.start === selection.end) {
      const mentionPartIndex = parts.findIndex(
        part =>
          part.data &&
          selection.start > part.position.start &&
          selection.start <= part.position.end,
      );

      if (mentionPartIndex !== -1) {
        const newParts = [
          ...parts.slice(0, mentionPartIndex),
          ...parts.slice(mentionPartIndex + 1),
        ];
        onChange(getValueFromParts(newParts));
        return;
      }

      // Handle emoji deletion - check if we're deleting an emoji
      if (selection.start > 0) {
        const beforeCursor = plainText.substring(0, selection.start);
        const afterCursor = plainText.substring(selection.start);

        // Get the character before cursor using grapheme-aware method
        const charToDelete = getGraphemeAt(
          beforeCursor,
          getGraphemeLength(beforeCursor) - 1,
        );

        // If it's an emoji or multi-byte character, handle it properly
        if (charToDelete && charToDelete.length > 1) {
          const newText =
            beforeCursor.substring(
              0,
              beforeCursor.length - charToDelete.length,
            ) + afterCursor;
          onChange(newText);
          return;
        }
      }
    }

    onChange(
      generateValueFromPartsAndChangedText(parts, plainText, changedText),
    );
  };

  const handleChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    const changedText = event.nativeEvent.text;
    const removedEmoji = removeEmojis(changedText);
    combinedChangeHandler(removedEmoji, lastKeyRef.current);
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    lastKeyRef.current = event.nativeEvent.key;
    if (textInputProps.onKeyPress) {
      textInputProps.onKeyPress(event);
    }
  };

  const handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    setIsFocused(true);
    if (textInputProps.onFocus) {
      textInputProps.onFocus(event);
    }
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (textInputProps.onBlur) {
      textInputProps.onBlur(event);
    }
  };

  const onSuggestionPress =
    (mentionType: MentionPartType) =>
    (suggestion: any): void => {
      const newValue = generateValueWithAddedSuggestion(
        parts,
        mentionType,
        plainText,
        selection,
        suggestion,
      );
      if (!newValue) {
        return;
      }

      onChange(newValue);

      // Ensure focus remains on the input after suggestion selection
      setTimeout(() => {
        textInput.current?.focus();
      }, 0);
    };

  const handleTextInputRef = (ref: TextInput | null) => {
    textInput.current = ref;
    if (propInputRef) {
      if (typeof propInputRef === 'function') {
        propInputRef(ref);
      } else {
        (propInputRef as MutableRefObject<TextInput | null>).current = ref;
      }
    }
  };

  const keywordByTrigger: Record<string, string> = useMemo(() => {
    const keywords = getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes,
    );
    // Ensure all values are strings
    return Object.fromEntries(
      Object.entries(keywords).map(([trigger, keyword]) => [
        trigger,
        typeof keyword === 'string' ? keyword : '',
      ]),
    );
  }, [parts, plainText, selection, partTypes]);

  const renderMentionSuggestions = (mentionType: MentionPartType) => (
    <React.Fragment key={mentionType.trigger}>
      {mentionType.renderSuggestions &&
        mentionType.renderSuggestions({
          keyword: mentionType.trigger
            ? keywordByTrigger[mentionType.trigger]
            : '',
          onSuggestionPress: onSuggestionPress(mentionType),
        })}
    </React.Fragment>
  );

  return (
    <KeyboardAvoidingView style={containerStyle}>
      <TextInput
        {...textInputProps}
        ref={handleTextInputRef}
        autoFocus={textInputProps.autoFocus ?? false}
        onChange={handleChange}
        onSelectionChange={handleSelectionChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <Text>
          {parts.map(({text, partType, data}, index) =>
            partType ? (
              <Text
                key={`${index}-${data?.trigger ?? 'pattern'}`}
                style={
                  partType.textStyle ?? (defaultMentionTextStyle as TextStyle)
                }>
                {text}
              </Text>
            ) : (
              <Text key={index}>{text}</Text>
            ),
          )}
        </Text>
      </TextInput>
      {partTypes
        ?.filter(
          one =>
            isMentionPartType(one) &&
            one.renderSuggestions != null &&
            one.isBottomMentionSuggestionsRender,
        )
        .map(renderMentionSuggestions)}
    </KeyboardAvoidingView>
  );
};

export {MentionInput};
