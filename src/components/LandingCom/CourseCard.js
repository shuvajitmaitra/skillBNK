import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import {useTheme} from '../../context/ThemeContext';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';

const CourseCard = ({item, orgSlug}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const {title, totalDuration, image, totalReviews, averageStarCount, price} =
    item;
  const handleCourseDetails = () => {
    navigation.navigate('BootCampsDetails', {
      courseId: item._id,
      slug: item.slug,
      orgSlug,
    });
  };
  const disCountPrice = price.cost.salePrice;
  const mainPrice = price.cost.price;
  const roundDuration = Math.floor(totalDuration / 3600);
  const starRating = parseFloat(averageStarCount.toFixed(1));
  // console.log("StarRating card", JSON.stringify(starRating, null, 1));
  // console.log("averageStarCount", JSON.stringify(averageStarCount, null, 1));
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            image && image !== ''
              ? {uri: image}
              : Images.DEFAULT_IMAGE || Images.DEFAULT_IMAGE
          }
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseSubTitle}>
        Total hours: {roundDuration}+h Video Lectures
      </Text>
      <View style={styles.ratingContainer}>
        {starRating > 0 && <Text style={styles.ratingText}>{starRating}</Text>}
        {/* <Rating
          variant="stars"
          rating={starRating}
          disabled={true}
          size={16}
          baseColor={Colors.BodyText}
          fillColor={Colors.StarColor}
        /> */}
        <Text style={styles.totalReviewsText}>({totalReviews})</Text>
      </View>

      {/* <Rating size={40} rating={5} /> */}
      <View style={styles.learnMoreContainer}>
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
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={handleCourseDetails}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CourseCard;

const getStyles = Colors =>
  StyleSheet.create({
    totalReviewsText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(2),
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
    learnMoreText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
    },
    learnMoreButton: {
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 50,
      borderColor: Colors.Primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    learnMoreContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
      color: Colors.Heading,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 10,
      marginBottom: 5,
    },
    courseSubTitle: {
      fontSize: responsiveFontSize(2),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    courseTitle: {
      fontSize: responsiveFontSize(3),
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: 15,
      color: Colors.Heading,
    },
    container: {
      padding: 15,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 10,
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: Colors.Foreground,
    },
    imageContainer: {
      borderRadius: 10,
      height: 200,
      width: '100%',
      overflow: 'hidden',
      backgroundColor: Colors.Primary,
    },
    image: {
      borderRadius: 10,
      height: '100%',
      width: '100%',
    },
  });
