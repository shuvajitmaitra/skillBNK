import React, {useMemo} from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';

import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import {gGap} from '../../constants/Sizes';
import TextRender from '../../components/SharedComponent/TextRender';
import CommentField from '../../components/CommentCom/CommentField';
import RelatedDocumentsSection from '../../components/Documents/MyDocuments/RelatedDocumentsSection';
import {PressableScale} from '../../components/SharedComponent/PressableScale';
import {goBack, navigate} from '../../navigation/NavigationService';
import {AntDesignIcon} from '../../constants/Icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Priority = 'low' | 'medium' | 'high' | string;

interface UserInfo {
  _id: string;
  profilePicture?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
}

interface AttachmentItem {
  _id?: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string;
  createdAt?: string;
}

export interface DocumentItem {
  _id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category?: string;
  priority?: Priority;
  createdAt: string;
  updatedAt?: string;
  createdBy?: UserInfo;
  user?: UserInfo;
  attachment?: string[];
  attachments?: AttachmentItem[];
  comments?: unknown[];
  program?: string | null;
  session?: string | null;
  tags?: string[];
  branch?: string;
  enrollment?: string;
}

type RootStackParamList = {
  UploadedDocumentsDetailsScreen: {
    item: DocumentItem;
  };
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#34C759',
  medium: '#E9B949',
  high: '#FF5A5F',
};

const getPriorityColor = (priority?: string) => {
  if (!priority) return '#8E8E93';
  return PRIORITY_COLORS[priority.toLowerCase()] || '#8E8E93';
};

const extractPlainTextFromDescription = (description = '') => {
  if (!description) return '';

  try {
    const parsed = JSON.parse(description);
    const texts: string[] = [];

    const walk = (node: any) => {
      if (!node) return;

      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }

      if (typeof node === 'object') {
        if (node.type === 'text' && typeof node.text === 'string') {
          texts.push(node.text);
        }

        if (node.type === 'linebreak') {
          texts.push(' ');
        }

        if (node.children) {
          walk(node.children);
        }
      }
    };

    walk(parsed?.root?.children || parsed);
    return texts.join(' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.log('error', JSON.stringify(error, null, 2));
    return description;
  }
};

const getReadTime = (text = '') => {
  const plainText = extractPlainTextFromDescription(text);
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  return moment(date).format('MMM DD, YYYY • hh:mm A');
};

