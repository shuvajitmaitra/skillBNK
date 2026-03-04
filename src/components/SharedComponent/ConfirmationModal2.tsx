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
import {useDispatch, useSelector} from 'react-redux';
import {hideConfirmationModal} from '../../store/reducer/globalReducer';
import {RootState} from '../../types/redux/root';
import {IoniconsIcon} from '../../constants/Icons';

const ConfirmationModal2 = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // Get modal state from Redux store
  const {confirmModalInfo} = useSelector((state: RootState) => state.global);
  const {
    isConfirmModalVisible,
    modalTitle,
    modalMessage,
    onConfirmCallback,
    type,
  } = confirmModalInfo;
  const handleCancel = () => {
    dispatch(hideConfirmationModal());
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    dispatch(hideConfirmationModal());
  };

  return (
    <ReactNativeModal isVisible={isConfirmModalVisible}>
      <View style={styles.container}>
        {type === 'delete' ? (
          <View
            style={{
              height: 100,
              width: 100,
              backgroundColor: type === 'delete' ? Colors.LightRed : '#FF6600',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
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
        ) : (
          <IoniconsIcon
            name="information-circle-sharp"
            color={'#FF6600'}
            size={100}
          />
        )}
        <Text style={styles.Heading}>{modalTitle || 'Confirm Action'}</Text>
        <Text style={styles.description}>
          {modalMessage || 'Are you sure?'}
        </Text>
        <View style={styles.buttonContainer}>
          <MyButton
            bg={Colors.SecondaryButtonBackgroundColor}
            colour={Colors.SecondaryButtonTextColor}
            onPress={handleCancel}
            title={'No'}
          />
          <MyButton
            bg={type === 'delete' ? Colors.ThemeWarningColor : '#FF6600'}
            colour={Colors.PureWhite}
            onPress={handleConfirm}
            title={'Yes'}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default ConfirmationModal2;

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
