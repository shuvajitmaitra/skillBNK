import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Modal from 'react-native-modal';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';

export default function ResultModal({isResultModalVisible, toggleResultModal}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Modal isVisible={isResultModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleResultModal} />
        </View>

        <View>
          <Text style={styles.modalHeading}>Enrollment Test Result</Text>
        </View>
        <View style={styles.totalContainer}>
          <View style={[styles.dataBox, {backgroundColor: '#4B56C0'}]}>
            <Text style={styles.boxText}>Total Questions</Text>
            <Text style={styles.number}>5</Text>
          </View>
          <View style={[styles.dataBox, {backgroundColor: '#00C177'}]}>
            <Text style={styles.boxText}>Total Answered</Text>
            <Text style={styles.number}>5</Text>
          </View>
          <View style={[styles.dataBox, {backgroundColor: '#EF7817'}]}>
            <Text style={styles.boxText}>Correct Answered</Text>
            <Text style={styles.number}>4</Text>
          </View>
        </View>

        <View style={styles.dataContainer}>
          <View style={styles.data}>
            <Text style={styles.dataText}>Program plans and fees:</Text>
            <Text style={styles.dataNumber}>$1500</Text>
          </View>
          <View style={styles.data}>
            <Text style={styles.dataText}>Mark Obtained:</Text>
            <Text style={styles.dataNumber}>80%</Text>
          </View>
          <View style={styles.data}>
            <Text style={styles.dataText}>Discount Obtained:</Text>
            <Text style={styles.dataNumber}>0%</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(1.5),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(2.5),
      paddingBottom: responsiveScreenHeight(1.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: '600',
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      textAlign: 'center',
      marginTop: responsiveScreenHeight(2),
    },
    totalContainer: {
      flexDirection: 'row',
      marginVertical: responsiveScreenHeight(2),
      justifyContent: 'space-between',
    },
    dataBox: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(3),
      width: responsiveScreenWidth(27),
    },
    boxText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.2),
      color: Colors.PureWhite,
      // textAlign: "center",
    },
    number: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      // marginLeft: responsiveScreenWidth(2),
    },
    dataContainer: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(3),
      flexDirection: 'column',
      gap: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
    },
    data: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: responsiveScreenWidth(2),
    },
    dataText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    dataNumber: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
    },
  });
