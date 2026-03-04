import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {Dimensions} from 'react-native';
import Images from '../../constants/Images';

function TopPart() {
  const deviceWidth = Dimensions.get('window').width;
  const {user} = useSelector(state => state.auth);
  const Colors = useTheme();

  const styles = getStyles(Colors, deviceWidth);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', width: '95%'}}>
        <Image
          source={
            user?.profilePicture
              ? {
                  uri: user?.profilePicture,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.image}
        />
        <View style={styles.userDetailsContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
            {user?.fullName || 'User Name'}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.userStatus}>Available</Text>
            <View style={styles.onlineStatus2}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (Colors, deviceWidth) =>
  StyleSheet.create({
    background: {
      backgroundColor: Colors.BackDropColor,
    },
    buttonText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    buttonContainer: {
      marginBottom: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 5,
      gap: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    popupContent: {
      paddingTop: 16,
      paddingHorizontal: 16,
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      // top: responsiveScreenHeight(0),
    },
    popupArrow: {
      // marginTop: responsiveScreenHeight(-2),
      borderTopColor: Colors.Foreground,
    },
    popUpContainer: {
      minWidth: responsiveScreenWidth(30),
    },
    container: {
      backgroundColor: Colors.Foreground,
      width: deviceWidth,
      flexDirection: 'row',
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(4),
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 3,
    },
    image: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(10),
    },
    userDetailsContainer: {
      marginLeft: responsiveScreenWidth(3),
      width: '80%',
    },
    userName: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
    },
    userStatus: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    onlineStatus2: {
      width: responsiveScreenWidth(2.5),
      height: responsiveScreenWidth(2.5),
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      marginLeft: responsiveScreenWidth(1),
      marginTop: 3,
    },
  });

export default TopPart;
