import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {Text, View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import AlertIcon2 from '../../assets/Icons/AlertIcon2';
import ErrorIcon from '../../assets/Icons/ErrorIcon';
import SuccessIcon from '../../assets/Icons/SuccessIcon';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {setAlert} from '../../store/reducer/ModalReducer';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

// Define types for the alert data and alert state
// type AlertData = {
//   type?: 'error' | 'warning' | 'success';
//   title?: string;
//   message?: string;
//   link?: string;
// };

const GlobalAlertModal: React.FC = () => {
  const {alert} = useSelector((state: RootState) => state.modal);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  // Close the modal automatically after 3 seconds
  useEffect(() => {
    const showAlert = () => {
      dispatch(setAlert({visible: false, data: {}}));
    };
    if (alert.visible) {
      const timer = setTimeout(() => {
        showAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert.visible, dispatch]);
  return (
    <>
      {alert.visible && (
        <Modal
          isVisible={alert?.visible || false}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionOutTiming={0}
          onBackdropPress={() =>
            dispatch(setAlert({visible: false, data: {}}))
          }>
          <View style={styles.alertBox}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -70,
                shadowColor: Colors.PureWhite,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 3,
              }}>
              {(alert?.data?.type === 'error' && <ErrorIcon />) ||
                (alert?.data?.type === 'warning' && <AlertIcon2 />) ||
                (alert?.data?.type === 'success' && <SuccessIcon />)}
            </View>
            <Text style={styles.heading}>
              {alert?.data?.title || 'Success'}
            </Text>
            <Text style={styles.alertText}>
              {alert?.data?.message || 'Task is successful!'}
            </Text>
            {alert?.data?.link && (
              <Text style={styles.linkText}>
                {alert?.data?.link || 'portal.bootcampshub.ai'}
              </Text>
            )}
          </View>
        </Modal>
      )}
    </>
  );
};

export default GlobalAlertModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    alertBox: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      gap: 10,
    },
    alertText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
    },
    linkText: {
      color: Colors.Primary,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
      textAlign: 'center',
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(73),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.Primary,
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    } as any,
  });
