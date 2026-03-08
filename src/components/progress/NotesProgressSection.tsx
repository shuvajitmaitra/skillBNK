import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RNText from '../SharedComponent/RNText';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import {gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

type NotesProgressData = {
  _id?: string;
  id?: string;
  title?: string;
  limit?: number;
  count?: number;
  additionalData?: {
    totalNotes?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type Props = {
  data?: NotesProgressData;
  onPressViewMore?: () => void;
};

const NotesProgressSection = ({data, onPressViewMore}: Props) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const title = data?.title ?? 'Notes';
  const totalNotes = data?.additionalData?.totalNotes ?? data?.count ?? 0;
  const limit = data?.limit ?? 0;
  const progress = limit > 0 ? Math.min((totalNotes / limit) * 100, 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrapper}>
          <RNText style={styles.iconText}>✎</RNText>
        </View>
        <RNText style={styles.heading}>{title}</RNText>
      </View>

      <RNText style={styles.totalValue}>Total Notes {totalNotes}</RNText>
      <RNText style={styles.subText}>
        {totalNotes} of {limit} notes used
      </RNText>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress}%`}]} />
      </View>

      <TouchableOpacity onPress={onPressViewMore} activeOpacity={0.8}>
        <RNText style={styles.viewMore}>View More ›</RNText>
      </TouchableOpacity>
    </View>
  );
};

export default NotesProgressSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.Foreground,
      borderRadius: 16,
      padding: gGap(12),
      width: '100%',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#E8F0FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    iconText: {
      fontSize: 16,
      fontFamily: 'WorkSans-SemiBold',
      color: '#2563EB',
    },
    heading: {
      fontSize: 20,
      fontFamily: 'WorkSans-SemiBold',
      color: Colors.Heading,
    },
    totalValue: {
      fontSize: 38,
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginBottom: 6,
    },
    subText: {
      fontSize: 15,
      fontFamily: 'WorkSans-Regular',
      color: Colors.BodyText,
      marginBottom: 18,
    },
    progressTrack: {
      width: '100%',
      height: 10,
      borderRadius: 999,
      backgroundColor: '#DCE4F2',
      overflow: 'hidden',
      marginBottom: 24,
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: '#2563EB',
    },
    viewMore: {
      fontSize: 16,
      fontFamily: 'WorkSans-SemiBold',
      color: '#1D4ED8',
    },
  });
