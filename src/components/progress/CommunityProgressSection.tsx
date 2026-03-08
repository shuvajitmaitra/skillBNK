import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import {gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

type Props = {
  community?: {
    success?: boolean;
    results?: {
      totalCommunityPost?: number;
    };
  };
  onPressViewMore?: () => void;
};

const CommunityProgressSection = ({community, onPressViewMore}: Props) => {
  const totalPosts = community?.results?.totalCommunityPost ?? 0;
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrapper}>
          {/* Replace this with your actual icon */}
          <Text style={styles.iconText}>◎</Text>
        </View>
        <Text style={styles.heading}>Community</Text>
      </View>

      <Text style={styles.totalValue}>Total {totalPosts}</Text>
      <Text style={styles.subText}>Total {totalPosts} posts</Text>

      <TouchableOpacity onPress={onPressViewMore} activeOpacity={0.8}>
        <Text style={styles.viewMore}>View More ›</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityProgressSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.Foreground,
      borderRadius: gGap(12),
      width: '100%',
      padding: gGap(12),
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: gGap(12),
    },
    iconWrapper: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: '#F3E8FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    iconText: {
      color: '#A855F7',
      fontSize: 16,
    },
    heading: {
      fontSize: 18,
      fontFamily: 'WorkSans-SemiBold',
      color: '#1A1A1A',
    },
    totalValue: {
      fontSize: 36,
      fontFamily: CustomFonts.SEMI_BOLD,
      color: '#111827',
      marginBottom: 8,
    },
    subText: {
      fontSize: 16,
      fontFamily: 'WorkSans-Regular',
      color: '#7A7A7A',
      marginBottom: 28,
    },
    viewMore: {
      fontSize: 16,
      fontFamily: 'WorkSans-SemiBold',
      color: '#1D4ED8',
    },
  });
