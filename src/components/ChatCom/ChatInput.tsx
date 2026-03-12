import React, {FC, forwardRef} from 'react';
import {
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  useMentions,
  TriggersConfig,
  SuggestionsProvidedProps,
} from 'react-native-controlled-mentions';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {theme} from '../../utility/commonFunction';
import {getArrayFromLocalStorage} from '../../utility/mmkvHelpers';

type MentionType = 'mention';

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture: string;
};

const triggersConfig: TriggersConfig<MentionType> = {
  mention: {
    trigger: '@',
    pattern: /(@\[[^[\]]+\]\([^)]+\))/g,
    getTriggerData: (match: string) => {
      const result = match.match(/@\[([^[\]]+)\]\(([^)]+)\)/);

      return {
        original: match,
        trigger: '@',
        name: result?.[1] ?? '',
        id: result?.[2] ?? '',
      };
    },
    getTriggerValue: ({name, id}) => `@[${name}](${id})`,
    textStyle: {
      fontWeight: 'bold',
      color: 'blue',
    },
    getPlainString: ({name}) => `@${name}`,
  },
};

type SuggestionsProps = SuggestionsProvidedProps & {
  data: User[];
};

const Suggestions: FC<SuggestionsProps> = ({keyword, onSelect, data}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  if (keyword == null) {
    return null;
  }

  const filteredUsers = data.filter(user =>
    user.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      <ScrollView>
        {filteredUsers.map(user => (
          <Pressable
            key={user.id}
            onPress={() =>
              onSelect({
                id: user.id,
                name: user.name,
              })
            }
            style={styles.suggestionItem}>
            {user.profilePicture ? (
              <Image
                source={{uri: user.profilePicture}}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
            )}

            <Text style={styles.suggestionText}>{user.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

type ChatInputProps = {
  text: string;
  setText: (text: string) => void;
  chatId: string;
};

const ChatInput = forwardRef<TextInput, ChatInputProps>(
  ({text, setText, chatId}, ref) => {
    const Colors = useTheme();
    const styles = getStyles(Colors);
    const crowdMembers = getArrayFromLocalStorage('crowdMembers')[chatId];

    const {textInputProps, triggers} = useMentions<MentionType>({
      value: text,
      onChange: setText,
      triggersConfig,
    });

    return (
      <View style={styles.container}>
        <Suggestions {...triggers.mention} data={crowdMembers || []} />
        <TextInput
          ref={ref}
          {...textInputProps}
          placeholder="Type a message..."
          multiline
          style={[styles.input, {maxHeight: text.length < 10 ? 50 : 200}]}
          placeholderTextColor={Colors.BodyText}
          keyboardAppearance={theme()}
        />
      </View>
    );
  },
);

export default ChatInput;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {},
    input: {
      paddingVertical: 10,

      fontSize: 16,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    suggestionsContainer: {
      marginBottom: 8,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      backgroundColor: Colors.Background_color,
      overflow: 'hidden',
      maxHeight: 200,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    suggestionText: {
      fontSize: 16,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
    },
    avatarPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ddd',
    },
    avatarPlaceholderText: {
      fontWeight: 'bold',
      color: '#555',
    },
  });
