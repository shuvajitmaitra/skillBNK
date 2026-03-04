import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {Image} from 'react-native';
import whatWeLearnImage from '../../assets/Images/whatYouWillLearn.png';

const WhatLearns = ({whatLearnsData}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [showCount, setShowCount] = useState(6);

  const dataToDisplay = whatLearnsData.slice(0, showCount);
  const handleShowMoreOrLess = () => {
    if (showCount >= whatLearnsData?.length) {
      setShowCount(6);
    } else {
      const nextCount = showCount + 6;
      setShowCount(Math.min(nextCount, whatLearnsData?.length));
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.whatLearnsTitle}>What you'll learn</Text>
      {dataToDisplay?.map(text => (
        <View key={text.key} style={styles.pointContainer}>
          <View style={{paddingTop: 5}}>
            <Feather name="check-circle" size={24} color={Colors.Primary} />
          </View>

          <Text style={styles.learnsPointText}>{text.title}</Text>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleShowMoreOrLess}
        style={styles.showMoreButton}>
        <Text style={styles.showMoreButtonText}>
          {showCount >= whatLearnsData.length ? 'See Less' : 'See More'}
        </Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={whatWeLearnImage} />
      </View>
    </View>
  );
};

export default WhatLearns;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
    },
    showMoreButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      width: responsiveWidth(30),
      marginTop: 20,
    },
    showMoreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      color: Colors.PureWhite,
      paddingVertical: 8,
      fontSize: responsiveFontSize(2),
    },
    pointContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
      marginVertical: 10,
      flex: 1,
      flexWrap: 'wrap',
    },
    whatLearnsTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      marginVertical: 10,
      color: Colors.Heading,
      textAlign: 'left',
    },
    learnsPointText: {
      fontSize: responsiveFontSize(2),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      flex: 1,
    },
    imageContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 30,
    },
    image: {
      height: 380,
      width: '100%',
      resizeMode: 'contain',
    },
  });
