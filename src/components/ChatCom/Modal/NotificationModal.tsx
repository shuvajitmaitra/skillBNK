import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {setNMData} from '../../../store/reducer/chatSlice';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import CustomFonts from '../../../constants/CustomFonts';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import HorizontalLine from '../../../constants/HorizontalLine';
import ModalCustomButton from './ModalCustomButton';
import axiosInstance from '../../../utility/axiosInstance';
import {showToast} from '../../HelperFunction';
import moment from 'moment';
import {
  updateMyData,
  updateSingleChatMyData,
} from '../../../store/reducer/chatReducer';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import BlinkingText from '../../SharedComponent/BlinkingText';

const NotificationModal = () => {
  const {NMData} = useSelector((state: RootState) => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = React.useState<any | null>(null);

  const [isCustomTimePickerVisible, setCustomTimePickerVisible] =
    React.useState(false);

  const [dateUntil, setDateUntil] = React.useState<any | null>(null);

  useLayoutEffect(() => {
    if (!NMData?.notification?.isOn) {
      if (NMData) {
        const muteDate = NMData?.notification?.dateUntil
          ? moment(NMData.notification.dateUntil)
          : null;
        const now = moment();

        if (!muteDate) {
          setSelectedOption(3);
          setDateUntil(null);
        } else {
          const duration = moment.duration(muteDate.diff(now));
          const hoursDiff = duration.asHours();
          const daysDiff = duration.asDays();

          if (hoursDiff <= 1) {
            setSelectedOption(1);
          } else if (daysDiff < 1) {
            setSelectedOption(2);
          } else {
            setSelectedOption(4);
            setDateUntil(muteDate);
          }
        }
      }
    } else {
      setSelectedOption(3);
    }
  }, [NMData]);

  const options = [
    {
      value: 1,
      label: 'Mute for 1 hour',
    },
    {
      value: 2,
      label: 'Mute for 1 day',
    },
    {
      value: 3,
      label: 'Mute until I turn back on',
    },
    {
      value: 4,
      label: `Custom Time${dateUntil ? ':' : ''} ${
        dateUntil ? moment(dateUntil).format('YYYY-MM-DD hh:mm A') : ''
      }`,
    },
  ];

  const handleSelect = (value: any) => {
    setSelectedOption(value);
    if (value === 4) {
      setCustomTimePickerVisible(true);
    }
    if (dateUntil && value !== 4) {
      setDateUntil(null);
    }
  };

  const handleSave = () => {
    let data = {
      member: NMData?._id,
      selectedOption: selectedOption,
      dateUntil: selectedOption === 4 ? dateUntil : null,
      chat: NMData?.chatId,
      actionType: NMData?.notification?.isOn ? 'mutenoti' : 'unmutenoti',
    };

    axiosInstance
      .post('/chat/member/update', data)
      .then(res => {
        if (res.data.success) {
          dispatch(
            updateMyData({
              _id: NMData?.chatId,
              field: 'notification',
              value: res.data?.member?.notification,
            }),
          );
          dispatch(
            updateSingleChatMyData({
              field: 'notification',
              value: res.data?.member?.notification,
            }),
          );
          dispatch(setNMData(null));
          showToast({
            message: NMData.notification.isOn
              ? 'Chat muted successfully'
              : 'Chat unmuted successfully',
          });
        }
        // handleUpdateCallback(res.data?.member);
        // dispatch(
        //   updateMyData({
        //     _id: chatId,
        //     field: 'notification',
        //     value: res.data?.member?.notification,
        //   }),
        // );
        // setIsUpdating(false);
        // notification.success({message: 'Updated successfully'});
        // setSelectedOption(null);
        // setDateUntil(null);
        // modalClose();
      })
      .catch(err => {
        // setIsUpdating(false);
        // notification.error({message: err?.response?.data?.error});
        showToast({message: err?.response?.data?.error});
      });
  };
  const handleUnmute = () => {
    setSelectedOption(5);

    handleSave();
  };
  return (
    <ReactNativeModal isVisible={Boolean(NMData)}>
      <View style={styles.container}>
        <View style={styles.modalHeading}>
          <Text style={styles.modalHeadingText}>Notification Options</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(setNMData(null));
            }}>
            <CrossCircle size={30} />
          </TouchableOpacity>
        </View>
        <HorizontalLine marginVertical={10} />
        <Text style={styles.textHeading}>
          Other members will not see that you muted this chat. You will still be
          notified if you are mentioned.
        </Text>
        {!NMData?.notification?.isOn ? (
          <Text style={styles.textHeading2}>
            {selectedOption === 1 ? (
              'Already muted for 1 Hour'
            ) : selectedOption === 2 ? (
              'Already muted for 1 Day'
            ) : selectedOption === 3 ? (
              'Muted for until you turn it back'
            ) : selectedOption === 4 ? (
              `Muted till ${moment(NMData?.notification?.dateUntil).format(
                'MMM DD, YYYY',
              )} at ${moment(NMData?.notification?.dateUntil).format(
                'hh:mm A',
              )}`
            ) : (
              <BlinkingText>Loading...</BlinkingText>
            )}
          </Text>
        ) : (
          <GlobalRadioGroup
            options={options}
            onSelect={handleSelect}
            selectedValue={selectedOption}
          />
        )}
        <View style={styles.buttonContainer}>
          <ModalCustomButton
            textColor={Colors.Primary}
            backgroundColor={Colors.PrimaryOpacityColor}
            buttonText={'Cancel'}
            toggleModal={() => {
              dispatch(setNMData(null));
            }}
          />
          <ModalCustomButton
            textColor={Colors.PureWhite}
            backgroundColor={Colors.Primary}
            buttonText={NMData?.notification?.isOn ? 'Save' : 'Unmute'}
            toggleModal={NMData?.notification?.isOn ? handleSave : handleUnmute}
            customContainerStyle={{width: '30%'}}
            customTextStyle={{fontSize: 16}}
          />
        </View>
        {isCustomTimePickerVisible && (
          <CustomTimePicker
            mode="dateTime"
            setDate={d => {
              setDateUntil(d);
            }}
            // time={moment(dateUntil || undefined).format('hh:mm A')}
            setIsPickerVisible={() => {
              setCustomTimePickerVisible(false);
            }}
            isPickerVisible={isCustomTimePickerVisible}
            showPreviousDate={false}
          />
        )}
      </View>
    </ReactNativeModal>
  );
};

export default NotificationModal;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    modalHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalHeadingText: {
      fontSize: 22,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    container: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderRadius: 10,
    },
    textHeading: {
      fontSize: 16,
      color: Colors.BodyText,
      paddingBottom: 10,
      fontFamily: CustomFonts.REGULAR,
    },
    textHeading2: {
      fontSize: 16,
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: 15,
      borderRadius: 8,
      backgroundColor: Colors.LightRed,
      textAlign: 'center',
    },
  });
