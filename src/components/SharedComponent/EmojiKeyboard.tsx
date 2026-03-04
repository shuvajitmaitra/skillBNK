import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {EmojiJSON} from '../../constants/Emojis';
import ReactNativeModal from 'react-native-modal';

// Corrected type definition for EmojiJSON
export type TEmojiJSON = {
  smiles: {name: string; symbol: string}[];
  people: {name: string; symbol: string}[];
  gestures: {name: string; symbol: string}[];
  accessories: {name: string; symbol: string}[];
  animals: {name: string; symbol: string}[];
  food: {name: string; symbol: string}[];
  sport: {name: string; symbol: string}[];
  travel: {name: string; symbol: string}[];
  objects: {name: string; symbol: string}[];
  hearts: {name: string; symbol: string}[];
  flags: {name: string; symbol: string}[];
};

// Type for individual emoji
type Emoji = {
  name: string;
  symbol: string;
  category: string;
};

// Type for category data in FlatList
type Category = {
  category: string;
  emojis: Emoji[];
};

// Props interface
interface EmojiKeyboardProps {
  isVisible: boolean;
  onClose: () => void;
  onEmojiSelect: (symbol: string) => void;
}

// Debounce utility with TypeScript types
const debounce = (func: (text: string) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: [string]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const EmojiKeyboard: React.FC<EmojiKeyboardProps> = ({
  isVisible,
  onClose,
  onEmojiSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300),
    [],
  );

  // Memoized emoji data processing
  const processedEmojis = useMemo<Category[]>(() => {
    const allEmojis: Emoji[] = Object.entries(EmojiJSON).flatMap(
      ([category, emojis]) => emojis.map(emoji => ({...emoji, category})),
    );

    if (!searchQuery) {
      // Group emojis by category when no search query
      return Object.keys(EmojiJSON).map(category => ({
        category,
        emojis: EmojiJSON[category as keyof TEmojiJSON],
      }));
    }

    // Filter across all categories
    const filtered = allEmojis.filter(emoji =>
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Group filtered emojis by category
    const grouped = filtered.reduce((acc: {[key: string]: Emoji[]}, emoji) => {
      const cat = emoji.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(emoji);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, emojis]) => ({
      category,
      emojis,
    }));
  }, [searchQuery]);

  // Render emoji item
  const renderEmoji = useCallback(
    ({item}: {item: Emoji}) => (
      <TouchableOpacity
        style={styles.emojiButton}
        onPress={() => onEmojiSelect(item.symbol)}>
        <Text style={styles.emoji}>{item.symbol}</Text>
      </TouchableOpacity>
    ),
    [onEmojiSelect],
  );

  // Render category section
  const renderCategory = useCallback(
    ({item}: {item: Category}) => (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        <FlatList
          data={item.emojis}
          renderItem={renderEmoji}
          keyExtractor={(emoji, index) => `${item.category}-${index}`}
          numColumns={8}
          scrollEnabled={false}
        />
      </View>
    ),
    [renderEmoji],
  );

  return (
    <ReactNativeModal
      style={{margin: 0, justifyContent: 'flex-end'}}
      isVisible={isVisible}
      onBackdropPress={onClose}>
      <View style={styles.keyboardContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search emojis..."
          onChangeText={handleSearch}
          defaultValue={searchQuery}
        />
        <FlatList
          data={processedEmojis}
          renderItem={renderCategory}
          keyExtractor={item => item.category}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    backgroundColor: '#fff',
    height: '60%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 10,
  },
  searchBar: {
    height: 44,
    margin: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emojiButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default EmojiKeyboard;
