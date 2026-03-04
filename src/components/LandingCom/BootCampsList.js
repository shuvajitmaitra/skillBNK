import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CourseCard from './CourseCard';
import {ActivityIndicator} from 'react-native';
import store from '../../store';
import {useSelector} from 'react-redux';
import {
  setBootCampInformation,
  setCourseInformation,
  setTotalBootCamp,
  setTotalCourse,
} from '../../store/reducer/landingReducer';
import environment from '../../constants/environment';

const BootCampsList = ({type}) => {
  // const slug = "first-org-test"; //"Tech-Serve4-U-LLC";
  const slug = environment.production ? 'Tech-Serve4-U-LLC' : 'first-org-test';
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [programs, setProgram] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {bootCampInformation, courseInformation, totalBootCamp, totalCourse} =
    useSelector(state => state.landing);

  const getPrograms = useCallback(
    async option => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post(`/course/organization/${slug}`, {
          ...option,
        });
        if (type === 'program') {
          store.dispatch(setBootCampInformation(res.data.programs));
          store.dispatch(setTotalBootCamp(res.data.count));
        }
        if (type === 'course') {
          store.dispatch(setCourseInformation(res.data.programs));
          store.dispatch(setTotalCourse(res.data.count));
        }
        setProgram(res.data.programs);
        setTotalCount(res.data.count);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [slug, type],
  );

  useEffect(() => {
    // console.log("hello");
    getPrograms({currentPage, limit, type});
  }, [limit]);

  const getLeftData = () => {
    // setCurrentPage((prev) => prev + 1);
    setLimit(prevLimit => prevLimit + 5);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.bootCampsTitle}>
        {type === 'program' ? 'Bootcamps' : 'Online Course'} (
        <Text>
          {type === 'program' ? totalBootCamp || 0 : totalCourse || 0}
        </Text>
        )
      </Text>
      {/* {type === "course" ? (
        <View style={styles.onlineSearchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={Colors.BodyText}
            value={searchText}
            placeholder="Search Courses"
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color={Colors.PureWhite} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bootCampSearchContainer}>
          <TextInput
            style={styles.branchSearchInput}
            value={searchText}
            placeholderTextColor={Colors.BodyText}
            placeholder="Branch"
            onChangeText={(text) => setSearchText(text)}
          />

          <TextInput
            style={styles.bootCampsSearchInput}
            value={searchText}
            placeholder="Search Courses"
            placeholderTextColor={Colors.BodyText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color={Colors.PureWhite} />
          </TouchableOpacity>
        </View>
      )} */}
      <View style={{marginHorizontal: -20}}>
        <FlatList
          data={type === 'program' ? bootCampInformation : courseInformation}
          renderItem={({item}) => <CourseCard item={item} orgSlug={slug} />}
          keyExtractor={item =>
            item._id ? item._id.toString() : Math.random().toString()
          }
          onEndReached={getLeftData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.activityContainer}>
                <ActivityIndicator
                  size={50}
                  color={Colors.Primary}
                  style={styles.activityIndicator}
                />
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default BootCampsList;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      paddingVertical: 25,
      paddingHorizontal: 20,
      // backgroundColor: "green",
    },
    bootCampSearchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      paddingVertical: 10,
      paddingLeft: 15,
      paddingRight: 10,
    },
    searchButton: {
      backgroundColor: Colors.Primary,
      padding: 8,
      borderRadius: 6,
    },
    branchSearchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 10,
      paddingLeft: 10,
      borderRadius: 10,
      flex: 0.45,
      position: 'relative',
      color: Colors.BodyText,
    },
    bootCampsSearchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 10,
      paddingLeft: 10,
      borderRadius: 10,
      flex: 0.45,
      color: Colors.BodyText,
    },
    bootCampsTitle: {
      fontSize: responsiveScreenFontSize(3.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    onlineSearchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      paddingVertical: 7,
      paddingLeft: 15,
      paddingRight: 10,
    },
    searchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 10,
      paddingLeft: 10,
      borderRadius: 10,
      flex: 0.95,
      color: Colors.BodyText,
    },
    activityContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activityIndicator: {
      marginTop: 20,
    },
  });
