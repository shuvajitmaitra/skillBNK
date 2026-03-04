import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utility/axiosInstance";
import ReviewsCard from "./ReviewsCom/ReviewsCard";
import NoDataAvailable from "../SharedComponent/NoDataAvailable";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";

const ReviewsBody = ({ courseId, categories, type, category, setLimit, limit }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [reviewsData, setReviewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(null);
  const getCourseData = async (options) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/course/review/get/${courseId}`, {
        params: options,
      });
      setReviewsData(res.data);
      setReviewCount(res.data.count);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourseData({
      fields: [categories, type],
      page: 1,
      limit: limit,
      category: category ? category : "",
    });
  }, [category, limit]);

  const handleShowMoreOrLess = () => {
    if (reviewCount <= limit) {
      setLimit(3);
    } else {
      setLimit(limit + 3);
    }
  };
  return reviewsData?.reviews && reviewsData?.reviews?.length > 0 ? (
    <View style={styles.container}>
      {reviewsData?.reviews?.map((review) => (
        <ReviewsCard key={review._id} review={review} />
      ))}
      <TouchableOpacity onPress={handleShowMoreOrLess} style={styles.showMoreButton}>
        <Text style={styles.showMoreButtonText}>{reviewCount <= limit ? "See Less" : "See More"}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <NoDataAvailable />
  );
};

export default ReviewsBody;

const getStyles = (Colors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      gap: 10,
    },
    container: {
      marginTop: 30,
    },
    showMoreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: "center",
      color: Colors.PureWhite,
      paddingVertical: 8,
      fontSize: responsiveFontSize(2),
    },
    showMoreButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      width: responsiveWidth(30),
      marginTop: 20,
    },
  });
