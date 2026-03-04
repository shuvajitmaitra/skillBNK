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
import {generateRandomHexId} from '../../HelperFunction';
import {addSpecificInterval} from '../../../store/reducer/calendarReducer';
import {useDispatch} from 'react-redux';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {TColors} from '../../../types';

const AddSpecificDateModal = ({
  toggleAddSpecificHoursModal,
  isSpecificHoursModalVisible,
}: {
  toggleAddSpecificHoursModal: () => void;
  isSpecificHoursModalVisible: boolean;
}) => {
  const [fromTime, setFromTime] = useState(moment().format('hh:mm A'));
  const [toTime, setToTime] = useState(
    moment().add(15, 'minute').format('hh:mm A'),
  );

  // Fix: Use ISO string instead of toString()
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [to, setTo] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerState, setPickerState] = useState<'date' | 'time' | 'dateTime'>(
    'date',
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const handleUpdateSpecificHours = () => {
    const data = {
      _id: generateRandomHexId(24),
      type: 'date',
      intervals: [
        {
          _id: generateRandomHexId(24),
          from: fromTime,
          to: toTime,
        },
      ],
      date: moment(date)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .utc()
        .format(),
    };
    dispatch(addSpecificInterval({data}));
    toggleAddSpecificHoursModal();
  };
  return (
    <ReactNativeModal
      isVisible={isSpecificHoursModalVisible}
      onBackdropPress={toggleAddSpecificHoursModal}>
      <View style={styles.container}>
        <ModalBackAndCrossButton toggleModal={toggleAddSpecificHoursModal} />
        <TouchableOpacity
          onPress={() => {
            setPickerState('date');
            setIsPickerVisible(true);
          }}
          style={[styles.input, {marginVertical: responsiveScreenHeight(2)}]}>
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
            handleUpdateSpecificHours();
          }}
          style={styles.buttonContainer}>
          <Text style={styles.ButtonText}>Apply</Text>
        </TouchableOpacity>

        <CustomTimePicker
          setTime={to ? setToTime : setFromTime}
          time={to ? toTime : fromTime}
          mode={pickerState}
          setDate={setDate}
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        />
      </View>
    </ReactNativeModal>
  );
};

export default React.memo(AddSpecificDateModal);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      width: '50%',
      backgroundColor: Colors.Primary,
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 7,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(2),
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
      // backgroundColor: "red",
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
      // marginBottom: responsiveScreenHeight(1),

      gap: 15,
      minWidth: responsiveScreenWidth(35),
    },
    dateText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
