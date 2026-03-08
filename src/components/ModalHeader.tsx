import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import ArrowLeft from '../assets/Icons/ArrowLeft';
import CloseIcon from '../assets/Icons/CloseIcon';
import CustomFonts from '../constants/CustomFonts';
type ModalHeaderProps = {
  text: string;
  toggleModal: () => void;
};
const ModalHeader = ({text, toggleModal}: ModalHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={toggleModal}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.headerText}>{text}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={toggleModal}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveScreenWidth(3),

    alignItems: 'center',
    height: responsiveScreenHeight(8),
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveScreenWidth(70),
  },
  headerRight: {
    width: responsiveScreenWidth(30),
  },

  headerImage: {
    width: responsiveScreenWidth(6),
    height: responsiveScreenHeight(3),
  },

  headerText: {
    fontSize: responsiveScreenFontSize(2.2),
    color: '#546A7E',
    marginLeft: responsiveScreenWidth(2),
    fontFamily: CustomFonts.REGULAR,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    width: responsiveScreenWidth(80),
    alignSelf: 'center',
  },
});
