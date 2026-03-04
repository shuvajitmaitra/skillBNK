import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {StatusBar} from 'react-native';
import SntModal from '../../components/ShowNTellCom/SntModal';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {setShowNTell} from '../../store/reducer/showNTellReducer';
import Images from '../../constants/Images';
import EditIconTwo from '../../assets/Icons/EditIcon2';
import BinIcon from '../../assets/Icons/BinIcon';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {getFileTypeFromUri} from '../../components/TechnicalTestCom/TestNow';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import ConfirmationModal from '../../components/SharedComponent/ConfirmationModal';
import {showToast} from '../../components/HelperFunction';
import ImageView from 'react-native-image-viewing';
import PlusCircleIcon from '../../assets/Icons/PlusCircleIcon';
import UpdateSntModal from '../../components/ShowNTellCom/UpdateSntModal';
import {theme} from '../../utility/commonFunction';

export default function ShowAndTellScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [cardData, setCardData] = useState({});
  // console.log('cardData', JSON.stringify(cardData, null, 1));
  const [isLoading, setIsLoading] = useState(false);
  const {showNTell} = useSelector(state => state.showNTell);
  // console.log('showNTell', JSON.stringify(showNTell, null, 1));
  const [isSntModalVisible, setIsSntModalVisible] = useState(false);
  const [isUpdateSntModalVisible, setIsUpdateSntModalVisible] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState({
    state: false,
    id: '',
  });
  const toggleSntModal = () => {
    setIsSntModalVisible(prev => !prev);
  };

  const toggleUpdateSntModal = () => {
    setIsUpdateSntModalVisible(prev => !prev);
  };
  useEffect(() => {
    // console.log('show n tell called');
    setIsLoading(true);
    axiosInstance
      .get('show-tell/myshows')
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          dispatch(setShowNTell(res.data.items));
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error', JSON.stringify(error, null, 1));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteShowNTell = id => {
    axiosInstance
      .delete(`show-tell/delete/${id}`)
      .then(res => {
        if (res.data.success) {
          dispatch(setShowNTell(showNTell?.filter(item => item?._id !== id)));
          setIsDeleteModalVisible({state: false});
          showToast({message: 'ShowNTell deleted'});
        }
      })
      .catch(error => {
        console.log(error);
        console.log('error', JSON.stringify(error, null, 1));
      });
  };

  const toggleImageView = image => {
    setSelectedImage(image);
    setIsImageViewVisible(true);
  };
  const renderItem = ({item, index}) => (
    <View style={styles.sntContainer}>
      <TouchableOpacity
        disabled={getFileTypeFromUri(item?.attachments[0]) !== 'image'}
        onPress={() =>
          getFileTypeFromUri(item?.attachments[0]) === 'image' &&
          toggleImageView(item?.attachments[0])
        }>
        <Image
          source={
            item?.attachments?.length > 0 &&
            getFileTypeFromUri(item?.attachments[0]) === 'image'
              ? {uri: item?.attachments[0]}
              : Images.SNT_DEFAULT
          }
          resizeMode="cover"
          style={styles.bgImg}
        />
      </TouchableOpacity>
      {/* <Image
          // source={Images.SNT_DEFAULT}
          source={
            item?.attachments?.length > 0 &&
            getFileTypeFromUri(item?.attachments[0]) === "image"
              ? { uri: item?.attachments[0] }
              : Images.SNT_DEFAULT
          }
          resizeMode="cover"
          style={styles.bgImg}
        /> */}

      <Text numberOfLines={1} style={styles.title}>
        {item?.title}
      </Text>
      <Text style={styles.statusTitle}>
        Status:{' '}
        <Text
          style={[
            styles.statusText,
            {
              color:
                item?.status === 'accepted'
                  ? Colors.Primary
                  : item?.status === 'pending'
                  ? Colors.PureYellow
                  : item?.status === 'rejected'
                  ? Colors.Red
                  : Colors.BodyText,
            },
          ]}>
          {item?.status}
        </Text>
      </Text>
      <View style={styles.timeContainer}>
        <Text style={styles.date}>
          {moment(item?.date).format('MMM DD, YYYY | h:mm A')}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.agenda}>
        {item.agenda}
      </Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ShowNTellDetails', {
              index,
            });
          }}
          style={styles.btnArea}>
          <Text style={styles.normalText}>View Details</Text>
        </TouchableOpacity>

        <View
          style={[
            {
              gap: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            onPress={() =>
              // item.status === "pending"
              //   ? showAlert({
              //       title: "Coming Soon...",
              //       type: "warning",
              //       message: "Will be available in next update",
              //     })
              //   : showToast("Unable to update")
              {
                toggleUpdateSntModal();
                setCardData(item);
              }
            }
            style={[
              styles.editIcon,
              item.status === 'pending' && {
                backgroundColor: Colors.DisablePrimaryBackgroundColor,
              },
            ]}
            disabled={item.status !== 'pending'}>
            <EditIconTwo
              color={
                item.status === 'pending'
                  ? Colors.Primary
                  : Colors.DisablePrimaryButtonTextColor
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsDeleteModalVisible({state: true, id: item._id})}
            style={styles.deleteIcon}>
            <BinIcon color={Colors.Red} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
        }}>
        <ActivityIndicator color={Colors.Primary} size={40} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <View style={styles.topContainer}>
        <View>
          <Text style={styles.heading}>Show And Tell</Text>
          <Text style={styles.subHeading}>
            Share Your Discoveries and Projects
          </Text>
        </View>
        <TouchableOpacity onPress={toggleSntModal} style={styles.addBtn}>
          <PlusCircleIcon />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docContainer}>
        <FlatList
          data={showNTell}
          renderItem={renderItem}
          // ItemSeparatorComponent={ItemSeparator}
          ListFooterComponent={
            <>
              {showNTell?.length === 0 ? (
                <NoDataAvailable />
              ) : (
                isLoading && <ActivityIndicator />
              )}
            </>
          }
        />
      </View>
      <SntModal
        isSntModalVisible={isSntModalVisible}
        setIsSntModalVisible={setIsSntModalVisible}
        toggleSntModal={toggleSntModal}
      />
      {/* <UpdateSntModal
        isSntUpdateModalVisible={isUpdateSntModalVisible}
        setIsUpdateSntModalVisible={setIsUpdateSntModalVisible}
        toggleUpdateSntModal={toggleUpdateSntModal}
        item={showNTell}
      /> */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible.state}
        title={'Show N Tell Delete!'}
        description={'Do you want to delete the Show N Tell'}
        okPress={() => handleDeleteShowNTell(isDeleteModalVisible.id)}
        cancelPress={() => setIsDeleteModalVisible({state: false})}
      />

      <ImageView
        images={[{uri: selectedImage}]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />

      {isUpdateSntModalVisible && (
        <UpdateSntModal
          isSntUpdateModalVisible={isUpdateSntModalVisible}
          setIsUpdateSntModalVisible={setIsUpdateSntModalVisible}
          toggleUpdateSntModal={toggleUpdateSntModal}
          item={cardData}
        />
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: responsiveScreenWidth(4.5),
      backgroundColor: Colors.Background_color,
      // paddingBottom: 100,
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: responsiveScreenWidth(4),
      // backgroundColor: "red",
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      // paddingBottom: responsiveScreenHeight(1),
    },
    addBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    addBtn: {
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 7,
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      justifyContent: 'center',
    },
    docContainer: {
      // padding: responsiveScreenHeight(2),
      // backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      flexDirection: 'column',
      gap: responsiveScreenHeight(2),
      // maxHeight: responsiveScreenHeight(68),
      paddingBottom: responsiveScreenHeight(6.4),
    },
    sntContainer: {
      paddingHorizontal: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      marginBottom: responsiveScreenHeight(2),
    },
    bgImg: {
      height: responsiveScreenHeight(20),
      width: '98%',
      borderRadius: 5,
      alignSelf: 'center',
      backgroundColor: Colors.Background_color,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      marginVertical: responsiveScreenHeight(0.5),
    },

    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      marginTop: responsiveScreenHeight(1),
    },
    agenda: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(1.5),
    },

    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
      // backgroundColor: "red",
    },
    btnArea: {
      flexDirection: 'row',
      // gap: 10,
      paddingVertical: responsiveScreenHeight(0.7),
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 7,
    },
    normalText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    editIcon: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: 7,
      borderRadius: 5,
    },
    deleteIcon: {
      backgroundColor: Colors.LightRed,
      padding: 7,
      borderRadius: 5,
    },
    statusText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
  });
