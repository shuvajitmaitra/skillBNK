// ChatMessageInput.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import _ from 'lodash';
import {useTheme} from '../../context/ThemeContext';
import {MentionInput} from './mention-input';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';
import {getArrayFromLocalStorage} from '../../utility/mmkvHelpers';
import {TCrowdMembers} from '../../types/chat/crowdMembersTypes';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import store from '../../store';
import {fontSizes, gGap, gHeight} from '../../constants/Sizes';
import {updateDraftMessages} from '../../store/reducer/chatSlice';
import {theme} from '../../utility/commonFunction';

interface ChatMessageInputProps {
  chat: string;
  setText: (text: string) => void;
  text: string;
  handleKey: (event: any) => void;
  isChannel: boolean;
  maxHeight?: number;
  parentId?: string;
  from?: 'all' | 'doc' | 'image' | 'audio' | 'edit';
}

interface SearchTerm {
  query: string;
  limit: number;
}

export interface UserSuggestion {
  id: string;
  name: string;
  email?: string;
  username: string;
  profilePicture?: string;
}

interface RenderSuggestionsParams {
  keyword: string;
  onSuggestionPress: (suggestion: UserSuggestion) => void;
}

// ─────────────────────────────────────────────
// Debounced search function
// ─────────────────────────────────────────────

const handleSearch = _.debounce(
  async (
    searchTerm: SearchTerm,
    chat: string,
    setUsers: React.Dispatch<React.SetStateAction<UserSuggestion[]>>,
  ) => {
    if (searchTerm?.query !== prevSearchTermRef) {
      try {
        prevSearchTermRef = searchTerm.query;

        const crowdMembers = getArrayFromLocalStorage('crowdMembers');

        const query = (searchTerm.query || '').toLowerCase();
        const filtered =
          crowdMembers &&
          crowdMembers[chat]?.filter(
            (item: TCrowdMembers) =>
              item.id !== store.getState().auth.user._id &&
              item.name.toLowerCase().includes(query),
          );

        setUsers(filtered);
      } catch (error) {
        setUsers([]);
      }
    }
  },
  100,
);

let prevSearchTermRef = 'init';

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  chat,
  setText,
  text,
  handleKey,
  isChannel,
  maxHeight,
  parentId,
  from,
}) => {
  const [users, setUsers] = useState<UserSuggestion[]>([]);
  const Colors: TColors = useTheme();
  const inputRef = useRef<TextInput>(null);

  // Reset search reference when chat changes
  useEffect(() => {
    prevSearchTermRef = 'init';
  }, [chat]);

  // Render suggestion list for mentions
  const renderSuggestions = ({
    keyword,
    onSuggestionPress,
  }: RenderSuggestionsParams): JSX.Element => {
    const pattern =
      /^@(?!\[[^\]]+\]\([^\\)]+\))|\s@(?!\[[^\]]+\]\([^\\)]+\))|@$/;
    const pattern2 = /^ +$/;
    if (!pattern.test(text) || pattern2.test(keyword)) {
      return <></>;
    }

    handleSearch(
      {
        query: keyword.toLowerCase(),
        limit: 4,
      },
      chat,
      setUsers,
    );

    const handleSuggestionPress = (item: TCrowdMembers) => {
      // Delay the suggestion press slightly to ensure focus is maintained
      setTimeout(() => {
        onSuggestionPress(item);
      }, 0);

      // Immediately refocus the input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const renderItem = ({item}: {item: TCrowdMembers}) => {
      return (
        <TouchableWithoutFeedback onPress={() => handleSuggestionPress(item)}>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              zIndex: 999,
              borderBottomWidth: 1,
              borderBottomColor: Colors.LineColor,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            {item.profilePicture ? (
              <Image
                source={{uri: item.profilePicture}}
                style={{height: 40, width: 40, borderRadius: 100}}
              />
            ) : (
              <UserIconTwo size={40} />
            )}
            <View style={{flexBasis: '80%'}}>
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.Heading,
                  fontSize: fontSizes.body,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    };

    return (
      <View
        style={[
          {
            zIndex: 999999,
            flexDirection: 'column',
            position: 'absolute',
            top: gGap(
              from === 'all'
                ? -845
                : from === 'doc' || from === 'audio'
                ? -835
                : from === 'image'
                ? -868
                : from === 'edit'
                ? -845
                : -845,
            ),
            width: responsiveScreenWidth(100),
            height: responsiveScreenHeight(100),
            justifyContent: 'flex-end',
            left: responsiveScreenWidth(
              // from === 'all' ? -13.5 : -5

              from === 'all'
                ? -13.5
                : from === 'doc' || from === 'audio'
                ? -5
                : from === 'image'
                ? -8.5
                : from === 'edit'
                ? -3.5
                : -13.5,
            ),
            // backgroundColor: 'red',
          },
        ]}>
        <View
          style={{
            backgroundColor: Colors.PrimaryOpacityColor,
            maxHeight: gHeight(200),
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderWidth: 1,
            borderColor: Colors.Background_color,
          }}>
          <FlatList
            data={[
              ...users,
              {id: 'everyone', name: 'everyone', username: 'everyone'},
            ]}
            contentContainerStyle={{
              padding: 5,
              borderRadius: 10,
            }}
            renderItem={renderItem}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{position: 'relative', width: '92%'}}>
      <MentionInput
        spellCheck
        autoCorrect
        autoCapitalize="sentences"
        keyboardAppearance={theme()}
        multiline
        verticalAlign="bottom"
        textAlignVertical="bottom"
        value={text}
        style={{
          color: Colors.BodyText,
          width: '100%',
          maxHeight: maxHeight || 400,
          minHeight: 50,
          fontSize: RegularFonts.BR,
          paddingVertical: 15,
          textAlignVertical: 'center',
        }}
        onChange={(newText: string) => {
          store.dispatch(
            updateDraftMessages({
              chatId: parentId ? parentId : chat,
              text: newText,
            }),
          );
          setText(newText);
        }}
        placeholder={parentId ? 'Type a reply...' : 'Type a message...'}
        placeholderTextColor={Colors.BodyText}
        inputRef={inputRef}
        onKeyPress={handleKey}
        partTypes={[
          {
            isBottomMentionSuggestionsRender: true,
            trigger: isChannel ? '@' : null,
            renderSuggestions,
            isInsertSpaceAfterMention: true,
            textStyle: {
              fontWeight: 'bold',
              color: theme() === 'light' ? '#238257' : '#2cbf5f',
              borderBottomWidth: 1,
            },
          },
        ]}
      />
    </View>
  );
};

export default ChatMessageInput;
