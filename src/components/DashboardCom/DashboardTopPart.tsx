import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import DrawerIcon from '../../assets/Icons/DrawerIcon';
import SwapIcon from '../../assets/Icons/SwapIcon';
import MessageNotificationContainer from '../MessageNotificationContainer';
import Images from '../../constants/Images';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import store from '../../store';
import {toggleDrawer} from '../../store/reducer/authReducer';
import {theme} from '../../utility/commonFunction';

type DashboardTopPartProps = {
  statusSectionVisible: boolean;
  setStatusSectionVisible: React.Dispatch<React.SetStateAction<boolean>>;
  switchAvailable: boolean;
  setProSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DashboardTopPart({
  // statusSectionVisible,
  // setStatusSectionVisible,
  switchAvailable,
  setProSwitch,
}: DashboardTopPartProps) {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const handleDrawer = useCallback(() => {
    store.dispatch(toggleDrawer());
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={handleDrawer}>
          <DrawerIcon />
        </TouchableOpacity>

        <Image
          source={theme() === 'dark' ? Images.LOGO_DARK : Images.LOGO_REGULAR}
          style={{height: 40, width: 100}}
          resizeMode="contain"
        />
      </View>

      <View style={styles.messageNotificationContainer}>
        {switchAvailable && (
          <TouchableOpacity
            onPress={() => setProSwitch(prev => !prev)}
            style={styles.messageContainer}>
            <SwapIcon />
          </TouchableOpacity>
        )}

        <MessageNotificationContainer />
      </View>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    profileImageContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1.5),
    },
    image: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
    },

    messageNotificationContainer: {
      flexDirection: 'row',
      marginRight: responsiveScreenWidth(3),
    },
    messageContainer: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: Colors.Foreground,
      marginRight: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      position: 'relative',
    },
    messageIcon: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.Foreground,
    },
  });
