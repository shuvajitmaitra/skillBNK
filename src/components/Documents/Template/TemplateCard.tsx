import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TColors} from '../../../types';
import {useTheme} from '../../../context/ThemeContext';
import {TemplateItem} from '../../../types/documents/templateTypes';

interface TemplateCardProps {
  item: TemplateItem;
  onPress?: (item: TemplateItem) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const extractTextFromDescription = (description: string) => {
  try {
    const parsed = JSON.parse(description);
    const texts: string[] = [];

    const walk = (node: any) => {
      if (!node) return;

      if (typeof node.text === 'string') {
        texts.push(node.text);
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    };

    walk(parsed?.root);
    return texts.join(' ').trim();
  } catch {
    return description || '';
  }
};

const getReadTime = (description = '') => {
  const text = extractTextFromDescription(description);
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const getThumbnail = (item: TemplateItem) => {
  if (item.thumbnail?.trim()) return item.thumbnail;

  const imageAttachment = item.attachments?.find(att =>
    att.type?.startsWith('image/'),
  );

  return (
    imageAttachment?.url ||
    'https://dummyimage.com/600x400/ffffff/0011ff&text=SkillBNK'
  );
};

const TemplateCard: React.FC<TemplateCardProps> = ({item, onPress}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const thumbnail = getThumbnail(item);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => onPress?.(item)}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: thumbnail}} style={styles.image} />

        <View style={styles.topLeftBadge}>
          <Text style={styles.topLeftBadgeText}>
            {item.category || 'Template'}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {backgroundColor: item.isActive ? '#1FA971' : '#8E8E93'},
          ]}>
          <Text style={styles.statusBadgeText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <View style={styles.readTimeBadge}>
          <Text style={styles.readTimeText}>
            {getReadTime(item.description)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.metaText}>
            {item.attachments?.length || 0} attachment
            {item.attachments?.length === 1 ? '' : 's'}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.authorText} numberOfLines={1}>
          By {item.createdBy?.fullName || 'Unknown'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.discussionText}>
            {item.discussions?.length || 0} discussion
            {item.discussions?.length === 1 ? '' : 's'}
          </Text>
          <Text style={styles.readMoreText}>Open Template →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TemplateCard;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: '#1E2228',
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
    statusBadge: {
      position: 'absolute',
      top: 16,
      right: 16,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    statusBadgeText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700',
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
      marginBottom: 8,
    },
    dateText: {
      color: '#C6C6C6',
      fontSize: 14,
      flex: 1,
      marginRight: 10,
    },
    metaText: {
      color: '#C6C6C6',
      fontSize: 13,
      fontWeight: '500',
    },
    title: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '700',
      marginTop: 6,
    },
    authorText: {
      color: '#B8BDC7',
      fontSize: 15,
      marginTop: 8,
    },
    footerRow: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    discussionText: {
      color: '#9FA6B2',
      fontSize: 14,
      fontWeight: '500',
    },
    readMoreText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
