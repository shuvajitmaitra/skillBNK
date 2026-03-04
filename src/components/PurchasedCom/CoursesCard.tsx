import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
// import Divider from '../SharedComponent/Divider';
import MyButton from '../AuthenticationCom/MyButton';
import Images from '../../constants/Images';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import {TCourse} from '../../types/courses/courses';
import {TColors} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '../../types/navigation';
import {showToast} from '../HelperFunction';
import {fontSizes, gHeight} from '../../constants/Sizes';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'CourseDetails'
>;

interface CoursesCardProps {
  item: TCourse;
}

const CoursesCard: React.FC<CoursesCardProps> = ({item}) => {
  const navigation = useNavigation<NavigationProp>();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();

  const handlePaymentNavigation = () => {
    if (!item.paid || item?.amount <= 0) {
      return showToast({message: 'No payment available'});
    }
    navigation.navigate('MyPaymentScreen', {
      courseId: item?._id || '',
    });
  };
  return (
    <View style={styles.cardContainer}>
      <Image
        source={
          item?.course?.image
            ? {
                uri: item?.course?.image,
              }
            : Images.DEFAULT_IMAGE
        }
        resizeMode="contain"
        style={styles.cardImage}
      />
      {/* <View style={{borderRadius: 10, overflow: 'hidden'}}>
        <ImageBackground
          source={
            item?.course?.image
              ? {
                  uri: item?.course?.image,
                }
              : Images.DEFAULT_IMAGE
          }
          resizeMode="contain"
          style={styles.cardImage}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text style={styles.imageText}>{item?.course?.title}</Text>
          </View>
        </ImageBackground>
      </View> */}
      <Text style={styles.courseTitle}>{item?.course?.title}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text
          style={[
            styles.statusText,
            {
              color:
                item?.status === 'pending'
                  ? '#EF7817'
                  : item?.status === 'active'
                  ? Colors.SuccessColor
                  : item?.status === 'reject'
                  ? Colors.Red
                  : Colors.Red,
            },
          ]}>
          {item?.status}
        </Text>
      </View>
      <View style={[styles.statusContainer, {gap: 20}]}>
        <View style={styles.subContainer}>
          <Text style={styles.statusTitle}>Total Fee:</Text>
          <Text style={styles.normalText}>${item?.amount}</Text>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.statusTitle}>Paid:</Text>
          <Text style={styles.normalText}>${item?.paid}</Text>
        </View>
      </View>
      {/* <Divider marginBottom={1} marginTop={1} /> */}
      <View style={styles.btnArea}>
        <MyButton
          onPress={handlePaymentNavigation}
          title={'View Payment'}
          bg={
            !item.paid || item?.amount <= 0
              ? Colors.DisableSecondaryBackgroundColor
              : Colors.SecondaryButtonBackgroundColor
          }
          colour={
            !item.paid || item?.amount <= 0
              ? Colors.DisableSecondaryButtonTextColor
              : Colors.SecondaryButtonTextColor
          }
          borderWidth={1}
          height={gHeight(40)}
          fontSize={fontSizes.heading}
        />
        <MyButton
          onPress={() => {
            if (item?.status === 'pending') {
              showAlert({
                title: 'Access Denied',
                type: 'warning',
                message: 'You cannot access the course until it is active.',
              });
            } else {
              navigation.navigate('CourseDetails', {
                slug: item?.course?.slug,
              });
            }
          }}
          title={'Go to Course'}
          bg={Colors.PrimaryButtonBackgroundColor}
          colour={Colors.PrimaryButtonTextColor}
          height={gHeight(40)}
        />
      </View>
    </View>
  );
};

export default CoursesCard;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    btnArea: {
      flexDirection: 'row',
      //   paddingHorizontal: 100,
      //   backgroundColor: "red",
      //   paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      //   paddingVertical: responsiveScreenHeight(2),
      marginTop: 10,
    },
    normalText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusText: {
      fontFamily: CustomFonts.REGULAR,

      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },

    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      //   marginTop: responsiveScreenHeight(0.5),
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: responsiveScreenHeight(0.5),
    },
    courseTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(1),
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
      height: gHeight(200),
      borderRadius: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    cardContainer: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(3),
      borderRadius: 10,
    },
  });
