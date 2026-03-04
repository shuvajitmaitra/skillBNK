import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';

const EnrollmentCard = ({enrollDetails}) => {
  // console.log("enrollDetails", JSON.stringify(enrollDetails, null, 1));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const isFree = enrollDetails?.course?.price?.isFree;
  const mainPrice = enrollDetails?.course?.price?.cost?.price;
  const disCountPrice = enrollDetails?.course?.price?.cost?.salePrice;
  // console.log(
  //   "isFree from enrollmentCard",
  //   JSON.stringify(enrollDetails, null, 1)
  // );
  return (
    <View style={styles.container}>
      {!isFree ? (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ${disCountPrice >= 0 ? disCountPrice : mainPrice}
          </Text>
          {disCountPrice > 0 && (
            <Text style={styles.discountPrice}>
              ${disCountPrice > 0 ? mainPrice : disCountPrice}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.priceText}>Free</Text>
      )}
      <View style={styles.horizontalLine} />
      <Text style={styles.cardTitleText}>This Course Includes:</Text>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>100+ hours Lectures</Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>
          Instructor: {enrollDetails?.course?.instructor?.name}
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>Assignment (300+)</Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>
          Rating ({parseFloat(enrollDetails?.review?.totalReviews.toFixed(1))})
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>
          Student ({enrollDetails?.studentCount})
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>
          Lesson ({enrollDetails?.totalLesson})
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>Lifetime Access</Text>
      </View>
      <View style={styles.pointContainer}>
        <Text style={styles.pointText}>Certificate of completion</Text>
      </View>
      {/* <TouchableOpacity style={styles.enrollButton}>
        <Text style={styles.enrollButtonText}>Enroll Now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.trailButton}>
        <Text style={styles.trailButtonText}>Enrollment Test</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default EnrollmentCard;

const getStyles = Colors =>
  StyleSheet.create({
    trailButton: {
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Primary,
      borderRadius: 50,
      paddingVertical: 12,
    },
    enrollButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      paddingVertical: 12,
      marginVertical: 20,
    },
    trailButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
      textAlign: 'center',
    },
    enrollButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      textAlign: 'center',
    },
    cardTitleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2.8),
      color: Colors.Heading,
      marginBottom: 10,
    },
    pointText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(2),
      color: Colors.Heading,
    },
    pointContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginVertical: 10,
    },
    horizontalLine: {
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BodyTextOpacity,
      marginVertical: 20,
    },
    container: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      paddingVertical: 30,
      borderRadius: 15,
    },
    discountPrice: {
      textDecorationLine: 'line-through',
      fontSize: responsiveFontSize(2),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    priceText: {
      fontSize: responsiveFontSize(2.5),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
  });
