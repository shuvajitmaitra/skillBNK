// ChapterActionModal.tsx
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {IoniconsIcon} from '../../constants/Icons';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import {TContent} from '../../types/program/programModuleType';

interface ChapterActionModalProps {
  isVisible: boolean;
  onClose: () => void;
  item: TContent;
  onPinPress: () => void;
  onFocusPress: () => void;
  onCompletePress: () => void;
}

const ChapterActionModal: React.FC<ChapterActionModalProps> = ({
  isVisible,
  onClose,
  item,
  onPinPress,
  onFocusPress,
  onCompletePress,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {item.type === 'chapter'
            ? item.chapter?.name || 'Chapter Actions'
            : item.lesson?.title || 'Lesson Actions'}
        </Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onPinPress}>
            <IoniconsIcon
              name={item.isPinned ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={item.isPinned ? Colors.Primary : Colors.BodyText}
            />
            <Text style={styles.actionText}>
              {item.isPinned ? 'Unpin' : 'Pin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onFocusPress}>
            <IoniconsIcon
              name={item.isFocused ? 'eye' : 'eye-outline'}
              size={24}
              color={item.isFocused ? Colors.Primary : Colors.BodyText}
            />
            <Text style={styles.actionText}>
              {item.isFocused ? 'Unfocus' : 'Focus'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCompletePress}>
            <IoniconsIcon
              name={
                item.isCompleted
                  ? 'checkmark-circle'
                  : 'checkmark-circle-outline'
              }
              size={24}
              color={item.isCompleted ? Colors.Primary : Colors.BodyText}
            />
            <Text style={styles.actionText}>
              {item.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChapterActionModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: 30,
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
      color: Colors.Heading,
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    actionContainer: {
      marginVertical: 10,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    actionText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: 16,
      color: Colors.Heading,
      marginLeft: 16,
    },
    cancelButton: {
      marginTop: 16,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      borderRadius: 8,
    },
    cancelText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 16,
      color: Colors.BodyText,
    },
  });
