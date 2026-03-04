import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import {useTheme} from '../../context/ThemeContext';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CircularProgress from '../SharedComponent/CricleProgress';

const CalendarProgressCart = ({title, value, percentage, color}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: responsiveScreenHeight(0.5),
          marginLeft: responsiveScreenWidth(1),
          // backgroundColor: "red",
        }}>
        {title === 'Accepted' && (
          <Image
            style={styles.image}
            source={require('../../assets/Images/checkGreen.png')}
          />
        )}
        {title === 'Denied' && (
          <Image
            style={styles.image}
            source={require('../../assets/Images/cross.png')}
          />
        )}
        {title === 'Pending' && (
          <Image
            style={styles.image}
            source={require('../../assets/Images/pending.png')}
          />
        )}
        {title === 'Total Finished' && (
          <Image
            style={styles.image}
            source={require('../../assets/Images/flag.png')}
          />
        )}
        {title === 'Total Assignments' && (
          <Image
            style={styles.image}
            source={require('../../assets/Images/flag.png')}
          />
        )}
        <Text style={styles.containerText}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.values}>{value}</Text>
        {/* <AnimatedProgressWheel
          size={responsiveScreenWidth(10)}
          width={responsiveScreenWidth(1.2)}
          color={color}
          progress={percentage || 0}
          backgroundColor={Colors.ForegroundOpacityColor}
          rotation={"-90deg"}
          showProgressLabel={true}
          rounded={false}
          labelStyle={styles.progressLabel}
          showPercentageSymbol={true}
        /> */}

        <CircularProgress
          activeColor={color}
          inActiveColor={Colors.PrimaryOpacityColor}
          progress={percentage}
          radius={20}
          strokeWidth={7}
          textColor={color}
          duration={1000}
          lineCap="butt"
        />
      </View>
    </View>
  );
};

export default CalendarProgressCart;

const getStyles = Colors =>
  StyleSheet.create({
    image: {
      height: 15, // Specify height here
      width: 15, // Specify width here
    },

    values: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.8),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    contentContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(0.5),
      width: '90%',
      alignSelf: 'center',
    },
    containerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.7),
      textTransform: 'capitalize',
    },
    container: {
      flex: 1,
      width: responsiveScreenWidth(39.5),
      backgroundColor: Colors.Background_color,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.3),
      color: Colors.Primary,
    },
  });
