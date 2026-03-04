import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import TextArea from './TextArea';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {
  setEventStatus,
  updateInvitations,
} from '../../../store/reducer/calendarReducer';
import {useDispatch} from 'react-redux';
import {showToast} from '../../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {
  loadCalendarEvent,
  loadEventInvitation,
} from '../../../actions/chat-noti';
import {TColors} from '../../../types';
type InvitationDeniedModalProps = {
  isDeniedModalVisible: boolean;
  setIsDeniedModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  toggleInvitationsDetailsModal: () => void;
  participantId: string;
};

type PayloadProps = {
  action: string;
  participantId: string;
  status: string;
  rejectionText?: string;
};

const InvitationDeniedModal = ({
  isDeniedModalVisible,
  setIsDeniedModalVisible,
  id,
  toggleInvitationsDetailsModal,
  participantId,
}: InvitationDeniedModalProps) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [rejectionText, setRejectionText] = useState('');
  const dispatch = useDispatch();
  const handleRejectEvent = (payload: PayloadProps) => {
    toggleInvitationsDetailsModal();
    dispatch(updateInvitations({id}));
    setIsDeniedModalVisible(false);
    axiosInstance
      .patch(`/calendar/event/invitation/${id}`, payload)
      .then(res => {
        if (res.data.success) {
          // dispatch(
          //   setNewEvent({
          //     event: res.data.event,
          //     time: moment(res?.data?.event?.start).format('YYYY-M-D'),
          //   }),
          // );
          loadCalendarEvent();
          dispatch(setEventStatus('all'));
          loadEventInvitation();

          showToast({message: 'Event denied', background: Colors.Red});
          console.log('event invitation denied');
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error, null, 1));
      });
  };
  return (
    <KeyboardAvoidingView>
      <ReactNativeModal isVisible={isDeniedModalVisible}>
        <View style={styles.modalContainer}>
          <ModalBackAndCrossButton
            toggleModal={() => setIsDeniedModalVisible(false)}
          />
          <Text style={styles.message}>
            Write your denying reasons (Optional)
          </Text>
          <TextArea
            placeholderText={'Message...'}
            setState={setRejectionText}
            style={{
              maxHeight: 300,
            }}
          />
          <View style={styles.buttonParenCom}>
            <TouchableOpacity
              onPress={() => setIsDeniedModalVisible(false)}
              style={[
                styles.buttonContainer,
                {backgroundColor: Colors.PrimaryOpacityColor},
              ]}>
              <Text style={[styles.buttonText, {color: Colors.Primary}]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleRejectEvent({
                  action: 'status',
                  participantId: participantId,
                  status: 'denied',
                  rejectionText,
                });
              }}
              style={[
                styles.buttonContainer,
                {backgroundColor: Colors.LightRed},
              ]}>
              <Text style={[styles.buttonText, {color: Colors.Red}]}>
                Denied
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast config={toastConfig} />
      </ReactNativeModal>
    </KeyboardAvoidingView>
  );
};

export default InvitationDeniedModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    message: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      marginTop: responsiveScreenHeight(1.5),
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonContainer: {
      backgroundColor: 'red',
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: 4,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(2),
    },
    buttonParenCom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      justifyContent: 'center',
    },
    modalContainer: {
      maxHeight: responsiveScreenHeight(80),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenHeight(2),
    },
  });
