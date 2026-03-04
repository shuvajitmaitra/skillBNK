import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import Divider from '../SharedComponent/Divider';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import CircularProgress from '../SharedComponent/CricleProgress';

const DayToDayProgress = ({progress, count, limit}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Day to Day Activities</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProgramStack', {screen: 'DayToDayActivities'})
          }>
          <ArrowTopRight />
        </TouchableOpacity>
      </View>

      <Divider marginTop={1} marginBottom={1} />
      <View style={styles.cartContainer}>
        <View style={styles.progress}>
          <CircularProgress
            activeColor={Colors.Primary}
            inActiveColor={Colors.PrimaryOpacityColor}
            progress={progress}
            radius={70}
            strokeWidth={20}
            textColor={Colors.Primary}
            duration={1000}
          />
        </View>
        <View style={{flexGrow: 1}}></View>
        {
          <Text style={styles.details}>
            {count} out of {limit}
          </Text>
        }
      </View>
    </View>
  );
};

export default DayToDayProgress;

const getStyles = Colors =>
  StyleSheet.create({
    progress: {
      alignSelf: 'center',
    },
    details: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1.5),
      textAlign: 'center',
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(4),
      color: Colors.Primary,
    },
    container: {
      backgroundColor: Colors.Foreground,
      // marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: '100%',
      alignItems: 'center',
      // marginTop: responsiveScreenHeight(2),
    },
  });
