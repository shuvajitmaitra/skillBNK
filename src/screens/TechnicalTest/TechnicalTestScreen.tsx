import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
  TextInput,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../../components/SharedComponent/CustomDropDownTwo';
import MyButton from '../../components/AuthenticationCom/MyButton';
import CalenderIcon from '../../assets/Icons/CalenderIcon';
import SearchWhiteIcon from '../../assets/Icons/SearchWhiteIcon';
import EyeIcon from '../../assets/Icons/EyeIcon';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import moment from 'moment';
import Images from '../../constants/Images';
import CustomTimePicker from '../../components/SharedComponent/CustomTimePicker';
import {formattingDate, theme} from '../../utility/commonFunction';
import Loading from '../../components/SharedComponent/Loading';
import ReloadIcon from '../../assets/Icons/ReloadIcon';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {technicalTestService} from '../../services/technicalTestService';
import {
  resetPagination,
  setTechnicalTest,
} from '../../store/reducer/TechnicalTestReducer';
import TechnicalTestHeader from '../../components/TechnicalTestCom/TechnicalTestHeader';
import Popover, {Rect} from 'react-native-popover-view';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';

// Define an interface for a technical test assignment
interface IAssignment {
  id: number | string;
  question?: string;
  category?: string;
  workshop?: string;
  dueDate?: string;
  mark?: number;
  submission?: {
    status?: string;
    mark?: number;
  };
}

