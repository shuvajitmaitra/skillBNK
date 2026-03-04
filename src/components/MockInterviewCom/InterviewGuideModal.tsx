import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ModalCloseButton from '../SharedComponent/ModalCloseButton';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import {fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

const InterviewGuideModal = ({
  isVisible,
  onClose,
  onContinuePress,
}: {
  isVisible: boolean;
  onClose: () => void;
  onContinuePress: () => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [secondsLeft, setSecondsLeft] = useState<number>(300);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onContinuePress();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    // Cleanup on unmount or when secondsLeft hits 0
    return () => clearInterval(interval);
  }, [onContinuePress, secondsLeft]);

  const guideItems = [
    {
      id: 1,
      icon: '📶', // Replace with proper icon component
      iconColor: '#3B82F6',
      title: 'Ensure stable internet connection',
      description: 'Check your connection before starting',
    },
    {
      id: 2,
      icon: '💬',
      iconColor: '#10B981',
      title: 'Answer clearly and calmly',
      description: 'Speak at a moderate pace and articulate well',
    },
    {
      id: 3,
      icon: '🎯',
      iconColor: '#8B5CF6',
      title: 'Understand the question before answering',
      description: 'Take a moment to process each question',
    },
    {
      id: 4,
      icon: '🔇',
      iconColor: '#F59E0B',
      title: 'Avoid background noise & distractions',
      description: 'Find a quiet environment for your interview',
    },
    {
      id: 5,
      icon: '✅',
      iconColor: '#06B6D4',
      title: 'Avoid repetition',
      description: 'Be concise and avoid repeating yourself',
    },
    {
      id: 6,
      icon: '⏰',
      iconColor: '#EF4444',
      title: 'Stay within time limits',
      description: 'Keep track of time for each response',
    },
  ];

  const renderGuideItem = (item: (typeof guideItems)[0]) => (
    <View key={item.id} style={styles.guideItem}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: item.iconColor + '20'},
        ]}>
        <Text style={[styles.icon, {color: item.iconColor}]}>{item.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <ModalCloseButton
            onPress={() => {
              onClose();
            }}
          />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Best Practice Guidelines</Text>
            <Text style={styles.headerSubTitle}>
              Follow these guidelines for a successful interview experience
            </Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {guideItems.map(renderGuideItem)}
          </ScrollView>

          <View style={styles.footer}>
            <Text
              style={{
                color: Colors.BodyText,
                fontFamily: CustomFonts.MEDIUM,
                textAlign: 'center',
                paddingVertical: gGap(5),
              }}>
              Auto Continuing in {secondsLeft}s
            </Text>
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={onContinuePress}>
              <Text style={styles.gotItButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InterviewGuideModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark opacity background
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: Colors.Background_color,
      height: gGap(600),
      width: '90%', // Add width constraint for better centering
      borderRadius: gGap(10), // Add border radius for modern look
      overflow: 'hidden', // Ensure content respects border radius
      padding: gGap(10),
    },
    header: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: fontSizes.heading,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginTop: gGap(10),
      fontFamily: CustomFonts.BOLD,
    },
    headerSubTitle: {
      fontSize: fontSizes.body,
      fontWeight: '500',
      color: Colors.BodyText,
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      gap: gGap(10),
      marginTop: gGap(20),
    },
    guideItem: {
      flexDirection: 'row',
      backgroundColor: Colors.Foreground || '#2A2A2A',
      borderRadius: gGap(5),
      padding: gGap(5),
      alignItems: 'flex-start',
      gap: gGap(10),
    },
    iconContainer: {
      width: gGap(36),
      height: gGap(36),
      borderRadius: gGap(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: gGap(15),
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: fontSizes.subHeading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: '600',
      color: Colors.Heading,
    },
    description: {
      fontSize: fontSizes.small,
      color: Colors.BodyText || '#888',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: gGap(10),
      paddingTop: gGap(0),
      backgroundColor: Colors.Background_color,
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor || '#333',
    },
    gotItButton: {
      backgroundColor: '#3B82F6',
      borderRadius: gGap(8),
      paddingVertical: gGap(10),
      alignItems: 'center',
    },
    gotItButtonText: {
      color: '#FFFFFF',
      fontSize: fontSizes.body,
      fontWeight: '600',
    },
  });
