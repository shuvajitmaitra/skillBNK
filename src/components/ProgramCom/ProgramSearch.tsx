// ProgramSearch.tsx
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {IoniconsIcon} from '../../constants/Icons';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {
  setSearchResults,
  clearSearchResults,
} from '../../store/reducer/programReducer';
import {searchProgramData} from '../../utility/programSearchUtils';

interface ProgramSearchProps {
  onFilterPress: () => void;
  activeFilters: number;
}

const ProgramSearch: React.FC<ProgramSearchProps> = ({
  onFilterPress,
  activeFilters,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const {selectedCategory, chapterModules} = useSelector(
    (state: RootState) => state.program,
  );

  // Debounce function to prevent excessive searches
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  // Perform the search with optimized algorithm
  const handleSearch = () => {
    if (!debouncedSearchTerm.trim()) {
      dispatch(clearSearchResults());
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Small timeout to allow UI to show loading state
    setTimeout(() => {
      if (selectedCategory && chapterModules[selectedCategory._id]) {
        const results = searchProgramData(
          debouncedSearchTerm,
          chapterModules,
          selectedCategory._id,
        );
        dispatch(setSearchResults(results));
      }
      setIsSearching(false);
    }, 100);
  };

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch();

    // When search query is empty, explicitly clear search results
    // This will ensure all chapters collapse when search is cleared
    if (!debouncedSearchTerm.trim()) {
      dispatch(clearSearchResults());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          {isSearching ? (
            <ActivityIndicator size="small" color={Colors.Primary} />
          ) : (
            <IoniconsIcon name="search" size={20} color={Colors.BodyText} />
          )}
          <TextInput
            style={styles.input}
            placeholder="Search chapters and lessons..."
            placeholderTextColor={Colors.BodyTextOpacity}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                dispatch(clearSearchResults());
              }}>
              <IoniconsIcon
                name="close-circle"
                size={20}
                color={Colors.BodyText}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}>
          <IoniconsIcon
            name="filter"
            size={20}
            color={activeFilters > 0 ? Colors.Primary : Colors.BodyText}
          />
          {activeFilters > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {debouncedSearchTerm.length > 0 && (
        <Text style={styles.searchInfo}>
          Click on a chapter to see all its content
        </Text>
      )}
    </View>
  );
};

export default ProgramSearch;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: gGap(10),
      marginBottom: gGap(10),
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      borderRadius: borderRadius.default,
      paddingHorizontal: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      height: 45,
    },
    input: {
      flex: 1,
      paddingHorizontal: gGap(10),
      fontSize: fontSizes.body,
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    filterButton: {
      backgroundColor: Colors.Foreground,
      width: 45,
      height: 45,
      borderRadius: borderRadius.default,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      position: 'relative',
    },
    filterBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    filterBadgeText: {
      color: Colors.Foreground,
      fontSize: 12,
      fontFamily: CustomFonts.BOLD,
    },
    searchInfo: {
      color: Colors.BodyText,
      fontSize: fontSizes.small,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'center',
      marginTop: 5,
      fontStyle: 'italic',
    },
  });
