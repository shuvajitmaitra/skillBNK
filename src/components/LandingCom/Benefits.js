import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';

const Benefits = ({benefitsData}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [showMore, setShowMore] = useState(false);
  const dataToDisplay = showMore ? benefitsData : benefitsData.slice(0, 6);

  return (
    <View style={styles.container}>
      <Text style={styles.benefitsTitle}>Benefits of the course</Text>
      {dataToDisplay?.map(benefit => (
        <View key={benefit._id} style={styles.pointContainer}>
          <Feather
            style={{marginTop: 3}}
            name="check-circle"
            size={24}
            color={Colors.Primary}
          />
          <Text style={styles.benefitsPointText}>{benefit.title}</Text>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setShowMore(!showMore)}
        style={styles.showMoreButton}>
        <Text style={styles.showMoreButtonText}>
          {!showMore ? 'See More' : 'See Less'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Benefits;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 20,
      paddingVertical: 25,
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
    },
    benefitsTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
      paddingBottom: responsiveHeight(1.5),
    },
    benefitsPointText: {
      fontSize: responsiveFontSize(2),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
