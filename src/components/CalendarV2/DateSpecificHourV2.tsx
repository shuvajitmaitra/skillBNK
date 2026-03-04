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
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';

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
      <View>
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
            <Text style={styles.dateTitle}>
              {moment(item.date).format('LL')}
              {' | '}
              {item.intervals[0].from} - {item.intervals[0].to}
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleRemoveDateSpecificHours(index);
              }}>
              <RedCross width={30} height={30} />
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
      marginBottom: gGap(10),
      backgroundColor: Colors.Foreground,
      paddingVertical: gGap(8),
      paddingHorizontal: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
    },
    date: {
      // backgroundColor: Colors.Foreground,
    },
    dateTitle: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    btn: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      marginVertical: gGap(10),
    },
    btnText: {
      textAlign: 'center',
      fontSize: fontSizes.body,
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    heading: {
      color: Colors.Heading,
      fontSize: fontSizes.subHeading,
      fontFamily: CustomFonts.MEDIUM,
    },
  });
