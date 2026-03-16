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
  updatedAt?: string;
  createdBy?: CreatedBy;
  attachment?: string[];
  attachments?: string[];
  user?: string[];
  comments?: unknown[];
  program?: string | null;
  session?: string | null;
}

type RootStackParamList = {
  MyDocumentsDetailsScreen: {
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

const getReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  return moment(date).format('MMM DD, YYYY • hh:mm A');
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

const MyDocumentsDetailsScreen = () => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const route =
    useRoute<RouteProp<RootStackParamList, 'MyDocumentsDetailsScreen'>>();

  const item = route.params?.item;

  const allAttachments = [
    ...(item?.attachment ?? []),
    ...(item?.attachments ?? []),
  ];

  const thumbnail =
    item?.thumbnail?.trim() ||
    'https://via.placeholder.com/1200x700.png?text=Document+Preview';

  const openAttachment = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log('openAttachment error:', error);
    }
  };

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Document details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
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
            {item.createdBy?.profilePicture ? (
              <Image
                source={{uri: item.createdBy.profilePicture}}
                style={styles.authorImage}
              />
            ) : (
              <Text style={styles.authorInitial}>
                {item.createdBy?.fullName?.charAt(0) || 'U'}
              </Text>
            )}
          </View>

          <View style={styles.authorInfo}>
            <Text style={styles.authorLabel}>Created by</Text>
            <Text style={styles.authorName}>
              {item.createdBy?.fullName || 'Unknown Author'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <TextRender text={item.description || 'No description available.'} />
        {/* <Text style={styles.description}>
          {item.description || 'No description available.'}
        </Text> */}

        <View style={styles.infoGrid}>
          <InfoCard label="Category" value={item.category || 'Document'} />
          <InfoCard label="Users" value={item.user?.length || 0} />
          <InfoCard label="Comments" value={item.comments?.length || 0} />
          <InfoCard label="Updated" value={formatDate(item.updatedAt)} />
        </View>

        <Text style={styles.sectionTitle}>Attachments</Text>

        {allAttachments.length ? (
          <View style={styles.attachmentList}>
            {allAttachments.map((file, index) => (
              <TouchableOpacity
                key={`${file}-${index}`}
                activeOpacity={0.85}
                style={styles.attachmentCard}
                onPress={() => openAttachment(file)}>
                <View style={styles.attachmentLeft}>
                  <View style={styles.fileIconWrap}>
                    <MaterialIcons
                      name="insert-drive-file"
                      size={22}
                      color={Colors.Primary}
                    />
                  </View>

                  <View style={styles.attachmentTextWrap}>
                    <Text style={styles.attachmentTitle} numberOfLines={1}>
                      Attachment {index + 1}
                    </Text>
                    <Text style={styles.attachmentUrl} numberOfLines={1}>
                      {file}
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
      <CommentField postId={item?._id} />
    </ScrollView>
  );
};

export default MyDocumentsDetailsScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    contentContainer: {
      padding: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(4),
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
    description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      lineHeight: responsiveScreenFontSize(2.7),
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
