import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import CustomFonts from '../../../constants/CustomFonts';
import { useTheme } from '../../../context/ThemeContext';
import MyButton from '../../AuthenticationCom/MyButton';
import axiosInstance from '../../../utility/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import {
  addIntervals,
  removeIntervals,
  setAvailabilities,
  setAvailabilityData,
  setSpecificHoursData,
  toggleAvailabilitySwitch,
  updateBulkInterval,
  updateIntervalsTime,
} from '../../../store/reducer/calendarReducer';
import moment from 'moment';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import AddSpecificDateModal from './AddSpecificDateModal';
import ApplyIntervalsModal from './ApplyIntervalsModal';
import Divider from '../../SharedComponent/Divider';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import { RootState } from '../../../types/redux/root';
import { TColors } from '../../../types';
import { IAvailability } from '../../../types/calendar/availabilities';
import SaveConfirmationModal from '../../SharedComponent/SaveConfirmationModal';
import DateSpecificHour from '../DateSpecificHourV2';
import AvailabilityItem from './AvailabilityItemV2';
import { gFontSize, gGap, gHeight, gWidth } from '../../../constants/Sizes';
import { showToast } from '../../HelperFunction';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import Loading from '../../SharedComponent/Loading';
import { theme } from '../../../utility/commonFunction';
const hasChanges = (current: any, temp: any) => {
  if (JSON.stringify(current) === JSON.stringify(temp)) {
    return true;
  } else {
    return false;
  }
};

type AvailabilityProps = {
  toggleAvailability: () => void;
  setIsAvailabilityVisible: (isVisible: boolean) => void;
  isAvailabilityVisible: boolean;
};

type Indexes = {
  index: number;
  intervalIndex: number;
  period: 'from' | 'to';
};

export const CustomSwitch: React.FC<{
  value: boolean;
  onValueChange: () => void;
}> = ({ value, onValueChange }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <TouchableOpacity
      style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
      onPress={onValueChange}
    >
      <View
        style={[
          styles.switchThumb,
          value ? styles.switchThumbOn : styles.switchThumbOff,
        ]}
      />
    </TouchableOpacity>
  );
};

