import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import {TColors} from '../../types';

const BackNextButton = ({
  dataIndex,
  setDataIndex,
  length,
}: {
  dataIndex: number;
  setDataIndex: any;
  length: number;
}) => {
  const next = dataIndex === length - 1;
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity
        onPress={() => setDataIndex(dataIndex - 1)}
        style={[
          styles.backBtn,
          dataIndex === 0 && {
            backgroundColor: Colors.DisablePrimaryBackgroundColor,
          },
        ]}
        disabled={dataIndex === 0}>
        <ArrowLeftWhite
          color={
            dataIndex === 0 ? Colors.DisablePrimaryButtonTextColor : undefined
          }
        />
        <Text
          style={[
            styles.btnText,
            dataIndex === 0 && {
              color: Colors.DisablePrimaryButtonTextColor,
            },
          ]}>
          Back
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDataIndex(dataIndex + 1)}
        style={[
          styles.nextBtn,
          next && {
            backgroundColor: Colors.DisableSecondaryBackgroundColor,
          },
        ]}
        disabled={next}>
        <Text
          style={[
            styles.btnText,
            next && {color: Colors.DisableSecondaryButtonTextColor},
          ]}>
          Next
        </Text>
        <ArrowRightWhite
          color={next ? Colors.DisableSecondaryButtonTextColor : undefined}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackNextButton;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2),
      height: responsiveScreenHeight(3.5),
      // alignItems: "center"
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.SecondaryButtonTextColor,
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      // paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      // paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
  });
