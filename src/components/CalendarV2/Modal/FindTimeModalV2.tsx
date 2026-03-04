import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {ISchedule, Interval} from '../../../types/calendar/event';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {fontSizes, gGap} from '../../../constants/Sizes';
import {MaterialIcon} from '../../../constants/Icons';

type FindTimeProps = {
  isModalVisible: boolean;
  toggleModal: (value: boolean) => void;
  schedule?: ISchedule;
  handleCheckboxToggle: (userId: string, action?: string) => void;
};
const FindTimeModalV2: React.FC<FindTimeProps> = ({
  isModalVisible,
  toggleModal,
  schedule,
  handleCheckboxToggle,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <ReactNativeModal isVisible={isModalVisible}>
      <View style={styles.container}>
        <MaterialIcon
          onPress={() => toggleModal(false)}
          name="cancel"
          style={{position: 'absolute', top: gGap(-10), right: gGap(-10)}}
          size={32}
          color={Colors.BodyText}
        />
        {schedule?.data &&
          schedule.data.intervals &&
          schedule.data.intervals.length > 0 && (
            <Text
              style={{
                color: Colors.Heading,
                fontSize: fontSizes.subHeading,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Availability for
              <Text style={{textTransform: 'capitalize'}}>
                {' '}
                {schedule.data.wday}
              </Text>
            </Text>
          )}
        {/* <ModalBackAndCrossButton toggleModal={() => toggleModal(false)} /> */}
        {schedule?.data &&
        schedule.data.intervals &&
        schedule.data.intervals.length > 0 ? (
          schedule.data.intervals.map((item: Interval) => (
            <View style={styles.timeContainer} key={item._id}>
              <TouchableOpacity style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>
                  {moment(item.from, 'HH:mm').format('hh:mm A')} -{' '}
                  {moment(item.to, 'HH:mm').format('hh:mm A')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCheckboxToggle(schedule.userId || '');
                  toggleModal(false);
                }}
                style={[
                  styles.subTimeDateContainer,
                  {
                    backgroundColor: Colors.Primary,
                    borderColor: Colors.Primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.timeDateText,
                    {color: Colors.PrimaryButtonTextColor},
                  ]}>
                  Invite
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <NoDataAvailable />
        )}
      </View>
    </ReactNativeModal>
  );
};

export default FindTimeModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    timeContainer: {
      // paddingVertical: responsiveScreenHeight(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeDateText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
    },
    subTimeDateContainer: {
      backgroundColor: Colors.ModalBoxColor,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      maxHeight: responsiveScreenHeight(80),
      padding: gGap(20),
      gap: gGap(10),
    },
  });