const AvailabilityModalV2: React.FC<AvailabilityProps> = React.memo(
  ({
    toggleAvailability,
    setIsAvailabilityVisible,
    isAvailabilityVisible,
  }: AvailabilityProps) => {
    const {
      availabilities = [],
      availabilityData,
      specificHours,
    } = useSelector((state: RootState) => state.calendar);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [from, setFrom] = useState(moment().format('hh:mm A'));
    const [to, setTo] = useState(moment().format('hh:mm A'));
    const [indexes, setIndexes] = useState<Indexes | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const Colors = useTheme();
    const styles = getStyles(Colors);

    function getCurrentTimeZone(): string {
      const now = new Date();
      const offsetMinutes = -now.getTimezoneOffset(); // getTimezoneOffset returns minutes behind UTC, negative for ahead
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const offsetStr = `${sign}${String(hours).padStart(2, '0')}:${String(
        minutes,
      ).padStart(2, '0')}`;

      const timeZoneCities: { [key: string]: string } = {
        '-12:00': 'Baker Island',
        '-11:00': 'American Samoa, Midway Atoll',
        '-10:00': 'Hawaii, Tahiti',
        '-09:30': 'Marquesas Islands',
        '-09:00': 'Alaska, Gambier Islands',
        '-08:00': 'Los Angeles, Vancouver',
        '-07:00': 'Denver, Phoenix',
        '-06:00': 'Chicago, Mexico City',
        '-05:00': 'New York, Toronto',
        '-04:00': 'Santiago, Caracas',
        '-03:30': "St. John's",
        '-03:00': 'Buenos Aires, Sao Paulo',
        '-02:00': 'South Georgia/Sandwich Islands',
        '-01:00': 'Azores, Cape Verde',
        '+00:00': 'London, Lisbon',
        '+01:00': 'Berlin, Paris',
        '+02:00': 'Cairo, Johannesburg',
        '+03:00': 'Moscow, Riyadh',
        '+03:30': 'Tehran',
        '+04:00': 'Dubai, Baku',
        '+04:30': 'Kabul',
        '+05:00': 'Karachi, Tashkent',
        '+05:30': 'Mumbai, New Delhi',
        '+05:45': 'Kathmandu',
        '+06:00': 'Astana, Dhaka',
        '+06:30': 'Yangon',
        '+07:00': 'Bangkok, Jakarta',
        '+08:00': 'Beijing, Singapore',
        '+08:45': 'Eucla',
        '+09:00': 'Tokyo, Seoul',
        '+09:30': 'Adelaide, Darwin',
        '+10:00': 'Sydney, Vladivostok',
        '+10:30': 'Lord Howe Island',
        '+11:00': 'Magadan, Solomon Islands',
        '+12:00': 'Auckland, Fiji',
        '+12:45': 'Chatham Islands',
        '+13:00': "Nuku'alofa, Tokelau",
        '+14:00': 'Kiritimati',
      };

      const displayCities = timeZoneCities[offsetStr] || 'Unknown Location';
      return `(GMT${offsetStr}) ${displayCities}`;
    }
    const timeZone = getCurrentTimeZone();
    const [schedule, setSchedule] = useState(availabilityData?.name || '');
    const { top, bottom } = useSafeAreaInsets();
    const [applyIntervalsModal, setApplyIntervalsModal] = useState(false);
    const [copyIndex, setCopyIndex] = useState<number | null>(null);
    const [tempAvailabilities, setTempAvailabilities] = useState<any[]>(
      availabilities || [],
    );
    const [saveConfirmationModal, setSaveConfirmationModal] = useState(false);

    useEffect(() => {
      const loadAvailabilities = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get('calendar/schedule/all');
          if (res.data.schedules.length > 0) {
            dispatch(setAvailabilityData(res?.data?.schedules[0]));
            setSchedule(res?.data?.schedules[0]?.name);
            dispatch(
              setAvailabilities({
                data: res?.data?.schedules[0]?.availability,
              }),
            );
            dispatch(
              setSpecificHoursData(res?.data?.schedules[0]?.availability),
            );
            setTempAvailabilities(availabilities || []);
          }
        } catch (error: any) {
          console.log(
            'To load schedule',
            JSON.stringify(error.response.data.error, null, 2),
          );
        } finally {
          setLoading(false);
        }
      };
      if (isAvailabilityVisible) {
        console.log(
          'Load availability function called----------------------------------------',
        );
        loadAvailabilities();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAvailabilityVisible]);

    const toggleApplyIntervalsModal = useCallback(() => {
      setApplyIntervalsModal(prev => !prev);
    }, []);

    const handleToggleChange = useCallback(
      (index: number) => {
        dispatch(toggleAvailabilitySwitch({ index }));
      },
      [dispatch],
    );

    const [isSpecificHoursModalVisible, setIsSpecificHoursModalVisible] =
      useState(false);

    const toggleAddSpecificHoursModal = () => {
      setIsSpecificHoursModalVisible(prev => !prev);
    };

    const handleApplyButton = (days: { day: string; checked?: boolean }[]) => {
      dispatch(updateBulkInterval({ days, index: Number(copyIndex) }));
      toggleApplyIntervalsModal();
    };

    const handleAddIntervals = useCallback(
      (index: number) => {
        dispatch(addIntervals({ index }));
      },
      [dispatch],
    );

    const handleRemoveInterval = useCallback(
      (index: number, intervalIndex: number) => {
        dispatch(removeIntervals({ index, intervalIndex }));
      },
      [dispatch],
    );

    const data = {
      name: schedule,
      availability: [...(availabilities || []), ...(specificHours || [])],
      timeZone: availabilityData?.timeZone,
    };

    const handleUpdateAvailability = () => {
      if (!schedule) {
        return showToast({
          message: 'Name field is required.',
        });
      }

      axiosInstance
        .patch(`calendar/schedule/update/${availabilityData._id}`, data)
        .then(res => {
          dispatch(setAvailabilityData(res?.data?.schedule));
          showToast({
            message: 'Schedule updated successfully',
          });
          setIsAvailabilityVisible(false);
        })
        .catch(error => {
          console.log(
            'error you got from availability modal',
            JSON.stringify(error.response.data, null, 1),
          );
        });
    };

    return (
      <Modal
        style={{
          margin: 0,
          backgroundColor: Colors.Background_color,
          paddingTop: top / 1.5,
          paddingBottom: bottom / 2,
        }}
        isVisible={isAvailabilityVisible}
      >
        <TouchableOpacity
          style={styles.modalTop}
          onPress={() => {
            hasChanges(availabilities, tempAvailabilities) &&
            hasChanges(schedule, availabilityData.name)
              ? toggleAvailability()
              : setSaveConfirmationModal(true);
            // toggleAvailability();
            setTempAvailabilities([]);
          }}
        >
          <ArrowLeft />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <ScrollView style={{ zIndex: 10, paddingHorizontal: gGap(5) }}>
          <View style={styles.modalBody}>
            <Text style={styles.modalHeading}>Availability</Text>
            <Text style={styles.modalSubHeading}>
              You can select the available event date and time here.
            </Text>
            {/* Weekly hours */}
            <View style={[styles.weekContainer, { zIndex: 100 }]}>
              <Text style={styles.heading}>Weekly hours schedule:</Text>
              <Divider marginBottom={0.00001} marginTop={1} />
              <View>
                <Text style={styles.title}>Schedule Name</Text>
                <TextInput
                  keyboardAppearance={theme()}
                  style={styles.input}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={'Write schedule name...'}
                  value={schedule}
                  onChangeText={text => setSchedule(text)}
                />
                <Text style={styles.title}>
                  Current Time Zone
                  <Text style={styles.subTitle}> (Not editable)</Text>
                </Text>
                <TextInput
                  keyboardAppearance={theme()}
                  style={styles.input}
                  placeholder={timeZone}
                  value={timeZone}
                  editable={false}
                />
              </View>
              <Divider marginBottom={1.5} marginTop={1.5} />

              {loading ? (
                <Loading />
              ) : (
                <View style={styles.time}>
                  {availabilities.length > 0 ? (
                    availabilities.map((item: IAvailability, index: number) => (
                      <AvailabilityItem
                        key={item._id}
                        item={item}
                        index={index}
                        Colors={Colors}
                        handleToggleChange={handleToggleChange}
                        handleRemoveInterval={handleRemoveInterval}
                        handleAddIntervals={handleAddIntervals}
                        setIndexes={setIndexes}
                        setFrom={setFrom}
                        setTo={setTo}
                        setIsPickerVisible={setIsPickerVisible}
                        toggleApplyIntervalsModal={toggleApplyIntervalsModal}
                        setCopyIndex={setCopyIndex}
                      />
                    ))
                  ) : (
                    <NoDataAvailable />
                  )}
                </View>
              )}
            </View>

            <DateSpecificHour
              toggleAddSpecificHoursModal={toggleAddSpecificHoursModal}
            />

            <View style={styles.send}>
              <MyButton
                onPress={handleUpdateAvailability}
                title={'Save'}
                bg={Colors.Primary}
                colour={Colors.PureWhite}
              />
            </View>
          </View>

          <AddSpecificDateModal
            isSpecificHoursModalVisible={isSpecificHoursModalVisible}
            toggleAddSpecificHoursModal={toggleAddSpecificHoursModal}
          />
          <ApplyIntervalsModal
            applyIntervalsModal={applyIntervalsModal}
            toggleApplyIntervalsModal={toggleApplyIntervalsModal}
            handleApplyButton={handleApplyButton}
          />
        </ScrollView>

        <CustomTimePicker
          setTime={(timeString: string) => {
            if (indexes) {
              dispatch(
                updateIntervalsTime({
                  index: indexes?.index,
                  intervalIndex: indexes?.intervalIndex,
                  time: moment(timeString, 'hh:mm A').format('HH:mm'),
                  period: indexes?.period || '',
                }),
              );
            }
          }}
          mode={'time'}
          time={indexes?.period === 'from' ? from : to}
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        />
        <GlobalAlertModal />
        {saveConfirmationModal && (
          <SaveConfirmationModal
            isVisible={saveConfirmationModal}
            tittle={'Save'}
            description={'Are you sure you want to save the changes?'}
            onExitPress={() => {
              setSaveConfirmationModal(false);
              setIsAvailabilityVisible(false);
              dispatch(setAvailabilities({ data: tempAvailabilities }));
            }}
            onContinuePress={() => {
              setSaveConfirmationModal(false);
            }}
          />
        )}
      </Modal>
    );
  },
);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    dateTimePickerContainer: {
      backgroundColor: Colors.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      position: 'absolute',
      zIndex: 100,
    },
    dateTimePicker: {
      width: 200,
      height: 200,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
    },
    modalContainer: {
      backgroundColor: Colors.Foreground,
    },
    modalBody: {},
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingTop: 10,
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      paddingHorizontal: responsiveScreenWidth(2),
    },
    weekContainer: {
      paddingVertical: responsiveScreenWidth(2),
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Background_color,
      marginTop: responsiveScreenHeight(2),
    },
    heading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    title: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: 5,
    },
    subTitle: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
      paddingBottom: 5,
    },
    input: {
      color: Colors.BodyText,
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: 12,
    },
    field: {
      paddingBottom: responsiveScreenHeight(1.5),
      borderBottomWidth: 1.5,
      borderColor: Colors.BorderColor,
    },
    switch: {
      width: gWidth(30),
      height: gHeight(15),
      borderRadius: 20,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    switchOn: {
      backgroundColor: Colors.Primary,
    },
    switchOff: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    switchThumb: {
      width: gFontSize(12),
      height: gFontSize(12),
      borderRadius: 16,
    },
    switchThumbOn: {
      backgroundColor: Colors.Foreground,
      alignSelf: 'flex-end',
      // borderWidth: 1,
      // borderColor: Colors.BorderColor,
    },
    switchThumbOff: {
      backgroundColor: Colors.Primary,
      alignSelf: 'flex-start',
    },
    time: {
      flex: 1,
      gap: gGap(8),
    },
    btn: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      marginVertical: responsiveScreenHeight(2),
    },
    btnText: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    send: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default AvailabilityModalV2;
