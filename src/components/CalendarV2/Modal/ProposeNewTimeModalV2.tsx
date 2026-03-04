import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import CalendarIconSmall from '../../../assets/Icons/CalendarIconSmall';
import moment, {Moment} from 'moment';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {TColors} from '../../../types';
import {fontSizes, gGap, gHeight} from '../../../constants/Sizes';

type ProposeNewTimeModalProps = {
  onPropose: (arg0: any) => void;
  data: any;
  onCancel: (d: boolean) => void;
};

const ProposeNewTimeModalV2 = ({
  onPropose,
  data,
  onCancel,
}: ProposeNewTimeModalProps) => {
  const [objData, setObjData] = useState<any>({});
  const [startDate, setStartDate] = useState<Moment>(moment());
  const [endDate, setEndDate] = useState<Moment>(moment().add(15, 'minutes'));
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    setObjData(data);
    return () => {
      setObjData({});
    };
  }, [data]);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const now = moment();

  const isStartInvalid = useMemo(() => {
    return moment(startDate).isBefore(now);
  }, [now, startDate]);

  const isEndInvalid = useMemo(() => {
    const e = moment(endDate);
    const s = moment(startDate);

    if (e.isBefore(now)) return true;

    if (e.isSameOrBefore(s)) return true;

    return false;
  }, [endDate, now, startDate]);

  const isApplyDisabled = useMemo(() => {
    return isStartInvalid || isEndInvalid;
  }, [isStartInvalid, isEndInvalid]);

  const handleApply = () => {
    if (isApplyDisabled) return;

    onPropose({
      start: moment(startDate).toISOString(),
      end: moment(endDate).toISOString(),
      reason: objData.reason,
    });
  };

  return (
    <ReactNativeModal
      isVisible={objData.proposeVisible}
      onBackdropPress={() => {
        onCancel(false);
      }}
      avoidKeyboard={true}>
      <View style={styles.container}>
        <ModalBackAndCrossButton
          toggleModal={() => {
            onCancel(false);
          }}
        />

        {/* Start time */}
        <Text
          style={{
            color: Colors.BodyText,
            fontSize: fontSizes.body,
            fontWeight: '600',
            marginBottom: gGap(-8),
          }}>
          Start time
        </Text>

        <TouchableOpacity
          onPress={() => {
            setObjData({...objData, for: 'from'});
            setIsPickerVisible(true);
          }}
          style={[styles.input, isStartInvalid && styles.invalidInput]}>
          <Text style={styles.dateText}>
            {moment(startDate).format('LLLL')}
          </Text>
          <CalendarIconSmall />
        </TouchableOpacity>

        {/* End time */}
        <Text
          style={{
            color: Colors.BodyText,
            fontSize: fontSizes.body,
            fontWeight: '600',
            marginBottom: gGap(-8),
          }}>
          End time
        </Text>

        <TouchableOpacity
          onPress={() => {
            setObjData({...objData, for: 'to'});
            setIsPickerVisible(true);
          }}
          style={[styles.input, isEndInvalid && styles.invalidInput]}>
          <Text style={styles.dateText}>{moment(endDate).format('LLLL')}</Text>
          <CalendarIconSmall />
        </TouchableOpacity>

        {/* Reason */}
        <Text
          style={{
            color: Colors.BodyText,
            fontSize: fontSizes.body,
            fontWeight: '600',
            marginBottom: gGap(-8),
          }}>
          Reason (Optional)
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: Colors.BodyText,
              minHeight: gHeight(100),
              textAlignVertical: 'top',
            },
          ]}
          value={objData.reason}
          placeholder="Write reason..."
          placeholderTextColor={Colors.BodyText}
          onChangeText={t => setObjData({...objData, reason: t})}
          multiline={true}
        />

        {/* Apply */}
        <TouchableOpacity
          disabled={isApplyDisabled}
          onPress={handleApply}
          style={[
            styles.buttonContainer,
            isApplyDisabled && styles.buttonDisabled,
          ]}>
          <Text style={styles.ButtonText}>Apply</Text>
        </TouchableOpacity>

        {/* Picker */}
        <CustomTimePicker
          mode={'dateTime'}
          setDate={d => {
            const picked = moment(d);

            if (objData.for === 'from') {
              setStartDate(picked);
              // setEndDate(moment(picked).add(15, 'minutes'));
            }

            if (objData.for === 'to') {
              setEndDate(picked);
            }
          }}
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        />
      </View>

      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default React.memo(ProposeNewTimeModalV2);

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
    buttonDisabled: {
      opacity: 0.5,
    },
    ButtonText: {
      textAlign: 'center',
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 7,
      padding: 20,
      gap: gGap(10),
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
      gap: 15,
      minWidth: responsiveScreenWidth(35),
    },
    invalidInput: {
      borderColor: 'red',
    },
    dateText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
