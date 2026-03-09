import React, {FC, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {
  useMentions,
  TriggersConfig,
  SuggestionsProvidedProps,
} from 'react-native-controlled-mentions';

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

    // custom stored format: @[Name](id)
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

    getTriggerValue: ({name, id}) => {
      return `@[${name}](${id})`;
    },

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
    </View>
  );
};

const ChatInput: FC = () => {
  const [textValue, setTextValue] = useState('');
  console.log('textValue', JSON.stringify(textValue, null, 2));

  const users: User[] = [
    {
      id: '611151c15e58a9b155d8fc6b',
      name: 'Md Shimul',
      email: '',
      username: '',
      profilePicture:
        'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1716489262733-1657306025883-r',
    },
    {
      id: '647f05b345b2b400197e4845',
      name: 'Mitul Das',
      email: '',
      username: '',
      profilePicture:
        'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1726243868288-MY_PIC.JPEG',
    },
    {
      id: '654d47f6dde10300195b6f42',
      name: 'Md Shimul',
      email: '',
      username: '',
      profilePicture:
        'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1717074583603-Screenshot-2024',
    },
    {
      id: '65923f41f5366000194c6f84',
      name: 'Ex Employee',
      email: '',
      username: '',
      profilePicture: '',
    },
    {
      id: '67553b04cccc820019c4a577',
      name: 'Shiblu Ahmad',
      email: '',
      username: '',
      profilePicture:
        'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1733639380155-S.JPEG',
    },
  ];

  const {textInputProps, triggers} = useMentions<MentionType>({
    value: textValue,
    onChange: setTextValue,
    triggersConfig,
  });

  return (
    <View style={styles.container}>
      <Suggestions {...triggers.mention} data={users} />

      <TextInput
        {...textInputProps}
        placeholder="Type a message..."
        multiline
        style={styles.input}
      />
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  input: {
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: '#111',
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
