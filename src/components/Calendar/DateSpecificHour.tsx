import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import RedCross from '../../assets/Icons/RedCorss';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {removeSpecificDateAvailability} from '../../store/reducer/calendarReducer';
import Divider from '../SharedComponent/Divider';
import {RootState} from '../../types/redux/root';
import {ISpecificHour} from '../../types/calendar/availabilities';
import {TColors} from '../../types';

const DateSpecificHour = React.memo(
  ({
    toggleAddSpecificHoursModal,
  }: {
    toggleAddSpecificHoursModal: () => void;
  }) => {
    const {specificHours} = useSelector((state: RootState) => state.calendar);
    const dispatch = useDispatch();

    const Colors = useTheme();
    const styles = getStyles(Colors);
    const handleRemoveDateSpecificHours = (index: number) => {
      dispatch(removeSpecificDateAvailability({index}));
    };
    return (
      <View style={styles.weekContainer}>
        <Text style={styles.heading}>Date-Specific Hours</Text>
        <Divider marginBottom={-0.5} marginTop={1} />
        <TouchableOpacity
          onPress={() => {
            toggleAddSpecificHoursModal();
          }}
          style={styles.btn}>
          <Text style={styles.btnText}>Add Date Specific Hours</Text>
        </TouchableOpacity>
        {specificHours?.map((item: ISpecificHour, index: number) => (
          <View key={item._id} style={styles.dateContainer}>
            <View style={styles.date}>
              <Text style={styles.dateTitle}>
                {moment(item.date).format('MMMM DD, YYYY')}
              </Text>
              <Text style={styles.dateText}>
                {item.intervals[0].from} - {item.intervals[0].to}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleRemoveDateSpecificHours(index);
              }}>
              <RedCross width={22} height={22} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  },
);

export default DateSpecificHour;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(2),
    },
    date: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(68),
    },
    dateTitle: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    dateText: {
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
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
    weekContainer: {
      paddingTop: responsiveScreenWidth(4),
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(2),
    },
    heading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
  });