export default function TechnicalTestScreen(): JSX.Element {
  // Import theme Colors
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const {
    assignments,
    totalTestCount,
    isLoading,
    hasMoreData,
    currentPage,
    testStats,
  } = useSelector((state: RootState) => state.technicalTest);
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  // Local state
  const [isCalendarClicked, setIsCalendarClicked] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [position, setPosition] = useState<{x: number; y: number} | null>(null);
  const [selectedItems, setSelectedItems] = useState('task');

  const fieldEmpty: boolean =
    selectedCategory || selectedType || searchId || date ? false : true;

  // Navigate to the TestNow screen
  const testNowPage = (questionNumber: number): void => {
    navigation.navigate('ProgramStack', {
      screen: 'TestNow',
      params: {data: assignments, questionNumber},
    });
  };

  const getStatusStyle = (stat: string): {color: string} => {
    switch (stat) {
      case 'Not Answered':
        return {color: '#097EF2'};
      case 'accepted':
        return {color: '#27AC1F'};
      case 'pending':
        return {color: '#FF9900'};
      case 'rejected':
        return {color: '#F34141'};
      default:
        return {color: 'black'};
    }
  };

  useEffect(() => {
    technicalTestService.loadTechnicalTest({
      page: 1,
      category: selectedItems,
    });
    return () => {
      dispatch(setTechnicalTest({assignments: [], data: {page: 1}}));
      dispatch(resetPagination());
    };
  }, [dispatch, selectedItems]);

  const showCalendar = (): void => {
    setIsCalendarClicked(true);
  };

  const statusOptions: string[] = ['Accepted', 'Pending', 'Rejected'];
  const typeOptions: string[] = ['Answered', 'Not Answered'];

  const selectedStatus: string =
    (status === 'Accepted' && 'accepted') ||
    (status === 'Rejected' && 'rejected') ||
    (status === 'Pending' && 'pending') ||
    '';
  const type: string =
    (selectedType === 'Answered' && 'answered') ||
    (selectedType === 'Not Answered' && 'notanswered') ||
    '';

  // Prepare search data
  const searchData = {
    category: selectedItems,
    limit: 5,
    page: 1,
    query: searchId,
    status: selectedStatus,
    type,
    sort: '',
  };

  const renderItem = ({item, index}: {item: IAssignment; index: number}) => (
    <View style={styles.technicalTestContainer}>
      <View
        style={{
          flexDirection: 'row',
          gap: gGap(10),
          marginBottom: gGap(10),
          alignItems: 'center',
        }}>
        <Image source={Images.TECHNICAL_TEST} style={styles.imgStyle} />
        <Text style={styles.technicalTest}>
          {item.question && item.question.length > 50
            ? `${item.question.slice(0, 50)}...`
            : item.question || 'No Question Available'}
        </Text>
      </View>
      <View style={styles.allDataContainer}>
        <View style={styles.testDataHeading}>
          <Text style={styles.marks}>ID:</Text>
          <Text style={styles.marks}>Category:</Text>
          <Text style={styles.marks}>Workshop:</Text>
          <Text style={styles.marks}>Deadline:</Text>
          <Text style={styles.marks}>Total Marks:</Text>
          {item.submission?.status && <Text style={styles.marks}>Status:</Text>}
          {typeof item.submission?.mark !== 'undefined' && (
            <Text style={styles.marks}>Obtained Mark:</Text>
          )}
        </View>
        <View style={styles.testDataHeadingText}>
          <Text style={styles.number}>#{item.id || 'N/A'}</Text>
          <Text style={styles.number}>
            {(item.category === 'task' && 'Technical Task') ||
              (item.category === 'assignment' && 'Technical Assignment') ||
              (item.category === 'question' && 'Technical Questions') ||
              item.category ||
              'N/A'}
          </Text>
          <Text style={styles.number}>
            {item.workshop ? formattingDate(item.workshop) : 'N/A'}
          </Text>
          <Text style={styles.number}>
            {item.dueDate ? formattingDate(item.dueDate) : 'Not specified'}
          </Text>
          <Text style={styles.number}>
            {item.mark !== undefined ? item.mark : 'N/A'}
          </Text>
          {item.submission?.status && (
            <Text
              style={[styles.status, getStatusStyle(item.submission.status)]}>
              {item.submission.status || 'N/A'}
            </Text>
          )}
          {typeof item.submission?.mark !== 'undefined' && (
            <Text style={styles.number}>
              {item.submission.mark === 0
                ? 'No Mark'
                : item.submission.mark ?? 'N/A'}
            </Text>
          )}
        </View>
      </View>
      <MyButton
        onPress={() => testNowPage(index)}
        title={item.submission?.status ? 'Update Answer' : 'Answer'}
        bg={Colors.Primary}
        colour={Colors.PureWhite}
        flex={1}
        width={'100%'}
      />
    </View>
  );
  const baseStyles: ViewStyle = {
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: borderRadius.small,
  };

  // Conditional styles
  const conditionalStyles: ViewStyle =
    selectedType === 'Answered'
      ? {
          flex: 1, // Example: Full flex when Answered
        }
      : {
          width: '100%', // Example: Half width otherwise
        };

  const renderFooter = () =>
    currentPage !== 1 && hasMoreData ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    ) : null;

  const handleLoadMore = () => {
    if (assignments.length < totalTestCount!) {
      technicalTestService.loadTechnicalTest({
        page: currentPage,
        category: selectedItems,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TechnicalTestHeader
        onFilterPress={d => {
          setPosition(d);
        }}
        navigation={navigation}
      />
      {Boolean(position) && (
        <Popover
          from={
            new Rect(responsiveScreenWidth(100) / 2, position?.y ?? 0, 0, 0)
          }
          popoverStyle={{padding: 0, margin: 0, backgroundColor: 'transparent'}}
          onRequestClose={() => setPosition(null)}
          isVisible={Boolean(position)}>
          <View style={styles.searchContainer}>
            <TextInput
              keyboardAppearance={theme()}
              style={styles.input}
              placeholder="Search Id"
              placeholderTextColor={Colors.BodyText}
              value={searchId}
              onChangeText={text => setSearchId(text)}
            />
            <View style={styles.inputContainer2}>
              <CustomDropDownTwo
                placeholder="Type"
                data={typeOptions}
                state={selectedType}
                setState={setSelectedType}
                background={Colors.Background_color}
                containerStyle={{...baseStyles, ...conditionalStyles}}
              />
              {selectedType === 'Answered' && (
                <CustomDropDownTwo
                  flex={1}
                  placeholder="All Status"
                  data={statusOptions}
                  state={status}
                  setState={setStatus}
                  background={Colors.Background_color}
                  itemContainer={{top: gGap(30)}}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={showCalendar}
              activeOpacity={0.5}
              style={[styles.input]}>
              <Text style={styles.input2}>
                {date ? moment(date).format('MMM DD, YYYY') : 'Workshop'}
              </Text>
              <CalenderIcon size={18} color={Colors.BodyText} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (!fieldEmpty) {
                    technicalTestService.loadTechnicalTest(searchData);
                  }
                }}
                style={[
                  styles.searchBtn,
                  fieldEmpty && {
                    backgroundColor: Colors.DisablePrimaryBackgroundColor,
                  },
                ]}
                disabled={fieldEmpty}>
                <SearchWhiteIcon
                  color={
                    fieldEmpty
                      ? Colors.DisablePrimaryButtonTextColor
                      : Colors.PureWhite
                  }
                />
                <Text
                  style={[
                    styles.viewBtnText,
                    fieldEmpty && {
                      color: Colors.DisablePrimaryButtonTextColor,
                    },
                  ]}>
                  Search
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchId('');
                  setSelectedCategory('');
                  setSelectedType('');
                  setStatus('');
                  setDate('');
                  technicalTestService.loadTechnicalTest({
                    page: 1,
                    category: selectedItems,
                  });
                }}
                style={[
                  styles.searchBtn,
                  {
                    backgroundColor: Colors.PrimaryButtonBackgroundColor,
                  },
                ]}>
                <ReloadIcon color={Colors.PrimaryButtonTextColor} />
                <Text
                  style={[
                    styles.viewBtnText,
                    {
                      color: Colors.PrimaryButtonTextColor,
                    },
                  ]}>
                  {fieldEmpty ? 'Reload' : 'Reset'}
                </Text>
              </TouchableOpacity>
            </View>
            {isCalendarClicked && (
              <CustomTimePicker
                mode="date"
                setDate={dateString =>
                  dateString ? setDate(dateString) : setDate('')
                }
                isPickerVisible={isCalendarClicked}
                setIsPickerVisible={setIsCalendarClicked}
                showPreviousDate={true}
              />
            )}
          </View>
        </Popover>
      )}
      <>
        {/* Top Section */}
        <View style={styles.headingContainer}>
          <View style={{width: '65%'}}>
            <Text style={styles.title}>Technical Test</Text>
            <Text style={styles.text}>
              View all Technical Tests related to my program
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProgramStack', {
                screen: 'ViewStatus',
                params: {assignments},
              });
            }}
            style={styles.viewBtn}>
            <EyeIcon color={Colors.PureWhite} />
            <Text style={styles.viewBtnText}>View Status</Text>
          </TouchableOpacity>
        </View>
      </>
      <StatusBar
        translucent
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          disabled={selectedItems === 'task'}
          onPress={() => {
            selectedItems !== 'task' && setSelectedItems('task');
          }}
          style={[
            styles.tabItemContainer,
            selectedItems === 'task' && {backgroundColor: Colors.Primary},
          ]}>
          <Text
            style={[
              styles.tabItemText,
              selectedItems === 'task' && {
                color: Colors.PrimaryButtonTextColor,
              },
            ]}>
            Tasks ({testStats?.totalTechnicalTasks})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={selectedItems === 'assignment'}
          onPress={() => {
            selectedItems !== 'assignment' && setSelectedItems('assignment');
          }}
          style={[
            styles.tabItemContainer,
            selectedItems === 'assignment' && {backgroundColor: Colors.Primary},
          ]}>
          <Text
            style={[
              styles.tabItemText,
              selectedItems === 'assignment' && {
                color: Colors.PrimaryButtonTextColor,
              },
            ]}>
            Assignments ({testStats?.totalTechnicalAssignments})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={selectedItems === 'question'}
          onPress={() => {
            selectedItems !== 'question' && setSelectedItems('question');
          }}
          style={[
            styles.tabItemContainer,
            selectedItems === 'question' && {backgroundColor: Colors.Primary},
          ]}>
          <Text
            style={[
              styles.tabItemText,
              selectedItems === 'question' && {
                color: Colors.PrimaryButtonTextColor,
              },
            ]}>
            Questions ({testStats?.totalTechnicalQuestions})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={assignments}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<NoDataAvailable />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            paddingBottom: responsiveScreenHeight(2),
            paddingHorizontal: gGap(15),
          }}
        />
      )}
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabItemContainer: {
      flex: 1,
      alignItems: 'center',
      height: gGap(30),
      justifyContent: 'center',
      borderRadius: borderRadius.default,
      paddingHorizontal: gGap(5),
    },
    tabItemText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.small,
      fontWeight: '500',
      textAlign: 'center',
    },
    tabContainer: {
      backgroundColor: Colors.Foreground,
      height: gGap(40),
      marginHorizontal: gGap(10),
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
      flexDirection: 'row',
      alignItems: 'center',
    },
    testDataHeadingText: {
      gap: 10,
    },
    testDataHeading: {
      gap: 10,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: gGap(10),
    },
    title: {
      fontSize: fontSizes.largeTitle,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    allTitle: {
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingBottom: responsiveScreenHeight(1),
    },
    itemContainer: {
      width: responsiveScreenWidth(100),
      alignSelf: 'center',
      paddingTop: 10,
      paddingHorizontal: responsiveScreenWidth(3),
    },
    technicalTestContainer: {
      backgroundColor: Colors.Foreground,
      zIndex: 1,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    technicalTest: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.heading,
      color: Colors.Heading,
      fontWeight: '600',
      width: gGap(270),
    },
    allDataContainer: {
      backgroundColor: Colors.Background_color,
      padding: 10,
      borderRadius: responsiveScreenWidth(2),
      flexDirection: 'row',
      marginBottom: 10,
    },
    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.small,
      paddingBottom: 10,
      textAlign: 'left',
    },
    marks: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      width: responsiveScreenWidth(28),
    },
    number: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    status: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      paddingBottom: responsiveScreenHeight(1),
      textTransform: 'capitalize',
    },
    viewBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.PureWhite,
    },
    viewBtn: {
      // width: responsiveScreenWidth(35),
      width: '35%',
      paddingVertical: 7,
      borderRadius: borderRadius.small,
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: gGap(5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      borderRadius: borderRadius.default,
      width: responsiveScreenWidth(90),
      gap: gGap(10),
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 3,
    },
    inputContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 2,
    },
    input: {
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      fontFamily: CustomFonts.REGULAR,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: responsiveScreenFontSize(2),
      paddingHorizontal: gGap(10),
      paddingVertical: gGap(6),
    },
    input2: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      zIndex: -2,
      fontSize: responsiveScreenFontSize(2),
    },
    searchBtn: {
      width: responsiveScreenWidth(40),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgStyle: {
      width: gGap(40),
      height: gGap(40),
    },
    footerLoader: {
      paddingVertical: responsiveScreenHeight(2),
      alignItems: 'center',
    },
  });
