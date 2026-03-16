import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TColors} from '../../../types';
import {useTheme} from '../../../context/ThemeContext';

type Priority = 'low' | 'medium' | 'high' | string;

interface CreatedBy {
  _id: string;
  profilePicture?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
}

export interface DocumentItem {
  _id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category?: string;
  priority?: Priority;
  createdAt: string;
  createdBy?: CreatedBy;
}

interface DocumentCardProps {
  item: DocumentItem;
  onPress?: (item: DocumentItem) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: '#34C759',
  medium: '#E9B949',
  high: '#FF5A5F',
};

const getPriorityColor = (priority?: string) => {
  if (!priority) return '#999';
  return PRIORITY_COLORS[priority.toLowerCase()] || '#999';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const DocumentCard: React.FC<DocumentCardProps> = ({item, onPress}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const thumbnail =
    item.thumbnail?.trim() ||
    'https://dummyimage.com/600x400/ffffff/0011ff&text=skillBNK';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => onPress?.(item)}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: thumbnail}} style={styles.image} />

        <View style={styles.topLeftBadge}>
          <Text style={styles.topLeftBadgeText}>
            {item.category || 'Document'}
          </Text>
        </View>

        <View style={styles.readTimeBadge}>
          <Text style={styles.readTimeText}>
            ◉ {getReadTime(item.description)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

          <View style={styles.priorityRow}>
            <Text style={styles.priorityLabel}>Priority: </Text>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: getPriorityColor(item.priority)},
              ]}>
              <Text style={styles.priorityBadgeText}>
                {item.priority || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.readMoreText}>Read More →</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentCard;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: '#1E2228',
      marginBottom: 18,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 5},
      elevation: 6,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    imageWrapper: {
      height: 220,
      position: 'relative',
      backgroundColor: '#F3F4F6',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    topLeftBadge: {
      position: 'absolute',
      top: 16,
      left: 16,
      backgroundColor: 'rgba(110, 120, 118, 0.9)',
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    topLeftBadgeText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    readTimeBadge: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      backgroundColor: 'rgba(30, 30, 30, 0.85)',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    readTimeText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '500',
    },
    content: {
      backgroundColor: '#22262C',
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 22,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      color: '#C6C6C6',
      fontSize: 14,
      flex: 1,
      marginRight: 10,
    },
    priorityRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    priorityLabel: {
      color: '#D0D0D0',
      fontSize: 14,
    },
    priorityBadge: {
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 6,
      minWidth: 72,
      alignItems: 'center',
    },
    priorityBadgeText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
      textTransform: 'capitalize',
    },
    title: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '700',
      marginTop: 12,
    },

    readMoreText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
    },
  });
