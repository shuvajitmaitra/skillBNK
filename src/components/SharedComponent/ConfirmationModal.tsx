import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import BinIcon from '../../assets/Icons/BinIcon';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import MyButton from '../AuthenticationCom/MyButton';
import {TColors} from '../../types';
type ConfirmationProps = {
  isVisible: boolean;
  title: string;
  description: string;
  okPress: () => void;
  cancelPress: () => void;
};

const ConfirmationModal = ({
  isVisible,
  title,
  description,
  okPress,
  cancelPress,
}: ConfirmationProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={styles.container}>
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: Colors.LightRed,
            borderRadius: 100,
            // marginBottom: "-50%",
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: -70,
            shadowColor: Colors.PureWhite,
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 3,
          }}>
          <BinIcon color={Colors.Red} size={50} />
        </View>
        <Text style={styles.Heading}>{title || ''}</Text>
        <Text style={styles.description}>{description || ''}</Text>
        <View style={styles.buttonContainer}>
          <MyButton
            bg={Colors.PrimaryOpacityColor}
            colour={Colors.Primary}
            onPress={() => {
              cancelPress();
            }}
            title={'No, Keep it.'}
          />
          <MyButton
            bg={Colors.ThemeWarningColor}
            colour={Colors.PureWhite}
            onPress={() => {
              okPress();
            }}
            title={'Yes, Delete!'}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default ConfirmationModal;

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
