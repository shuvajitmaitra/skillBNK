// ProgramFilterModal.tsx
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {IoniconsIcon} from '../../constants/Icons';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import {gGap} from '../../constants/Sizes';

export interface FilterOptions {
  showPinned: boolean;
  showFocused: boolean;
  showCompleted: boolean;
  showIncomplete: boolean;
}

interface ProgramFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  onApplyFilters: (options: FilterOptions) => void;
  onResetFilter: () => void;
}

const ProgramFilterModal: React.FC<ProgramFilterModalProps> = ({
  isVisible,
  onClose,
  filterOptions,
  onApplyFilters,
  onResetFilter,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Local state to manage filter options
  const [localFilterOptions, setLocalFilterOptions] =
    useState<FilterOptions>(filterOptions);

  // Toggle a specific filter option
  const toggleOption = (key: keyof FilterOptions) => {
    setLocalFilterOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    onResetFilter();
    setLocalFilterOptions({
      showPinned: false,
      showFocused: false,
      showCompleted: false,
      showIncomplete: false,
    });
  };

  // Apply filters and close modal
  const applyFilters = () => {
    onApplyFilters(localFilterOptions);
    onClose();
  };

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return Object.values(localFilterOptions).some(value => value);
  };

  // Render a filter option row
  const renderFilterOption = (
    label: string,
    key: keyof FilterOptions,
    iconName: string,
  ) => (
    <TouchableOpacity
      style={styles.filterOption}
      onPress={() => toggleOption(key)}>
      <View style={styles.filterOptionLeft}>
        <IoniconsIcon
          name={iconName}
          size={24}
          color={localFilterOptions[key] ? Colors.Primary : Colors.BodyText}
        />
        <Text style={styles.filterOptionText}>{label}</Text>
      </View>
      <View
        style={[
          styles.checkbox,
          localFilterOptions[key] && styles.checkboxSelected,
        ]}>
        {localFilterOptions[key] && (
          <IoniconsIcon name="checkmark" size={16} color={Colors.Foreground} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Options</Text>
          <TouchableOpacity onPress={onClose}>
            <IoniconsIcon name="close" size={24} color={Colors.BodyText} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterOptionsContainer}>
          <Text style={styles.sectionTitle}>Filter by Status</Text>
          {renderFilterOption('Pinned Items', 'showPinned', 'bookmark')}
          {renderFilterOption('Focused Items', 'showFocused', 'eye')}
          {renderFilterOption(
            'Completed Items',
            'showCompleted',
            'checkmark-circle',
          )}
          {renderFilterOption(
            'Incomplete Items',
            'showIncomplete',
            'ellipse-outline',
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetFilters}
            disabled={!isAnyFilterActive()}>
            <Text
              style={[
                styles.buttonText,
                !isAnyFilterActive() && styles.disabledButtonText,
              ]}>
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={applyFilters}>
            <Text style={[styles.buttonText, styles.applyButtonText]}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProgramFilterModal;

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
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 30,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
      color: Colors.Heading,
    },
    sectionTitle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 16,
      color: Colors.Heading,
      marginVertical: 10,
    },
    filterOptionsContainer: {
      marginVertical: 10,
    },
    filterOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    filterOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterOptionText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: 16,
      color: Colors.Heading,
      marginLeft: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: Colors.Primary,
      borderColor: Colors.Primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: gGap(15),
    },
    button: {
      flex: 1,
      paddingVertical: gGap(10),
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetButton: {
      backgroundColor: Colors.Background_color,
      marginRight: 8,
    },
    applyButton: {
      backgroundColor: Colors.Primary,
      marginLeft: 8,
    },
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 16,
    },
    disabledButtonText: {
      color: Colors.BodyTextOpacity,
    },
    applyButtonText: {
      color: Colors.Foreground,
    },
  });
