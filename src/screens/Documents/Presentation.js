import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import LockIcon from '../../assets/Icons/LockIcon';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {RegularFonts} from '../../constants/Fonts';
import {formattingDate, theme} from '../../utility/commonFunction';
import {gGap} from '../../constants/Sizes';
import Images from '../../constants/Images';

export default function Presentation() {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation();

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [contents, setContents] = useState([]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    limit: 10,
  });

  const handleNavigation = useCallback(
    contentId => {
      navigation.navigate('PresentationDetailsView', {contentId});
    },
    [navigation],
  );

  const handleProgramNavigation = useCallback(() => {
    navigation.navigate('ProgramStack', {screen: 'Program'});
  }, [navigation]);

  const fetchPage = useCallback(
    async (page, isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadingMore(true);
        else setInitialLoading(true);

        const res = await axiosInstance.get('/content/labcontent', {
          params: {page, limit: pagination.limit},
        });

        const nextPagination = res?.data?.pagination ?? pagination;
        const newItems = res?.data?.contents ?? [];

        setPagination(nextPagination);

        if (isLoadMore) {
          setRecords(prev => [...prev, ...newItems]);
          // if not searching, keep UI list in sync
          setContents(prev => (search ? prev : [...prev, ...newItems]));
        } else {
          setRecords(newItems);
          setContents(newItems);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [pagination, search],
  );

  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    text => {
      setSearch(text);

      const q = text?.trim()?.toLowerCase();
      if (!q) {
        setContents(records);
        return;
      }

      const filtered = records.filter(item =>
        (item?.name ?? '').toLowerCase().includes(q),
      );
      setContents(filtered);
    },
    [records],
  );

  const onEndReached = useCallback(() => {
    // Don’t paginate while searching (optional, but usually expected)
    if (search?.trim()) return;

    if (loadingMore || initialLoading) return;
    if (!pagination?.hasNext) return;

    fetchPage((pagination.currentPage ?? 1) + 1, true);
  }, [search, loadingMore, initialLoading, pagination, fetchPage]);

  const DocumentItem = useCallback(
    ({title, date, id, thumbnail}) => (
      <TouchableOpacity
        onPress={() => handleNavigation(id)}
        activeOpacity={0.8}
        style={styles.documentItemContainer}>
        <Image
          style={styles.documentImg}
          source={!thumbnail ? Images.DEFAULT_IMAGE : {uri: thumbnail}}
        />

        <View style={styles.documentDetails}>
          <Text style={styles.documentTitle}>{title}</Text>
          <Text style={styles.documentDate}>{formattingDate(date)}</Text>

          <View style={styles.readDocContainer}>
            <Text style={styles.readDoc}>Read Document</Text>
            <AntDesign name="arrowright" size={20} color={Colors.Primary} />
          </View>
        </View>
      </TouchableOpacity>
    ),
    [Colors.Primary, handleNavigation, styles],
  );

  const LockDocumentItem = useCallback(
    ({title, date}) => (
      <View style={styles.documentItemContainer}>
        <ImageBackground
          style={styles.documentImg}
          source={require('../../assets/ApplicationImage/MainPage/Presentation/document1.png')}>
          <View style={styles.lockDocumentImg}>
            <LockIcon />
          </View>
        </ImageBackground>

        <View style={styles.documentDetails}>
          <Text style={styles.documentTitle}>{title}</Text>
          <Text style={styles.documentDate}>{formattingDate(date)}</Text>
          <View style={styles.readDocContainer}>
            <Text style={styles.readDocLocked}>Locked</Text>
          </View>
        </View>
      </View>
    ),
    [styles],
  );

  const renderItem = useCallback(
    ({item}) => {
      if (item?.isLocked) {
        return (
          <LockDocumentItem
            title={item?.name}
            date={item?.createdAt}
            thumbnail={item?.thumbnail}
          />
        );
      }

      return (
        <DocumentItem
          id={item?._id}
          title={item?.name}
          date={item?.createdAt}
          thumbnail={item?.thumbnail}
        />
      );
    },
    [DocumentItem, LockDocumentItem],
  );

  const keyExtractor = useCallback(item => item?._id, []);

  const ListFooterComponent = useMemo(() => {
    if (!loadingMore) return;
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
      <Text style={styles.title}>Documents and Labs</Text>
      <Text style={styles.subHeading}>
        Easy Access to Course Documents & Labs
      </Text>

      <View style={styles.searchBoxContainer}>
        <View style={styles.searchBox}>
          <TextInput
            keyboardAppearance={theme()}
            onChangeText={handleSearch}
            value={search}
            style={styles.search}
            placeholder="Search..."
            placeholderTextColor={Colors.BodyText}
          />
          <AntDesign name="search1" size={22} color={Colors.BodyText} />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleProgramNavigation}
          style={styles.searchFilter}>
          <Text style={styles.buttonText}>Go to Bootcamp</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          contents?.length ? styles.listContent : {flex: 1}
        }
        ListEmptyComponent={<NoDataAvailable />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const getStyles = Colors =>
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
      flexDirection: 'row',
      marginVertical: responsiveScreenHeight(2),
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
    },
    searchBox: {
      height: responsiveScreenHeight(5.5),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: responsiveScreenWidth(3),
      flex: 0.65,
    },
    search: {
      flex: 1,
      height: responsiveScreenHeight(5.5),
      paddingLeft: responsiveScreenWidth(4),
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
      flex: 0.35,
      paddingHorizontal: responsiveScreenWidth(2),
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      textAlign: 'center',
    },

    listContent: {
      paddingBottom: responsiveScreenHeight(2),
      gap: gGap(10),
    },

    documentItemContainer: {
      width: responsiveScreenWidth(92),
      paddingVertical: responsiveScreenHeight(2),
      backgroundColor: Colors.Foreground,
      alignSelf: 'center',
      borderRadius: 5,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),
    },
    documentImg: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenWidth(22),
      resizeMode: 'contain',
      borderRadius: 50,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    lockDocumentImg: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenWidth(22),
      backgroundColor: Colors.Heading,
      borderRadius: 50,
      opacity: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    documentDetails: {
      width: responsiveScreenWidth(55),
      marginLeft: responsiveScreenWidth(3),
    },
    documentTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    documentDate: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginTop: responsiveScreenHeight(0.5),
    },
    readDocContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(0.5),
      alignItems: 'center',
    },
    readDoc: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginRight: responsiveScreenWidth(1),
      marginBottom: 1,
    },
    readDocLocked: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginBottom: 1,
    },

    footerLoading: {
      paddingVertical: responsiveScreenHeight(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
