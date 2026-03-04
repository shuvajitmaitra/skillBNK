import {Alert, Button, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import MyButton from '../AuthenticationCom/MyButton';
import StartTestModal from './StartTestModal';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {showAlertModal} from '../../utility/commonFunction';

const AssessmentRulesModal = ({
  toggleModal,
  isModalVisible,
  toggleStartTestModal,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <ModalBackAndCrossButton toggleModal={toggleModal} />
        <View style={styles.modalBody}>
          <Text style={styles.modalHeading}>Follow These Rules</Text>
          <Text style={styles.modalSubHeading}>Kindly read the exam rules</Text>
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesText}>1. You can Select one answer.</Text>
            <Text style={styles.rulesText}>
              2. You will get 10 minutes for 10 question
            </Text>
            <Text style={styles.rulesText}>
              3. You can’t leave while answering.
            </Text>
            <Text style={styles.rulesText}>
              4. You will{' '}
              <Text style={{color: Colors.Primary}}>Get discount </Text>{' '}
              according to your mark
            </Text>
          </View>
          <View style={styles.btnArea}>
            <MyButton
              // onPress={handlePasswordSave}
              title={'See Result'}
              bg={'rgba(84, 106, 126, 1)'}
              colour={Colors.PureWhite}
            />
            <MyButton
              onPress={() =>
                showAlertModal({
                  title: 'Coming Soon',
                  type: 'warning',
                })
              }
              // onPress={toggleStartTestModal}
              title={'Start Test'}
              bg={Colors.Primary}
              colour={Colors.PureWhite}
            />
          </View>
        </View>
      </View>
      <GlobalAlertModal />
    </ReactNativeModal>
  );
};

export default AssessmentRulesModal;

const getStyles = Colors =>
  StyleSheet.create({
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(2),
    },
    rulesText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1.5),
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(50),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
      paddingVertical: responsiveScreenHeight(2),
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.3),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    rulesContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
    },
  });
