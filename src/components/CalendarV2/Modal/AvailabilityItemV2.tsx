import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import {TColors} from '../../../types';
import CustomFonts from '../../../constants/CustomFonts';
import ClockIcon from '../../../assets/Icons/ClockIcon';
import RedCross from '../../../assets/Icons/RedCorss';
import Plus from '../../../assets/Icons/Plus';
import {CustomSwitch} from './AvailabilityModalV2';
import {
  borderRadius,
  fontSizes,
  gGap,
  gHeight,
  gWidth,
} from '../../../constants/Sizes';
import {IoniconsIcon} from '../../../constants/Icons';
import {theme} from '../../../utility/commonFunction';

interface AvailabilityItemProps {
  item: any;
  index: number;
  Colors: TColors;
  handleToggleChange: (index: number) => void;
  handleRemoveInterval: (index: number, intervalIndex: number) => void;
  handleAddIntervals: (index: number) => void;
  setIndexes: (indexes: {
    index: number;
    intervalIndex: number;
    period: 'from' | 'to';
  }) => void;
  setFrom: (time: string) => void;
  setTo: (time: string) => void;
  setIsPickerVisible: (visible: boolean) => void;
  toggleApplyIntervalsModal: () => void;
  setCopyIndex: (index: number) => void;
}

const AvailabilityItem: React.FC<AvailabilityItemProps> = ({
  item,
  index,
  Colors,
  handleToggleChange,
  handleRemoveInterval,
  handleAddIntervals,
  setIndexes,
  setFrom,
  setTo,
  setIsPickerVisible,
  toggleApplyIntervalsModal,
  setCopyIndex,
}) => {
  const styles = getItemStyles(Colors);

  return (
    <View key={item?._id} style={styles.row}>
      {/* <View style={{flex: 0.1, backgroundColor: 'blue'}}> */}
      <CustomSwitch
        value={item?.intervals?.length > 0}
        onValueChange={() => handleToggleChange(index)}
      />
      {/* </View> */}
      <Text style={[styles.dayText]}>{item?.wday?.slice(0, 3)}</Text>
      {item?.intervals?.length > 0 ? (
        <View
          style={{
            width: '84%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: gGap(10),
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <View style={{gap: gGap(8)}}>
            {item?.intervals?.map((interval: any, intervalIndex: number) => (
              <View style={styles.iconContainer} key={interval?._id}>
                <TouchableOpacity
                  onPress={() => {
                    setIndexes({index, intervalIndex, period: 'from'});
                    setFrom(moment(interval?.from, 'HH:mm').format('hh:mm A'));
                    setIsPickerVisible(true);
                  }}
                  style={styles.timeBox}>
                  <Text style={styles.dropDownText}>
                    {moment(interval?.from, 'HH:mm').format('hh:mm A')}
                  </Text>
                  <ClockIcon />
                </TouchableOpacity>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.to}>to</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIndexes({index, intervalIndex, period: 'to'});
                    setTo(moment(interval?.to, 'HH:mm').format('hh:mm A'));
                    setIsPickerVisible(true);
                  }}
                  style={styles.timeBox}>
                  <Text style={styles.dropDownText}>
                    {moment(interval?.to, 'HH:mm').format('hh:mm A')}
                  </Text>
                  <ClockIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.crossPlusButton}
                  onPress={() => handleRemoveInterval(index, intervalIndex)}>
                  <RedCross height={22} width={22} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.crossPlusButton}
                  onPress={() => handleAddIntervals(index)}>
                  <Plus size={22} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <IoniconsIcon
            // style={{paddingTop: gGap(10)}}
            onPress={() => {
              toggleApplyIntervalsModal();
              setCopyIndex(index);
            }}
            name="copy-outline"
            size={20}
            color={Colors.BodyText}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: gGap(10),
          }}>
          <TextInput
            style={styles.unavailable}
            placeholder="Unavailable"
            placeholderTextColor={Colors.BodyText}
            keyboardAppearance={theme()}
            editable={false}
            selectTextOnFocus={false}
          />
          <TouchableOpacity onPress={() => handleToggleChange(index)}>
            <Plus size={22} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const getItemStyles = (Colors: TColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      flex: 1,
      // backgroundColor: 'red',
      overflow: 'hidden',
    },
    dayText: {
      fontSize: fontSizes.small,
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      textTransform: 'capitalize',
      width: gWidth(26),
    },
    timeBox: {
      // flex: 0.35,
      gap: gGap(5),
      height: gHeight(28),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: gGap(10),
      width: gWidth(88),
    },
    dropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: fontSizes.small,
    },
    to: {
      fontSize: fontSizes.small,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(5),
      // backgroundColor: 'red',
      justifyContent: 'space-between',
    },
    crossPlusButton: {},
    copy: {
      // paddingVertical: 4,
      // marginLeft: 4,
      // borderRadius: 50,
      // marginTop: responsiveScreenHeight(0.4),
    },
    unavailable: {
      color: Colors.BodyText,
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      fontSize: fontSizes.small,
      fontFamily: CustomFonts.REGULAR,
      height: gHeight(27),
      width: '100%',
      paddingHorizontal: gGap(10),
    },
  });

export default AvailabilityItem;
