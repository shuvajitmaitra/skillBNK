import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {formatDynamicDate} from '../../utility/commonFunction';
import {TColors} from '../../types';
import RNText from '../SharedComponent/RNText';

const MessageDateContainer = ({time}: {time: string | Date}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.Divider} />
      <View style={styles.dateContainer}>
        <RNText style={styles.dateText}>{formatDynamicDate(time)}</RNText>
      </View>
      <View style={styles.Divider} />
    </View>
  );
};

export default MessageDateContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    dateText: {
      fontSize: RegularFonts.BR,
      color: Colors.BodyText,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    dateContainer: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors.BodyText,
      borderRadius: 100,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    Divider: {
      flex: 1,
      height: 1,
      backgroundColor: Colors.BodyText,
    },
  });
