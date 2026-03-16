import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {theme} from '../../utility/commonFunction';
import {withOpacity} from '../../components/ChatCom/Mention/utils';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import FilterByDateModal from '../../components/Documents/FilterByDateModal';
import {
  DEFAULT_PAGINATION,
  DocumentItem,
  DocumentsResponse,
  FilterModalInfo,
  PaginationState,
  TColors,
} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {gGap} from '../../constants/Sizes';
import DocumentCard from '../../components/Documents/MyDocuments/MyDocumentsCard';
import {navigate} from '../../navigation/NavigationService';

export default function MyDocumentsScreen() {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const [filterModalInfo, setFilterModalInfo] = useState<FilterModalInfo>({
    isVisible: false,
    selectedDate: '',
  });

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [records, setRecords] = useState<DocumentItem[]>([]);
  const [contents, setContents] = useState<DocumentItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);

  const selectedDate = filterModalInfo.selectedDate;

  const filterDocuments = useCallback(
    (items: DocumentItem[], query: string) => {
      const q = query.trim().toLowerCase();

      if (!q) {
        return items;
      }

      return items.filter(item => (item?.name ?? '').toLowerCase().includes(q));
    },
    [],
  );

  const handleNavigation = useCallback((item: DocumentItem) => {
    navigate('ProgramStack', {
      screen: 'MyDocumentsDetailsScreen',
      params: {item},
    });
  }, []);

  const handleProgramNavigation = useCallback(() => {
    navigate('ProgramStack', {screen: 'Program'});
  }, []);

  const fetchPage = useCallback(
    async (page = 1, isLoadMore = false, passedDate?: string) => {
      try {
        const activeDate = passedDate !== undefined ? passedDate : selectedDate;

        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setInitialLoading(true);
        }

        const params = {
          page,
          limit: 10,
          ...(activeDate ? {date: activeDate} : {}),
        };

        const res = await axiosInstance.get<DocumentsResponse>(
          '/document/mydocuments',
          {params},
        );

        const nextPagination: PaginationState = {
          ...DEFAULT_PAGINATION,
          ...(res?.data?.pagination ?? {}),
        };

        const newItems = res?.data?.documents ?? [];

        setPagination(nextPagination);

        if (isLoadMore) {
          setRecords(prev => [...prev, ...newItems]);
        } else {
          setRecords(newItems);
        }
      } catch (error) {
        console.log('fetchPage error:', error);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedDate],
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    setContents(filterDocuments(records, search));
  }, [records, search, filterDocuments]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearch(text);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchInput(text);
      debouncedSetSearch(text);
    },
    [debouncedSetSearch],
  );

  const onEndReached = useCallback(() => {
    if (search.trim()) return;
    if (loadingMore || initialLoading) return;
    if (!pagination.hasNext) return;

    fetchPage(pagination.currentPage + 1, true);
  }, [
    search,
    loadingMore,
    initialLoading,
    pagination.hasNext,
    pagination.currentPage,
    fetchPage,
  ]);

  const renderItem = useCallback(
    ({item}: {item: DocumentItem}) => (
      <DocumentCard
        item={item}
        onPress={() => {
          handleNavigation(item);
        }}
      />
    ),
    [handleNavigation],
  );

  const keyExtractor = useCallback((item: DocumentItem) => item._id, []);

  const ListFooterComponent = useMemo(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator animating color={Colors.Primary} />
      </View>
    );
  }, [loadingMore, Colors.Primary, styles.footerLoading]);

  if (initialLoading) {
    return (
      <View style={[styles.center, {backgroundColor: Colors.Foreground}]}>
        <ActivityIndicator size={50} animating color={Colors.Primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Documents</Text>
      <Text style={styles.subHeading}>
        Easy Access to your course documents
      </Text>

      <View>
        <View style={styles.searchBox}>
          <TextInput
            keyboardAppearance={theme()}
            onChangeText={handleSearch}
            value={searchInput}
            style={styles.search}
            placeholder="Search..."
            placeholderTextColor={Colors.BodyText}
          />
          <AntDesign name="search1" size={22} color={Colors.BodyText} />
        </View>

        <View style={styles.searchBoxContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setFilterModalInfo(prev => ({...prev, isVisible: true}));
            }}
            style={[
              styles.searchFilter,
              {backgroundColor: withOpacity(Colors.Primary, 0.2)},
            ]}>
            <Text style={[styles.buttonText, {color: Colors.Primary}]}>
              {selectedDate
                ? moment(selectedDate).format('MMM DD, YYYY')
                : 'Filter By Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleProgramNavigation}
            style={styles.searchFilter}>
            <Text style={styles.buttonText}>Go to Bootcamp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={contents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contents.length ? styles.listContent : {flex: 1}}
        ListEmptyComponent={<NoDataAvailable />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={ListFooterComponent}
      />

      <FilterByDateModal
        isVisible={filterModalInfo.isVisible}
        selectedDate={filterModalInfo.selectedDate}
        onClose={() =>
          setFilterModalInfo(prev => ({...prev, isVisible: false}))
        }
        onSelect={(date: string) => {
          setFilterModalInfo(prev => ({
            ...prev,
            selectedDate: date,
            isVisible: false,
          }));
          fetchPage(1, false, date);
        }}
        onClear={() => {
          setFilterModalInfo(prev => ({
            ...prev,
            selectedDate: '',
            isVisible: false,
          }));
          fetchPage(1, false, '');
        }}
      />
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    searchBoxContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(12),
      marginBottom: gGap(8),
    },
    searchBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 50,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      gap: 10,
      alignItems: 'center',
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 12,
      marginTop: 12,
    },
    search: {
      flex: 1,
      height: 50,
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    searchFilter: {
      height: responsiveScreenHeight(5),
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      flex: 1,
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: 'center',
    },
    listContent: {
      paddingBottom: responsiveScreenHeight(2),
      gap: gGap(10),
    },
    footerLoading: {
      paddingVertical: responsiveScreenHeight(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
