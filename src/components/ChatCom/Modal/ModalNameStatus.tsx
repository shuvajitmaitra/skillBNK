import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import CustomFonts from '../../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';

export default function ModalNameStatus() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleChat: chat} = useSelector((state: RootState) => state.chat);

  return (
    <View style={styles.modalProfileNameContainer}>
      <Text ellipsizeMode="tail" style={styles.profileName}>
        {chat?.isChannel
          ? chat?.name || 'Unavailable'
          : chat?.otherUser?.fullName || 'Unavailable'}
      </Text>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modalProfileNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      // backgroundColor: 'red',
    },

    profileName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
  });
