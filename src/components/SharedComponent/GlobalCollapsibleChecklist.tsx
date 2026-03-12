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
  initialSelectedItems?: string[] | null;
}

const normalizeStringArray = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(item => typeof item === 'string');
};

const areArraysEqual = (a: any, b: any): boolean => {
  const arrA = normalizeStringArray(a);
  const arrB = normalizeStringArray(b);

  if (arrA.length !== arrB.length) return false;
  return arrA.every((item, index) => item === arrB[index]);
};

const GlobalCollapsibleChecklist: React.FC<CollapsibleChecklistProps> = ({
  title,
  items = [],
  outerContainerStyle,
  onSelectionChange,
  initialSelectedItems = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    normalizeStringArray(initialSelectedItems),
  );

  const isInternalChangeRef = useRef(false);

  useEffect(() => {
    const normalizedInitial = normalizeStringArray(initialSelectedItems);

    if (
      !isInternalChangeRef.current &&
      !areArraysEqual(selectedItems, normalizedInitial)
    ) {
      setSelectedItems(normalizedInitial);
    }

    isInternalChangeRef.current = false;
  }, [initialSelectedItems, selectedItems]);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const toggleCollapse = (): void => {
    setIsCollapsed(prev => !prev);
  };

  const toggleSelectAll = (): void => {
    isInternalChangeRef.current = true;

    if (selectedItems.length === items.length) {
      setSelectedItems([]);
      onSelectionChange([]);
    } else {
      const allItemIds = items.map(item => item.id);
      setSelectedItems(allItemIds);
      onSelectionChange(allItemIds);
    }
  };

  const handleItemSelect = (itemId: string): void => {
    isInternalChangeRef.current = true;

    setSelectedItems(prev => {
      const exists = prev.indexOf(itemId) !== -1;
      const updatedSelection = exists
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];

      onSelectionChange(updatedSelection);
      return updatedSelection;
    });
  };

  return (
    <View style={[styles.container, outerContainerStyle]}>
      <TouchableOpacity style={styles.header} onPress={toggleCollapse}>
        <View style={styles.titleContainer}>
          <FeatherIcon
            name={isCollapsed ? 'chevron-right' : 'chevron-down'}
            size={30}
            color={Colors.Heading}
            style={styles.chevronIcon}
          />
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
                  selectedItems.indexOf(item.id) !== -1
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                color={
                  selectedItems.indexOf(item.id) !== -1
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
    content: {},
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: gGap(30),
    },
    itemText: {
      fontSize: fontSizes.body,
      color: Colors.BodyText,
    },
  });

export default GlobalCollapsibleChecklist;
