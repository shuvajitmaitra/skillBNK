import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Modal from 'react-native-modal';
import CloseIcon from '../../assets/Icons/CloseIcon';
import CountdownTimer from './CountdownTimer';
import GlobalRadioGroup from '../SharedComponent/GlobalRadioButton';

function StartTestModal({
  isStartTestModalVisible,
  toggleStartTestModal,
  toggleCongratulationModal,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [value, setValue] = useState('In publishing and graphic design1');
  const options = [
    {label: 'In publishing and graphic design 1', value: 'option1'},
    {label: 'In publishing and graphic design 2', value: 'option2'},
    {label: 'In publishing and graphic design 3', value: 'option3'},
    {label: 'In publishing and graphic design 4', value: 'option4'},
  ];

  return (
    <Modal
      backdropColor={Colors.BackDropColor}
      isVisible={isStartTestModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Time Left:-</Text>

            <CountdownTimer initialMinutes={10} initialSeconds={0} />
          </View>
          <View>
            <TouchableOpacity onPress={toggleStartTestModal}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.modalBody}>
          <View>
            <Text style={styles.modalHeading}>Enrollment Test</Text>
            <Text style={styles.modalSubHeading}>
              Please select one answer and click
            </Text>
            <Text style={styles.nextBtnText}>Next Button</Text>
          </View>

          {/* --------------------------
   ----------- Question answer input field -----------
  -------------------------- */}

          <View style={styles.QuestionContainer}>
            <Text style={styles.question}>
              1. In publishing and graphic design, Lorem ipsum?
            </Text>
            <GlobalRadioGroup
              options={options}
              value={value}
              onChange={setValue}
              style={styles.radioButtonContainer}
            />
          </View>

          {/* ------------
                    -------Next------
                    ------------- */}
          <View style={styles.nextContainer}>
            <Text style={styles.queNo}>1 out of 5 questions</Text>
            <View>
              <TouchableOpacity onPress={toggleCongratulationModal}>
                <Text style={styles.nextBtn}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default StartTestModal;
const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),
      justifyContent: 'space-between',
    },

    timerContainer: {
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: responsiveScreenWidth(3),
      borderColor: Colors.Primary,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
      alignItems: 'center',
    },
    timerText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      fontWeight: '500',
    },
    time: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      fontWeight: '600',
    },
    timerBg: {
      backgroundColor: 'native',
      marginHorizontal: -5,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
      width: responsiveScreenWidth(80),
      alignSelf: 'center',
    },

    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      maxHeight: responsiveScreenHeight(80),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
      paddingVertical: responsiveScreenWidth(4.5),
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    QuestionContainer: {
      padding: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
    },
    question: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: responsiveScreenHeight(2),
    },
    label: {
      marginLeft: 5,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    radioButton: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      marginBottom: responsiveScreenWidth(5),
      borderRadius: responsiveScreenWidth(2),
    },
    nextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    queNo: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    nextBtn: {
      // width: responsiveScreenWidth(30),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      paddingHorizontal: responsiveScreenWidth(8),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
    },
    nextBtnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
    },
  });
