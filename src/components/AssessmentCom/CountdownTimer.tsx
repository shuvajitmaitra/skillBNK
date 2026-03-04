import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';

const CountdownTimer = ({
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 10,
}) => {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hours, minutes, seconds]);

  const formatNumber = (number: number) =>
    number < 10 ? `0${number}` : number;

  return (
    <View
      style={{
        paddingHorizontal: 10,
        // justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: "red",
        width: responsiveScreenWidth(25),
      }}>
      <Text style={styles.timer}>{formatNumber(hours)}</Text>
      <Text style={styles.timer}>:</Text>
      <Text style={styles.timer}>{formatNumber(minutes)}</Text>
      <Text style={styles.timer}>:</Text>
      <Text style={styles.timer}>{formatNumber(seconds)}</Text>
    </View>
  );
};

export default CountdownTimer;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    timer: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      marginRight: responsiveScreenWidth(1),
    },
  });
