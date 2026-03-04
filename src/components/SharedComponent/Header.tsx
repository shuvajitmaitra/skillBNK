import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {TColors} from '../../types';

interface HeaderProps {
  navigation: {
    goBack: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({navigation}) => {
  const Colors = useTheme();
  const {top} = useSafeAreaInsets();
  const styles = getStyles(Colors);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingHorizontal: responsiveScreenWidth(2),
          paddingBottom: 3,
        },
      ]}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
          padding: 10,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: Colors.BorderColor,
        }}
        onPress={() => navigation.goBack()}>
        <ArrowLeft />
      </TouchableOpacity>

      <View style={styles.MessageNotificationContainer}>
        <MessageNotificationContainer />
      </View>
    </View>
  );
};

export default Header;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
  });
