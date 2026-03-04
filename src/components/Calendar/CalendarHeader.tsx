import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import PlusCircleIcon from '../../assets/Icons/PlusCircleIcon';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';

const IIcons = Ionicons as any;

const CalendarHeader = ({toggleModal}: {toggleModal: () => void}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
            paddingBottom: 10,
          },
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.Foreground,
              padding: 10,
              borderRadius: 100,
            }}
            onPress={() => navigation.goBack()}>
            <IIcons name="chevron-back" size={25} color={Colors.BodyText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={toggleModal}>
            <PlusCircleIcon size={16} />
            <Text style={[styles.btnText]}>Create New Event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.MessageNotificationContainer}>
          <MessageNotificationContainer />
        </View>
      </View>
    </>
  );
};

export default CalendarHeader;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    btnText: {
      color: 'white',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    btn: {
      // width: responsiveScreenWidth(44),
      height: 40,
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
  });
