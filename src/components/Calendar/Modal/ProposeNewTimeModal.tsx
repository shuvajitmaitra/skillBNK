import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import CalendarIconSmall from '../../../assets/Icons/CalendarIconSmall';
import ClockIcon from '../../../assets/Icons/ClockIcon';
import moment from 'moment';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import {showToast} from '../../HelperFunction';
import {
  setEventStatus,
  updateInvitations,
} from '../../../store/reducer/calendarReducer';
import {useDispatch} from 'react-redux';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import axiosInstance from '../../../utility/axiosInstance';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {TColors} from '../../../types';
import {
  loadCalendarEvent,
  loadEventInvitation,
} from '../../../actions/chat-noti';

type ProposeNewTimeModalProps = {
  toggleProposeNewTime: () => void;
  isProposeNewTimeVisible: boolean;
  id: string;
  toggleInvitationsDetailsModal: () => void;
  participantId: string;
};

const ProposeNewTimeModal = ({
  toggleProposeNewTime,
  isProposeNewTimeVisible,
  id,
  toggleInvitationsDetailsModal,
  participantId,
}: ProposeNewTimeModalProps) => {
  const [fromTime, setFromTime] = useState(moment().format('hh:mm A'));
  const [toTime, setToTime] = useState(
    moment().add(15, 'minute').format('hh:mm A'),
  );

  const [date, setDate] = useState(new Date().toDateString());
  const [to, setTo] = useState(false);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerState, setPickerState] = useState<'date' | 'time' | 'dateTime'>(
    'date',
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const handleProposeNewTime = (payload: any) => {
    dispatch(updateInvitations({id}));
    toggleProposeNewTime();
    toggleInvitationsDetailsModal();
    axiosInstance
      .patch(`/calendar/event/invitation/${id}`, payload)
      .then(res => {
        if (res.data.success) {
          loadCalendarEvent();
          dispatch(setEventStatus('all'));
          loadEventInvitation();
          showToast({
            message: 'New time proposed',
          });
        }
      })
      .catch(error => {
        console.log(
          'error event invitation propose new time modal',
          JSON.stringify(error, null, 1),
        );
        toggleProposeNewTime();
        toggleInvitationsDetailsModal();
      });
  };
  const start = moment(date)
    .set({
      hour: moment(fromTime, 'hh:mm A').hour(),
      minute: moment(fromTime, 'hh:mm A').minute(),
    })
    .toISOString();

  const end = moment(date)
    .set({
      hour: moment(toTime, 'hh:mm A').hour(),
      minute: moment(toTime, 'hh:mm A').minute(),
    })
    .toISOString();
  return (
    <ReactNativeModal
      isVisible={isProposeNewTimeVisible}
      onBackdropPress={toggleProposeNewTime}>
      <View style={styles.container}>
        <ModalBackAndCrossButton toggleModal={toggleProposeNewTime} />
        <TouchableOpacity
          onPress={() => {
            setPickerState('date');
            setIsPickerVisible(true);
          }}
          style={[styles.input, {marginTop: responsiveScreenHeight(2)}]}>
          <Text style={styles.dateText}>{moment(date).format('LL')}</Text>
          <CalendarIconSmall />
        </TouchableOpacity>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            onPress={() => {
              setTo(false);
              setPickerState('time');
              setIsPickerVisible(true);
            }}
            style={styles.input}>
            <Text style={styles.dateText}>{fromTime}</Text>
            <ClockIcon size={15} />
          </TouchableOpacity>
          <Text style={styles.dateText}>to</Text>
          <TouchableOpacity
            onPress={() => {
              setTo(true);
              setPickerState('time');
              setIsPickerVisible(true);
            }}
            style={styles.input}>
            <Text style={styles.dateText}>{toTime}</Text>
            <ClockIcon size={15} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleProposeNewTime({
              action: 'status',
              participantId: participantId,
              status: 'proposedTime',
              proposedTime: {
                start,
                end,
              },
            });
          }}
          style={styles.buttonContainer}>
          <Text style={styles.ButtonText}>Apply</Text>
        </TouchableOpacity>

        {/* <CustomTimePicker
          setTime={to ? setToTime : setFromTime}
          mode={pickerState}
          setDate={setDate}
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        /> */}
        <CustomTimePicker
          setTime={to ? setToTime : setFromTime}
          mode={pickerState}
          time={to ? toTime : fromTime}
          setDate={setDate}
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        />
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default React.memo(ProposeNewTimeModal);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      width: '50%',
      backgroundColor: Colors.Primary,
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 7,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
    },
    ButtonText: {
      textAlign: 'center',
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginHorizontal: responsiveScreenWidth(5),
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 7,
      padding: 20,
    },
    input: {
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),

      gap: 15,
      minWidth: responsiveScreenWidth(35),
    },
    dateText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
