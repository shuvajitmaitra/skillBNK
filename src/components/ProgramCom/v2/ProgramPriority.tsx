import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import MediumPriorityIcon from '../../../assets/Icons/MediumPriorityIcon';
import PinIcon from '../../../assets/Icons/PinIcon';
import LowPriorityIcon from '../../../assets/Icons/LowPriorityIcon';
import HighPriorityIcon from '../../../assets/Icons/HighPriorityIcon';
import CompleteIcon from '../../../assets/Icons/CompleteIcon';
import IncompleteIcon from '../../../assets/Icons/IncompleteIcon';
import CustomFonts from '../../../constants/CustomFonts';
import {TColors} from '../../../types';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ProgramPriority({
  onPriorityChange,
  category,
}: {
  onPriorityChange: (priority: string) => void;
  category: string;
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority); // Update the selected priority
    onPriorityChange(priority); // Call the parent function to filter data
  };

  useEffect(() => {
    setSelectedPriority('');
  }, [category]);

  return (
    <SafeAreaView
      style={{
        marginVertical: responsiveScreenHeight(1),
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
      }}>
      {/* <View style={styles.container}> */}
      <TouchableOpacity onPress={() => handlePriorityChange('')}>
        <View style={styles.priorityContainer}>
          <CompleteIcon width={12} height={12} />
          <Text
            style={[
              styles.completeText,
              selectedPriority === '' && styles.selectedText,
            ]}>
            - All Module
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePriorityChange('high')}>
        <View style={styles.priorityContainer}>
          <HighPriorityIcon width={12} height={12} />
          <Text
            style={[
              styles.highText,
              selectedPriority === 'high' && styles.selectedText,
            ]}>
            - High Priority
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePriorityChange('medium')}>
        <View style={styles.priorityContainer}>
          <MediumPriorityIcon width={12} height={12} />
          <Text
            style={[
              styles.mediumText,
              selectedPriority === 'medium' && styles.selectedText,
            ]}>
            - Medium Priority
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePriorityChange('low')}>
        <View style={styles.priorityContainer}>
          <LowPriorityIcon width={12} height={12} />
          <Text
            style={[
              styles.lowText,
              selectedPriority === 'low' && styles.selectedText,
            ]}>
            - Low Priority
          </Text>
        </View>
      </TouchableOpacity>
      {/* </View> */}

      {/* <View style={styles.container2}> */}
      <TouchableOpacity onPress={() => handlePriorityChange('pinned')}>
        <View style={styles.priorityContainer}>
          <PinIcon colors={Colors.PureCyan} size={14} />
          <Text
            style={[
              styles.pinnedText,
              selectedPriority === 'pinned' && styles.selectedText,
            ]}>
            - Pinned
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePriorityChange('completed')}>
        <View style={styles.priorityContainer}>
          <CompleteIcon width={12} height={12} />
          <Text
            style={[
              styles.completeText,
              selectedPriority === 'completed' && styles.selectedText,
            ]}>
            - Completed
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePriorityChange('incomplete')}>
        <View style={styles.priorityContainer}>
          <IncompleteIcon width={12} height={12} />
          <Text
            style={[
              styles.incompleteText,
              selectedPriority === 'incomplete' && styles.selectedText,
            ]}>
            - Incomplete
          </Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() =>{}}>
        <View style={styles.priorityContainer}>
          <TranscribeIcon />
          <Text style={styles.text}>- Transcribe</Text>
        </View>
        </TouchableOpacity> */}
      {/* </View> */}
    </SafeAreaView>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container2: {
      flexDirection: 'row',
      gap: 20,
      // justifyContent: "space-between",
      alignItems: 'center',
      marginTop: responsiveScreenWidth(2),
    },
    priorityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    highText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    mediumText: {
      color: '#FFA500',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    lowText: {
      color: Colors.ThemeAnotherButtonColor,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    pinnedText: {
      color: Colors.PureCyan,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    completeText: {
      color: Colors.SuccessColor,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    incompleteText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    // Style for the selected priority (bold and underlined)
    selectedText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      textDecorationLine: 'underline',
    },
  });
