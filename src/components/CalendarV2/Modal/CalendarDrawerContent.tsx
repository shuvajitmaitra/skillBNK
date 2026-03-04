import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {
  borderRadius,
  fontSizes,
  gGap,
  gMargin,
  gPadding,
} from '../../../constants/Sizes';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomFonts from '../../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CalendarStackParamList} from '../../../types/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import {FontistoIcon, MaterialIcon} from '../../../constants/Icons';

type CalendarDrawerContentProps = {
  onCancel: () => void;
  onAvailabilityPress: () => void;
  onHolidayPress: () => void;
  visible: boolean;
};

const CalendarDrawerContent = ({
  onCancel,
  visible,
  onAvailabilityPress,
  onHolidayPress,
}: CalendarDrawerContentProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const {pendingInvitationCount} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();
  return (
    <ReactNativeModal
      style={{...styles.container, ...{paddingTop: top}}}
      onBackdropPress={onCancel}
      isVisible={visible}
      animationIn={'slideInLeft'}
      // animationOutTiming={5000}
      animationOut={'slideOutLeft'}>
      <TouchableOpacity
        style={styles.drawerItemContainer}
        onPress={onAvailabilityPress}>
        <MaterialIcon
          name="event-available"
          size={25}
          color={Colors.BodyText}
        />
        <Text style={styles.drawerItemText}>Availability</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItemContainer}
        onPress={() => onHolidayPress()}>
        <FontistoIcon
          name="holiday-village"
          size={18}
          color={Colors.BodyText}
        />
        <Text style={styles.drawerItemText}>Holidays</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItemContainer}
        onPress={() => {
          onCancel();
          navigation.navigate('CalendarInvitationsV2');
        }}>
        <MaterialIcon
          name="insert-invitation"
          size={25}
          color={Colors.BodyText}
        />
        <Text style={styles.drawerItemText}>My Invitations</Text>
        {Boolean(pendingInvitationCount) && (
          <View
            style={{
              position: 'absolute',
              top: gGap(-3),
              right: gGap(-3),
              height: gGap(10),
              width: gGap(10),
              backgroundColor: Colors.Red,
              borderRadius: 100,
            }}
          />
        )}
      </TouchableOpacity>
    </ReactNativeModal>
  );
};

export default CalendarDrawerContent;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    drawerItemContainer: {
      backgroundColor: Colors.Background_color,
      paddingVertical: gPadding(3),
      paddingHorizontal: gPadding(10),
      borderRadius: borderRadius.small,
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
    },
    drawerItemText: {
      fontSize: fontSizes.body,
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
      width: '70%',
      margin: 0,
      padding: gPadding(10),
      justifyContent: 'flex-start',
      gap: gMargin(5),
    },
  });
