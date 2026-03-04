import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';

import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import MyButton from '../AuthenticationCom/MyButton';

import WarningIcon2 from '../../assets/Icons/WarningIcon2';
import {TColors} from '../../types';

const SaveConfirmationModal = ({
  isVisible = false,
  tittle = '',
  description = '',
  onExitPress = () => {},
  onContinuePress = () => {},
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={styles.container}>
        <View
          style={{
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 3,
          }}>
          {/* <BinIcon color={Colors.Red} size={50} /> */}
          <WarningIcon2 size={100} color={'#f7c603'} />
        </View>
        <Text style={styles.Heading}>{tittle || ''}</Text>
        <Text style={styles.description}>{description || ''}</Text>
        <View style={styles.buttonContainer}>
          <MyButton
            bg={Colors.Background_color}
            colour={Colors.BodyText}
            onPress={() => {
              onContinuePress();
            }}
            title={'Continue'}
          />
          <MyButton
            bg={Colors.ThemeWarningColor}
            colour={Colors.PureWhite}
            onPress={() => {
              onExitPress();
            }}
            title={'Exit!'}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default SaveConfirmationModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(4),
    },
    description: {
      color: Colors.BodyText,
      textAlign: 'center',
      width: '60%',
      marginTop: responsiveScreenHeight(-2),
      lineHeight: 20,
      fontFamily: CustomFonts.MEDIUM,
      // backgroundColor: "red",
    },
    Heading: {
      fontSize: responsiveFontSize(2.4),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    container: {
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 20,
      gap: 20,
    },
  });
