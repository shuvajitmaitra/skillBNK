import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {theme} from '../../utility/commonFunction';

export default function TopLogo({
  title,
  height,
}: {
  title: string;
  height?: number;
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <>
      <View style={[styles.logoContainer]}>
        <View
          style={{
            width: '100%',
            height: height || 150,
          }}>
          <Image
            source={
              theme() === 'light'
                ? require('../../assets/ApplicationImage/logo-regular.png')
                : require('../../assets/ApplicationImage/logo-dark.png')
            }
            style={styles.logo}
          />
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    logoContainer: {
      alignSelf: 'center',
      // backgroundColor: 'red',
      // position: "relative",
      // marginTop: responsiveScreenHeight(-5),
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      // backgroundColor: 'red',
      // marginBottom: responsiveScreenHeight(2),
    },
    text: {
      alignSelf: 'center',
      // position: "absolute",
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      // marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
      // top: "65%",
    },
  });
