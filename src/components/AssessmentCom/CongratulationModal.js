import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Modal from 'react-native-modal';
import CloseIcon from '../../assets/Icons/CloseIcon';

function CongratulationModal({
  congratulationModalVisible,
  setCongratulationModalVisible,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Modal isVisible={congratulationModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <TouchableOpacity
            onPress={() => setCongratulationModalVisible(false)}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View>
          <View style={styles.bgImgContainer}>
            <Image
              source={{uri: 'https://shorturl.at/jnMUZ'}}
              style={styles.bgImg}
            />
            <Text style={styles.modalHeading}>Congratulations!</Text>
          </View>
          <Text style={styles.modalSubHeading}>
            You have submitted the text successfully
          </Text>
          <View style={styles.okBtnContainer}>
            <TouchableOpacity
              onPress={() => setCongratulationModalVisible(false)}>
              <Text style={styles.okBtn}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default CongratulationModal;
const getStyles = Colors =>
  StyleSheet.create({
    bgImgContainer: {
      position: 'relative',
      width: responsiveScreenWidth(82),
      height: responsiveScreenHeight(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    bgImg: {
      width: responsiveScreenWidth(82),
      height: responsiveScreenHeight(20),
      objectFit: 'cover',
      borderRadius: 10,
    },
    line: {
      marginBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },

    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
    },
    modalHeading: {
      position: 'absolute',
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
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

    okBtn: {
      width: responsiveScreenWidth(30),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      backgroundColor: Colors.Primary,
      color: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(8),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      textAlign: 'center',
      justifyContent: 'center',
    },
    okBtnContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
  });
