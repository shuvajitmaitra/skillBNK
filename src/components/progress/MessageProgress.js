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

const MessageProgress = ({message}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const progress =
    ((message?.count / message?.limit) * 100 > 100
      ? 100
      : (message?.count / message?.limit) * 100) || 0;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Message</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
          }>
          <ArrowTopRight />
        </TouchableOpacity>
      </View>

      <Divider marginTop={1} marginBottom={1} />
      <View style={styles.cartContainer}>
        <View style={styles.progress}>
          {/* <AnimatedProgressWheel
            size={responsiveScreenWidth(40)}
            width={responsiveScreenWidth(5)}
            // rounded={false}
            color={Colors.Primary}
            progress={
              ((message?.count / message?.limit) * 100 > 100
                ? 100
                : (message?.count / message?.limit) * 100) || 0
            }
            backgroundColor={Colors.PrimaryOpacityColor}
            rotation={'30deg'}
            showProgressLabel={true}
            rounded={true}
            labelStyle={styles.progressLabel}
            showPercentageSymbol={true}
          /> */}
          <CircularProgress
            activeColor={Colors.Primary}
            inActiveColor={Colors.PrimaryOpacityColor}
            progress={progress}
            radius={70}
            strokeWidth={20}
            textColor={Colors.Primary}
          />
        </View>
        <View style={{flexGrow: 1}} />
        {
          <Text style={styles.details}>
            {message?.count} out of {message?.limit}
          </Text>
        }
      </View>
    </View>
  );
};

export default MessageProgress;

const getStyles = Colors =>
  StyleSheet.create({
    progress: {
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
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