const formatFileSize = (size?: number) => {
  if (!size) return 'Unknown size';

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileTypeLabel = (type?: string) => {
  if (!type) return 'File';
  if (type.startsWith('image/')) return 'Image';
  if (type.includes('pdf')) return 'PDF';
  return 'File';
};

const InfoCard = ({label, value}: {label: string; value: string | number}) => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const UploadedDocumentsDetailsScreen = () => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const {top} = useSafeAreaInsets();

  const route =
    useRoute<RouteProp<RootStackParamList, 'UploadedDocumentsDetailsScreen'>>();

  const item = route.params?.item;

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Document details not found.</Text>
      </View>
    );
  }

  const creator = item.createdBy || item.user;

  const allAttachments: AttachmentItem[] = [
    ...((item?.attachment ?? []).map(url => ({
      url,
      name: 'Attachment',
      type: 'file',
    })) as AttachmentItem[]),
    ...(item?.attachments ?? []),
  ];

  const thumbnail =
    item?.thumbnail?.trim() ||
    allAttachments.find(file => file?.type?.startsWith('image/'))?.url ||
    'https://via.placeholder.com/1200x700.png?text=Document+Preview';

  const openAttachment = async (url?: string) => {
    if (!url) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log('openAttachment error:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {paddingTop: top}]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.Foreground,
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            padding: 5,
            borderRadius: 100,
            // top: 5,
          }}>
          <AntDesignIcon
            onPress={() => {
              goBack();
            }}
            name={'arrowleft'}
            size={27}
            color={Colors.BodyText}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <PressableScale
            style={{
              backgroundColor: Colors.Primary,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              navigate('AddNewDocumentsScreen', item);
            }}>
            <Text
              style={{
                color: Colors.PureWhite,
                fontFamily: CustomFonts.SEMI_BOLD,
              }}>
              Update
            </Text>
          </PressableScale>
          <PressableScale
            style={{
              backgroundColor: Colors.Red,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              navigate('AddNewDocumentsScreen', item);
            }}>
            <Text
              style={{
                color: Colors.PureWhite,
                fontFamily: CustomFonts.SEMI_BOLD,
              }}>
              Delete
            </Text>
          </PressableScale>
        </View>
      </View>
      <View style={styles.heroCard}>
        <Image source={{uri: thumbnail}} style={styles.heroImage} />

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'Document'}</Text>
        </View>

        <View style={styles.readTimeBadge}>
          <AntDesign name="clockcircleo" size={13} color="#fff" />
          <Text style={styles.readTimeText}>
            {getReadTime(item.description)}
          </Text>
        </View>
      </View>

      <View style={styles.bodyCard}>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

          <View
            style={[
              styles.priorityBadge,
              {backgroundColor: getPriorityColor(item.priority)},
            ]}>
            <Text style={styles.priorityText}>{item.priority || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            {creator?.profilePicture ? (
              <Image
                source={{uri: creator.profilePicture}}
                style={styles.authorImage}
              />
            ) : (
              <Text style={styles.authorInitial}>
                {creator?.fullName?.trim()?.charAt(0) || 'U'}
              </Text>
            )}
          </View>

          <View style={styles.authorInfo}>
            <Text style={styles.authorLabel}>Created by</Text>
            <Text style={styles.authorName}>
              {creator?.fullName?.trim() || 'Unknown Author'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <TextRender text={item.description || 'No description available.'} />

        <View style={styles.infoGrid}>
          <InfoCard label="Category" value={item.category || 'Document'} />
          <InfoCard label="Tags" value={item.tags?.length || 0} />
          <InfoCard label="Comments" value={item.comments?.length || 0} />
          <InfoCard label="Updated" value={formatDate(item.updatedAt)} />
        </View>

        {!!item.tags?.length && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={`${tag}-${index}`} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Attachments</Text>

        {allAttachments.length ? (
          <View style={styles.attachmentList}>
            {allAttachments.map((file, index) => (
              <TouchableOpacity
                key={`${file._id || file.url || file.name}-${index}`}
                activeOpacity={0.85}
                style={styles.attachmentCard}
                onPress={() => openAttachment(file.url)}>
                <View style={styles.attachmentLeft}>
                  <View style={styles.fileIconWrap}>
                    <MaterialIcons
                      name={
                        file.type?.startsWith('image/')
                          ? 'image'
                          : 'insert-drive-file'
                      }
                      size={22}
                      color={Colors.Primary}
                    />
                  </View>

                  <View style={styles.attachmentTextWrap}>
                    <Text style={styles.attachmentTitle} numberOfLines={1}>
                      {file.name || `Attachment ${index + 1}`}
                    </Text>
                    <Text style={styles.attachmentMeta} numberOfLines={1}>
                      {getFileTypeLabel(file.type)} •{' '}
                      {formatFileSize(file.size)}
                    </Text>
                    <Text style={styles.attachmentUrl} numberOfLines={1}>
                      {file.url || 'No URL available'}
                    </Text>
                  </View>
                </View>

                <AntDesign
                  name="arrowright"
                  size={18}
                  color={Colors.BodyText}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyAttachmentBox}>
            <Text style={styles.emptyAttachmentText}>
              No attachments available.
            </Text>
          </View>
        )}
      </View>

      <CommentField postId={item._id} />
      <RelatedDocumentsSection api={'/document/userdocument/get'} />
    </ScrollView>
  );
};

export default UploadedDocumentsDetailsScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    contentContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
    },
    emptyText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
    },
    heroCard: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: Colors.Foreground,
      position: 'relative',
      marginBottom: gGap(14),
    },
    heroImage: {
      width: '100%',
      height: responsiveScreenHeight(28),
      resizeMode: 'cover',
      backgroundColor: '#EAEAEA',
    },
    categoryBadge: {
      position: 'absolute',
      top: 16,
      left: 16,
      backgroundColor: 'rgba(55,55,55,0.72)',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    categoryText: {
      color: '#fff',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      textTransform: 'capitalize',
    },
    readTimeBadge: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: 'rgba(24,24,24,0.78)',
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    readTimeText: {
      color: '#fff',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
    },
    bodyCard: {
      backgroundColor: Colors.Foreground,
      borderRadius: 24,
      padding: responsiveScreenWidth(4),
      marginBottom: responsiveScreenWidth(2),
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    dateText: {
      flex: 1,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
    },
    priorityBadge: {
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 7,
      minWidth: responsiveScreenWidth(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    priorityText: {
      color: '#fff',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.8),
      marginTop: gGap(14),
      lineHeight: responsiveScreenFontSize(3.5),
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: gGap(16),
      paddingVertical: gGap(10),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
    },
    authorAvatar: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(6),
      backgroundColor: Colors.Primary,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    authorImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    authorInitial: {
      color: '#fff',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    authorInfo: {
      marginLeft: gGap(10),
      flex: 1,
    },
    authorLabel: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      marginBottom: 2,
    },
    authorName: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    sectionTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      marginTop: gGap(18),
      marginBottom: gGap(10),
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: gGap(10),
      marginTop: gGap(18),
    },
    infoCard: {
      width: '48%',
      backgroundColor: Colors.Background_color,
      borderRadius: 16,
      padding: responsiveScreenWidth(3.5),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    infoLabel: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      marginBottom: 6,
    },
    infoValue: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.7),
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: gGap(8),
    },
    tagChip: {
      backgroundColor: `${Colors.Primary}50`,
      borderWidth: 1,
      borderColor: `${Colors.Primary}`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
    },
    tagText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
    },
    attachmentList: {
      gap: gGap(10),
    },
    attachmentCard: {
      backgroundColor: Colors.Background_color,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      padding: responsiveScreenWidth(3.5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    attachmentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    fileIconWrap: {
      width: responsiveScreenWidth(11),
      height: responsiveScreenWidth(11),
      borderRadius: 12,
      backgroundColor: `${Colors.Primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    attachmentTextWrap: {
      flex: 1,
    },
    attachmentTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.7),
    },
    attachmentMeta: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.35),
      marginTop: 2,
    },
    attachmentUrl: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.35),
      marginTop: 2,
    },
    emptyAttachmentBox: {
      paddingVertical: responsiveScreenHeight(2.2),
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: Colors.BorderColor,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Background_color,
    },
    emptyAttachmentText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
  });
