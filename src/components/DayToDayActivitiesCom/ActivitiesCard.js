import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Divider from '../SharedComponent/Divider';
// import MyButton from "../AuthenticationCom/MyButton";
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
// import ArrowRight from "../../assets/Icons/ArrowRight";
import EditIconTwo from '../../assets/Icons/EditIcon2';
import BinIcon from '../../assets/Icons/BinIcon';
import CreateActivitiesModal from './CreateActivitiesModal';
import {getFileTypeFromUri} from '../TechnicalTestCom/TestNow';
import DocumentIconTwo from '../../assets/Icons/DocumentIconTwo';
import PdfIcon from '../../assets/Icons/PdfIcon';

const ActivitiesCard = ({item, length, index, handleDeleteActivities}) => {
  const navigation = useNavigation();

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isCreateActivitiesModalVisible, setIsCreateActivitiesModalVisible] =
    useState(false);
  const toggleCreateActivitiesModal = () => {
    setIsCreateActivitiesModalVisible(!isCreateActivitiesModalVisible);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          marginBottom:
            length - 1 === index
              ? responsiveScreenHeight(1.5)
              : responsiveScreenHeight(1.5),
          // height: ,
        },
      ]}>
      <View style={styles.cardBannerContainer}>
        {getFileTypeFromUri(item?.attachments[0]) === 'image' ? (
          <Image
            source={{uri: item.attachments[0]}}
            resizeMode="cover"
            style={styles.cardImage}
          />
        ) : getFileTypeFromUri(item?.attachments[0]) === 'pdf' ? (
          <PdfIcon />
        ) : getFileTypeFromUri(item?.attachments[0]) === 'document' ? (
          <DocumentIconTwo />
        ) : (
          <Image
            source={require('../../assets/Images/placeholder-default.png')}
            resizeMode="cover"
            style={styles.cardImage}
          />
        )}
        {/* <ImageBackground
          source={{ uri: item?.attachments[0] }}
          resizeMode="cover"
          style={styles.cardImage}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.imageText}>{item?.title}</Text>
          </View>
        </ImageBackground> */}
      </View>
      <Text numberOfLines={1} style={styles.courseTitle}>
        {item?.title}
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Created By:</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
          <Image
            style={styles.imageSmall}
            source={{uri: item?.sender?.profilePicture}}
          />
          <Text style={styles.statusText}>{item?.sender.fullName}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Date:</Text>
        <Text style={styles.statusText}>
          {moment(item?.createdAt).format('MMM DD, YYYY')}
        </Text>
      </View>
      <Divider marginBottom={0.001} marginTop={1} />
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ActivitiesDetails', {
              index,
            });
          }}
          style={styles.btnArea}>
          <Text style={styles.normalText}>View Details</Text>
        </TouchableOpacity>

        <View style={[styles.statusContainer, {gap: 10}]}>
          <TouchableOpacity
            onPress={() => toggleCreateActivitiesModal()}
            style={styles.editIcon}>
            <EditIconTwo color={Colors.BodyText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteActivities(item?._id)}
            style={styles.deleteIcon}>
            <BinIcon color={Colors.Red} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <CreateActivitiesModal
        action={'update'}
        activityId={item?._id}
        isCreateActivitiesModalVisible={isCreateActivitiesModalVisible}
        setIsCreateActivitiesModalVisible={setIsCreateActivitiesModalVisible}
        toggleCreateActivitiesModal={toggleCreateActivitiesModal}
      />
    </View>
  );
};

export default ActivitiesCard;

const getStyles = Colors =>
  StyleSheet.create({
    cardBannerContainer: {
      borderRadius: 5,
      overflow: 'hidden',
      width: '100%',
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.BodyText,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    imageSmall: {
      width: 20,
      height: 20,
      borderRadius: 100,
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
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    normalText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
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
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: responsiveScreenHeight(0.5),
      // backgroundColor: "red",
    },
    editIcon: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      padding: 7,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    deleteIcon: {
      backgroundColor: Colors.LightRed,
      padding: 7,
      borderRadius: 5,
    },
    courseTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(1),
      flexBasis: '80%',
    },
    imageText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2),
      width: '70%',
      textAlign: 'center',
    },

    cardImage: {
      width: '100%',
      height: 200,
    },
    cardContainer: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(3),
      // marginBottom: responsiveScreenHeight(2),
      borderRadius: 10,
    },
  });
