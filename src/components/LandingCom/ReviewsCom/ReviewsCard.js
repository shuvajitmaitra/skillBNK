import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { RegularFonts } from '../../../constants/Fonts';
import { Image } from 'react-native';
import HorizontalLine from '../../../constants/HorizontalLine';
import DefaultUserIcon from '../../../assets/Icons/DefaultUserIcon';
// import {Rating} from '@kolking/react-native-rating';

const ReviewsCard = ({ review }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const date = new Date(review.createdAt);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const profileImage = review?.reviewedBy?.profilePicture;
  return (
    <View key={review._id}>
      <View style={styles.profileContainer}>
        {profileImage && profileImage !== '' ? (
          <Image style={styles.image} source={{ uri: profileImage }} />
        ) : (
          <DefaultUserIcon />
        )}

        <Text style={styles.profileTitleText} key={review._id}>
          {review?.reviewedBy?.fullName}
        </Text>
      </View>
      {/* <Rating
        style={{marginTop: 15}}
        variant="stars"
        rating={review?.starCount}
        disabled={true}
        size={16}
        baseColor={Colors.BodyText}
        fillColor={Colors.StarColor}
      /> */}
      <Text style={styles.dateText}>{formattedDate}</Text>
      <Text style={styles.reviewsDescription}>{review?.text}</Text>
      <HorizontalLine />
    </View>
  );
};

export default ReviewsCard;

const getStyles = Colors =>
  StyleSheet.create({
    image: {
      height: 40,
      width: 40,
      borderRadius: 50,
    },
    profileContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    ratingContainer: {
      alignItems: 'baseline',
    },
    ratingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveFontSize(2),
    },
    profileTitleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
    },
    reviewsDescription: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(1.8),
      lineHeight: 20,
    },
    dateText: {
      marginVertical: 10,
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveFontSize(2),
    },
  });
