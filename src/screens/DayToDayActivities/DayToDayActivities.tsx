import {FlatList, StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {TouchableOpacity} from 'react-native';
import axiosInstance from '../../utility/axiosInstance';
import ActivitiesCard from '../../components/DayToDayActivitiesCom/ActivitiesCard';
import CreateActivitiesModal from '../../components/DayToDayActivitiesCom/CreateActivitiesModal';
import {useDispatch, useSelector} from 'react-redux';
import {initialActivities} from '../../store/reducer/activitiesReducer';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import ConfirmationModal from '../../components/SharedComponent/ConfirmationModal';
import {showToast} from '../../components/HelperFunction';
import {LoadDayToDayActivities} from '../../actions/apiCall';
import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
import PlusIcon from '../../assets/Icons/PlusIcon';
import {RootState} from '../../types/redux/root';
import {TActivities, TColors} from '../../types';
import {theme} from '../../utility/commonFunction';

const DayToDayActivities = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {activities} = useSelector((state: RootState) => state?.activities);
  const [page, setPage] = useState(1);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState({
    state: false,
    id: '',
  });

  const [isCreateActivitiesModalVisible, setIsCreateActivitiesModalVisible] =
    useState(false);
  const toggleCreateActivitiesModal = () => {
    setIsCreateActivitiesModalVisible(!isCreateActivitiesModalVisible);
  };

  const handleDeleteActivities = (id: string) => {
    axiosInstance
      .delete(`communication/delete/${id}`)
      .then(res => {
        if (res.data.success) {
          dispatch(
            initialActivities({
              data: activities?.filter((item: TActivities) => item?._id !== id),
              page: 1,
            }),
          );
          setIsDeleteModalVisible({state: false, id: ''});
          showToast({message: 'Activities deleted'});
        }
      })
      .catch(error => {
        console.log(error);
        console.log(
          'error day to day activities screen',
          JSON.stringify(error, null, 1),
        );
      });
  };

  useEffect(() => {
    LoadDayToDayActivities(page, setIsLoading);
  }, [page]);

  const renderItem = ({item, index}: {item: TActivities; index: number}) => (
    <ActivitiesCard
      handleDeleteActivities={() =>
        setIsDeleteModalVisible({
          state: true,
          id: item._id,
        })
      }
      key={item._id}
      index={index}
      item={item}
      length={activities?.length}
    />
  );

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => toggleCreateActivitiesModal()}
        style={styles.button}>
        {/* <PlusCircle size={30} color={Colors.PureWhite} /> */}
        {/* <Plus color={Colors.PureWhite} size={50} /> */}
        <PlusIcon color={Colors.PureWhite} size={30} />
        {/* <Text style={styles.buttonText}>Create Activities</Text> */}
      </TouchableOpacity>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      {/* <View style={styles.headerContainer}>
      </View> */}
      <Text style={styles.headerText}>Day-to-Day Activities</Text>
      <Text style={styles.subHeading}>
        Document Your Journey: Daily Learning & Activities
      </Text>

      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        contentContainerStyle={styles.cardContainer}
        onEndReached={() => {
          setPage(prev => prev + 1);
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!isLoading ? <NoDataAvailable /> : null}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loading}>
              <LoadingSmall size={20} color={Colors.Primary} />
            </View>
          ) : null
        }
      />
      {isCreateActivitiesModalVisible && (
        <CreateActivitiesModal
          isCreateActivitiesModalVisible={isCreateActivitiesModalVisible}
          setIsCreateActivitiesModalVisible={setIsCreateActivitiesModalVisible}
          toggleCreateActivitiesModal={toggleCreateActivitiesModal}
        />
      )}

      <ConfirmationModal
        isVisible={isDeleteModalVisible.state}
        title={'Activities Delete!'}
        description={'Do you want to delete the day to day Activities?'}
        okPress={() => handleDeleteActivities(isDeleteModalVisible.id)}
        cancelPress={() => setIsDeleteModalVisible({state: false, id: ''})}
      />
    </View>
  );
};

export default DayToDayActivities;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    cardContainer: {
      minWidth: '100%',
      // height: 10,
      backgroundColor: Colors.Background_color,
      // borderRadius: 10,
      paddingHorizontal: 15,
    },
    // buttonText: {
    //   fontFamily: CustomFonts.MEDIUM,
    //   color: Colors.PureWhite,
    //   fontSize: responsiveScreenFontSize(1.8),
    // },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      gap: 10,
      // paddingVertical: 15,
      // paddingHorizontal: 15,
      height: responsiveScreenHeight(6),
      width: responsiveScreenHeight(6),
      borderRadius: 50,
      position: 'absolute',
      right: 15,
      bottom: 15,
      zIndex: 1,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.19,
      shadowRadius: 5.62,
      elevation: 6,
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
      // maxWidth: responsiveScreenWidth(50),
      paddingHorizontal: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: responsiveScreenWidth(4.5),
      // paddingBottom: responsiveScreenHeight(1),
      paddingHorizontal: 15,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      // paddingVertical: responsiveScreenHeight(1),
      // marginTop: responsiveScreenHeight(3),
      position: 'relative',
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingBottom: responsiveScreenHeight(2),
      paddingHorizontal: 15,
    },
    loading: {
      paddingBottom: 10,
      marginTop: -5,
    },
  });
