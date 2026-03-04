// ProgramModules.tsx
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import React, {useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import ChapterItem from './ChapterItem';
import {gGap} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import ProgramSearch from './ProgramSearch';
import {TContent} from '../../types/program/programModuleType';
import ChapterActionModal from './ChapterActionModal';
import ProgramFilterModal, {FilterOptions} from './ProgramFilterModal';
import {
  togglePinContent,
  toggleFocusContent,
  toggleCompleteContent,
  setFilterOptions,
  clearFilters,
} from '../../store/reducer/programReducer';

const ProgramModules = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // State for action modal
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TContent | null>(null);

  // State for filter modal
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    selectedCategory,
    chapterModules,
    searchResults,
    isSearching,
    filterOptions,
    isFiltering,
    filteredItems,
  } = useSelector((state: RootState) => state.program);

  // Calculate number of active filters for badge
  const activeFilterCount = useMemo(() => {
    if (!filterOptions) return 0;
    return Object.values(filterOptions).filter(Boolean).length;
  }, [filterOptions]);

  // Get data based on search/filter state
  const parent =
    selectedCategory &&
    (() => {
      if (isFiltering && filteredItems) {
        return filteredItems.parent;
      }
      return chapterModules[selectedCategory?._id]?.parent;
    })();

  // Get child mapping based on filter state
  const childMapping = useMemo(() => {
    if (isFiltering && filteredItems) {
      return filteredItems.childMapping;
    }
    return selectedCategory ? chapterModules[selectedCategory?._id]?.child : {};
  }, [selectedCategory, chapterModules, isFiltering, filteredItems]);

  // Function to handle opening the action modal
  const handleOpenActionModal = (item: TContent) => {
    setSelectedItem(item);
    setIsActionModalVisible(true);
  };

  // Function to handle action buttons in the action modal
  const handlePinPress = () => {
    if (selectedItem) {
      dispatch(togglePinContent(selectedItem._id));
      setIsActionModalVisible(false);
    }
  };

  const handleFocusPress = () => {
    if (selectedItem) {
      dispatch(toggleFocusContent(selectedItem._id));
      setIsActionModalVisible(false);
    }
  };

  const handleCompletePress = () => {
    if (selectedItem) {
      dispatch(toggleCompleteContent(selectedItem._id));
      setIsActionModalVisible(false);
    }
  };

  // Function to handle filter button press
  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  // Function to handle applying filters
  const handleApplyFilters = (options: FilterOptions) => {
    dispatch(setFilterOptions(options));
  };

  // Function to handle clearing filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Function to render items based on search/filter state
  const renderModules = () => {
    if (!parent) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No content available</Text>
        </View>
      );
    }

    if (isSearching && searchResults) {
      if (searchResults.matchedItems.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        );
      }

      // For search results, show all parent items that are in paths to matches
      return parent
        .map((item: TContent) => {
          // Show the item if it's in the path to any match
          if (searchResults.matchedPaths[item._id]) {
            // Pass the matched chapter info and search paths to the component
            return (
              <ChapterItem
                key={item._id}
                item={item}
                isSearchResult={true}
                searchPaths={searchResults.matchedPaths}
                onOpenActionModal={handleOpenActionModal}
              />
            );
          }

          return null;
        })
        .filter(Boolean); // Remove null items
    }

    if (isFiltering) {
      if (parent.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matching items found</Text>
          </View>
        );
      }

      // For filtered items, show all items in the filtered structure
      return parent.map((item: TContent) => (
        <ChapterItem
          key={item._id}
          item={item}
          onOpenActionModal={handleOpenActionModal}
          // Pass custom child mapping for filtered view
          customChildMapping={childMapping}
        />
      ));
    }

    // Regular view (no search or filter)
    return parent.map((item: TContent) => (
      <ChapterItem
        key={item._id}
        item={item}
        onOpenActionModal={handleOpenActionModal}
      />
    ));
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search component with filter button */}
        <ProgramSearch
          onFilterPress={handleFilterPress}
          activeFilters={activeFilterCount}
        />

        <View style={{gap: gGap(5)}}>{renderModules()}</View>
      </ScrollView>

      {/* Action Modal */}
      {selectedItem && (
        <ChapterActionModal
          isVisible={isActionModalVisible}
          onClose={() => setIsActionModalVisible(false)}
          item={selectedItem}
          onPinPress={handlePinPress}
          onFocusPress={handleFocusPress}
          onCompletePress={handleCompletePress}
        />
      )}

      {/* Filter Modal */}
      <ProgramFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        filterOptions={
          filterOptions || {
            showPinned: false,
            showFocused: false,
            showCompleted: false,
            showIncomplete: false,
          }
        }
        onResetFilter={handleClearFilters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default ProgramModules;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    scrollContainer: {
      paddingVertical: gGap(10),
    },
    emptyContainer: {
      padding: gGap(20),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Foreground,
      marginHorizontal: gGap(10),
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    emptyText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 16,
      color: Colors.BodyText,
    },
  });
