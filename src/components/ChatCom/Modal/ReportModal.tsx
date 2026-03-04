import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ModalCustomButton from './ModalCustomButton';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import {useGlobalAlert} from '../../SharedComponent/GlobalAlertContext';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import {TColors} from '../../../types';

type ReportModal = {
  toggleReportMembersModal: () => void;
  isReportMembersModalVisible: boolean;
};

const ReportModal = ({
  toggleReportMembersModal,
  isReportMembersModalVisible,
}: ReportModal) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const [value, setValue] = React.useState<string | number>('Harassment');

  const itemList = [
    {value: 'Harassment', label: 'Harassment'},
    {
      value: 'Sharing inappropriate things',
      label: 'Sharing inappropriate things',
    },
    {value: 'Hate speech', label: 'Hate speech'},
    {value: 'Scams', label: 'Scams'},
    {value: 'Others', label: 'Others'},
  ];
  // const itemList = [
  //   {
  //     topic: "Harassment",
  //   },
  //   {
  //     topic: "Sharing inappropriate things ",
  //   },
  //   {
  //     topic: "Hate speech",
  //   },
  //   {
  //     topic: "Scams",
  //   },
  //   {
  //     topic: "Others",
  //   },
  // ];
  const handleClick = () => {
    toggleReportMembersModal();
    return showAlert({
      title: 'Coming Soon...',
      type: 'warning',
      message: 'This feature is coming soon.',
    });
  };
  if (!isReportMembersModalVisible) {
    return;
  }
  return (
    <Modal
      backdropColor={Colors.BackDropColor}
      isVisible={isReportMembersModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          {/* Modal Back Button */}
          <View style={styles.topBarContainer}>
            <TouchableOpacity
              onPress={toggleReportMembersModal}
              style={styles.arrow}>
              <ArrowLeft />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={toggleReportMembersModal}>
              <CrossIcon />
            </TouchableOpacity>
          </View>
          {/* -------------------------- */}
          {/* ----------- Bottom border ----------- */}
          {/* -------------------------- */}
          <View style={styles.bottomBorder} />
          {/* -------------------------- */}
          {/* ----------- Main Content ----------- */}
          {/* -------------------------- */}
          <View style={styles.mainContent}>
            <Text style={styles.mainContentText}>Report</Text>
            <View>
              <Text style={styles.mainContentDescription}>
                Select appropriate reason for report
              </Text>
            </View>
            {/* -------------------------- */}
            {/* ----------- Radio button are start from here ----------- */}
            {/* -------------------------- */}
            <GlobalRadioGroup
              options={itemList}
              selectedValue={value}
              onSelect={(newValue: string | number) => setValue(newValue)}
            />

            {/* -------------------------- */}
            {/* ----------- Border Bottom ----------- */}
            {/* -------------------------- */}
            <View style={styles.bottomBorder} />
          </View>
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleReportMembersModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton
              toggleModal={handleClick}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Report"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    //  -------------------------------------------------------------
    // Modal radio button
    // -------------------------------------------------------------
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      marginHorizontal: responsiveScreenWidth(-1),
    },
    radioText: {
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
    },
    // Main Content
    mainContentText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    mainContentDescription: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.REGULAR,
    },
    mainContent: {
      gap: responsiveScreenHeight(1.5),
      paddingTop: responsiveScreenHeight(2.5),
    },
    // bottom border
    bottomBorder: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    // Cancel and the back button.................
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
      marginBottom: responsiveScreenHeight(2),
    },
    arrow: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      color: 'red',
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.ModalBoxColor,
      padding: responsiveScreenWidth(2.5),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },

    //   Main container...............
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalChild: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingBottom: responsiveScreenHeight(0),
      paddingTop: responsiveScreenHeight(2),
      maxHeight: responsiveScreenHeight(80),
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingVertical: responsiveScreenHeight(2.5),
    },
  });
