import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {fontSizes, gGap, gPadding} from '../../constants/Sizes';
import {TColors} from '../../types';
import {FeatherIcon, MaterialIcon} from '../../constants/Icons';

// Define interfaces
interface ChecklistItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CollapsibleChecklistProps {
  title: string;
  items: ChecklistItem[];
  icon?: React.ReactNode;
  outerContainerStyle?: ViewStyle;
  onSelectionChange: (item: string[]) => void;
  initialSelectedItems?: string[]; // New prop for preselected items
}

const GlobalCollapsibleChecklist: React.FC<CollapsibleChecklistProps> = ({
  title,
  items,
  outerContainerStyle,
  onSelectionChange,
  initialSelectedItems = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialSelectedItems || [],
  );

  // Track if the update is from internal or external changes
  const isInternalChangeRef = useRef(false);

  // Fix the useEffect to avoid the infinite loop
  useEffect(() => {
    // Only update if not from an internal change and the arrays are different
    if (
      !isInternalChangeRef.current &&
      !areArraysEqual(selectedItems, initialSelectedItems || [])
    ) {
      setSelectedItems(initialSelectedItems || []);
    }
    isInternalChangeRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedItems]);

  // Helper function to compare arrays
  const areArraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSelectAll = (): void => {
    isInternalChangeRef.current = true;
    if (selectedItems.length === items.length) {
      setSelectedItems([]); // Deselect all
      onSelectionChange([]);
    } else {
      const allItemIds = items.map(item => item.id);
      setSelectedItems(allItemIds); // Select all
      onSelectionChange(allItemIds);
    }
  };

  const handleItemSelect = (itemId: string): void => {
    isInternalChangeRef.current = true;
    setSelectedItems(prev => {
      const updatedSelection = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      onSelectionChange(updatedSelection);
      return updatedSelection;
    });
  };

  return (
    <View style={{...styles.container, ...outerContainerStyle}}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={toggleCollapse}>
        <View style={styles.titleContainer}>
          <FeatherIcon
            name={isCollapsed ? 'chevron-right' : 'chevron-down'}
            size={30}
            color={Colors.Heading}
            style={styles.chevronIcon}
          />
          {/* {icon && <View style={styles.iconContainer}>{icon}</View>} */}
          <Text style={styles.title}>{title}</Text>
        </View>
        <MaterialIcon
          onPress={toggleSelectAll}
          name={
            selectedItems.length === items.length && items.length > 0
              ? 'check-box'
              : 'check-box-outline-blank'
          }
          color={
            selectedItems.length === items.length && items.length > 0
              ? Colors.Primary
              : Colors.BodyText
          }
          size={25}
        />
      </TouchableOpacity>

      {/* Content */}
      {!isCollapsed && (
        <View style={styles.content}>
          {items.map((item: ChecklistItem) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => handleItemSelect(item.id)}>
              <View style={{flexDirection: 'row'}}>
                {item?.icon && (
                  <View style={styles.iconContainer}>{item.icon}</View>
                )}
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
              <MaterialIcon
                name={
                  selectedItems.includes(item.id)
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                color={
                  selectedItems.includes(item.id)
                    ? Colors.Primary
                    : Colors.BodyText
                }
                size={25}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {},
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: gPadding(10),
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chevronIcon: {
      marginRight: gPadding(5),
    },
    iconContainer: {
      marginRight: gPadding(5),
    },
    title: {
      fontSize: fontSizes.body,
      fontWeight: '600',
      color: Colors.Heading,
    },
    selectAllCheckbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      // backgroundColor: 'red',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingVertical: gPadding(5),
      marginLeft: gGap(30),
    },
    itemText: {
      fontSize: fontSizes.body,
      color: Colors.BodyText,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default GlobalCollapsibleChecklist;
